import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

export type PackageManager = "npm" | "yarn" | "pnpm" | "bun";
export type Framework = "next" | "react" | "vue" | "vanilla" | "react-native";

export interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  [key: string]: unknown;
}

export interface ProjectInfo {
  cwd: string;
  framework: Framework;
  packageManager: PackageManager;
  packageJson: PackageJson;
}

export interface PlannedFile {
  path: string;
  content?: string;
  status: "create" | "configured" | "manual";
  message: string;
}

function hasDependency(pkg: PackageJson, name: string): boolean {
  return Boolean(pkg.dependencies?.[name] || pkg.devDependencies?.[name]);
}

export function detectPackageManager(cwd: string): PackageManager {
  if (
    fs.existsSync(path.join(cwd, "bun.lock")) ||
    fs.existsSync(path.join(cwd, "bun.lockb"))
  )
    return "bun";
  if (fs.existsSync(path.join(cwd, "pnpm-lock.yaml"))) return "pnpm";
  if (fs.existsSync(path.join(cwd, "yarn.lock"))) return "yarn";
  return "npm";
}

export function detectFramework(pkg: PackageJson): Framework {
  if (hasDependency(pkg, "expo") || hasDependency(pkg, "react-native"))
    return "react-native";
  if (hasDependency(pkg, "next")) return "next";
  if (hasDependency(pkg, "nuxt") || hasDependency(pkg, "vue")) return "vue";
  if (hasDependency(pkg, "react")) return "react";
  return "vanilla";
}

export function inspectProject(
  cwd = process.cwd(),
  override?: Framework,
): ProjectInfo {
  const packagePath = path.join(cwd, "package.json");
  let packageJson: PackageJson = {};
  if (fs.existsSync(packagePath)) {
    packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
  }
  return {
    cwd,
    framework: override ?? detectFramework(packageJson),
    packageManager: detectPackageManager(cwd),
    packageJson,
  };
}

export const FRAMEWORK_PACKAGES: Record<Framework, string[]> = {
  next: ["motionwind-react", "motion", "motionwind-core"],
  react: ["motionwind-react", "motion", "motionwind-core"],
  vue: ["motionwind-vue", "motion-v", "@vueuse/core", "motionwind-core"],
  vanilla: ["motionwind-vanilla", "motion", "motionwind-core"],
  "react-native": [
    "motionwind-react-native",
    "react-native-reanimated",
    "react-native-gesture-handler",
    "nativewind",
    "motionwind-core",
  ],
};

export function installPackages(project: ProjectInfo, dryRun: boolean): string {
  const packages = FRAMEWORK_PACKAGES[project.framework];
  const argsByManager: Record<PackageManager, string[]> = {
    npm: ["install", ...packages],
    yarn: ["add", ...packages],
    pnpm: ["add", ...packages],
    bun: ["add", ...packages],
  };
  const command = `${project.packageManager} ${argsByManager[project.packageManager].join(" ")}`;
  if (!dryRun) {
    execFileSync(
      project.packageManager,
      argsByManager[project.packageManager],
      {
        cwd: project.cwd,
        stdio: "inherit",
      },
    );
  }
  return command;
}

const MANAGED_CONFIG = `// motionwind-managed-config
import { defineConfig } from "motionwind-core";

export default defineConfig({
  adapter: "__ADAPTER__",
  reducedMotion: "user",
  strict: true,
  presets: {
    // create-motionwind add <preset> writes reviewed presets here.
  },
});
`;

function integrationCandidate(
  cwd: string,
  names: string[],
): string | undefined {
  return names.find((name) => fs.existsSync(path.join(cwd, name)));
}

export function planSetup(project: ProjectInfo): PlannedFile[] {
  const files: PlannedFile[] = [];
  const configPath = path.join(project.cwd, "motionwind.config.ts");
  if (fs.existsSync(configPath)) {
    files.push({
      path: configPath,
      status: "configured",
      message: "Existing motionwind.config.ts preserved.",
    });
  } else {
    files.push({
      path: configPath,
      status: "create",
      content: MANAGED_CONFIG.replace("__ADAPTER__", project.framework),
      message: "Create the typed Motionwind project configuration.",
    });
  }

  if (project.framework === "next") {
    const existing = integrationCandidate(project.cwd, [
      "next.config.ts",
      "next.config.mjs",
      "next.config.js",
      "next.config.cjs",
    ]);
    if (!existing) {
      files.push({
        path: path.join(project.cwd, "next.config.mjs"),
        status: "create",
        message: "Create a Next.js config with the Motionwind transform.",
        content: `import withMotionwind from "motionwind-react/next";\nimport motionwindConfig from "./motionwind.config.ts";\n\nexport default withMotionwind({}, motionwindConfig);\n`,
      });
    } else {
      const source = fs.readFileSync(path.join(project.cwd, existing), "utf8");
      files.push({
        path: path.join(project.cwd, existing),
        status: source.includes("withMotionwind") ? "configured" : "manual",
        message: source.includes("withMotionwind")
          ? "Next.js transform already configured."
          : `Wrap the existing export with withMotionwind(config, motionwindConfig); ${existing} was not changed automatically.`,
      });
    }
  }

  if (project.framework === "react" || project.framework === "vue") {
    const existing = integrationCandidate(project.cwd, [
      "vite.config.ts",
      "vite.config.js",
      "vite.config.mjs",
    ]);
    if (existing) {
      const source = fs.readFileSync(path.join(project.cwd, existing), "utf8");
      const marker =
        project.framework === "vue" ? "motionwindVue" : "motionwind";
      files.push({
        path: path.join(project.cwd, existing),
        status: source.includes(marker) ? "configured" : "manual",
        message: source.includes(marker)
          ? "Vite transform already configured."
          : `Add the ${project.framework === "vue" ? "motionwind-vue/vite" : "motionwind-react/vite"} transform before the framework plugin; ${existing} was preserved.`,
      });
    }
  }

  if (project.framework === "react-native") {
    const existing = integrationCandidate(project.cwd, [
      "babel.config.js",
      "babel.config.cjs",
    ]);
    files.push({
      path: path.join(project.cwd, existing ?? "babel.config.js"),
      status: existing ? "manual" : "create",
      message: existing
        ? "Ensure react-native-reanimated/plugin is the final Babel plugin; the existing file was preserved."
        : "Create an Expo-compatible Babel configuration.",
      content: existing
        ? undefined
        : `module.exports = {\n  presets: ["babel-preset-expo"],\n  plugins: ["react-native-reanimated/plugin"],\n};\n`,
    });
  }

  return files;
}

export function applySetup(files: PlannedFile[], dryRun: boolean): void {
  if (dryRun) return;
  for (const file of files) {
    if (file.status !== "create" || file.content === undefined) continue;
    fs.mkdirSync(path.dirname(file.path), { recursive: true });
    fs.writeFileSync(file.path, file.content, { encoding: "utf8", flag: "wx" });
  }
}
