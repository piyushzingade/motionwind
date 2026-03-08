import fs from "fs";
import path from "path";

export type ProjectType = "nextjs" | "vite" | "cra" | "unknown";
export type PackageManager = "npm" | "yarn" | "pnpm" | "bun";

export function detectProjectType(cwd: string): ProjectType {
  const pkgPath = path.join(cwd, "package.json");
  if (!fs.existsSync(pkgPath)) return "unknown";

  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
  const allDeps = {
    ...pkg.dependencies,
    ...pkg.devDependencies,
  };

  if (allDeps["next"]) return "nextjs";
  if (allDeps["vite"]) return "vite";
  if (allDeps["react-scripts"]) return "cra";

  return "unknown";
}

export function detectPackageManager(cwd: string): PackageManager {
  if (fs.existsSync(path.join(cwd, "bun.lock")) || fs.existsSync(path.join(cwd, "bun.lockb")))
    return "bun";
  if (fs.existsSync(path.join(cwd, "pnpm-lock.yaml"))) return "pnpm";
  if (fs.existsSync(path.join(cwd, "yarn.lock"))) return "yarn";
  return "npm";
}
