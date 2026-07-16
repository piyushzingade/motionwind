import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  applySetup,
  detectFramework,
  detectPackageManager,
  FRAMEWORK_PACKAGES,
  inspectProject,
  planSetup,
} from "../src/project.js";

const temporaryDirectories: string[] = [];

function project(files: Record<string, string> = {}): string {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "motionwind-cli-"));
  temporaryDirectories.push(directory);
  for (const [name, content] of Object.entries(files)) {
    fs.writeFileSync(path.join(directory, name), content);
  }
  return directory;
}

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

describe("project detection", () => {
  it.each([
    [{ dependencies: { next: "latest", react: "latest" } }, "next"],
    [{ dependencies: { react: "latest" } }, "react"],
    [{ dependencies: { nuxt: "latest" } }, "vue"],
    [{ dependencies: { vue: "latest" } }, "vue"],
    [{ dependencies: { expo: "latest", react: "latest" } }, "react-native"],
    [{}, "vanilla"],
  ] as const)("detects %s as %s", (packageJson, expected) => {
    expect(detectFramework(packageJson)).toBe(expected);
  });

  it.each([
    ["bun.lock", "bun"],
    ["pnpm-lock.yaml", "pnpm"],
    ["yarn.lock", "yarn"],
  ] as const)("detects %s", (lockfile, expected) => {
    expect(detectPackageManager(project({ [lockfile]: "" }))).toBe(expected);
  });

  it("falls back to npm", () => {
    expect(detectPackageManager(project())).toBe("npm");
  });
});

describe("safe setup planning", () => {
  it("plans the published adapter for every framework", () => {
    expect(FRAMEWORK_PACKAGES.next).toContain("motionwind-react");
    expect(FRAMEWORK_PACKAGES.react).toContain("motionwind-react");
    expect(FRAMEWORK_PACKAGES.vue).toContain("motionwind-vue");
    expect(FRAMEWORK_PACKAGES.vanilla).toContain("motionwind-vanilla");
    expect(FRAMEWORK_PACKAGES["react-native"]).toContain(
      "motionwind-react-native",
    );
  });

  it("does not overwrite an existing Next.js config", () => {
    const cwd = project({
      "package.json": JSON.stringify({ dependencies: { next: "latest" } }),
      "next.config.ts": "export default {};",
    });
    const files = planSetup(inspectProject(cwd));
    expect(
      files.find(({ path: file }) => file.endsWith("next.config.ts"))?.status,
    ).toBe("manual");
  });

  it("dry-run setup does not create files", () => {
    const cwd = project({
      "package.json": JSON.stringify({ dependencies: { react: "latest" } }),
    });
    const files = planSetup(inspectProject(cwd));
    applySetup(files, true);
    expect(fs.existsSync(path.join(cwd, "motionwind.config.ts"))).toBe(false);
  });
});
