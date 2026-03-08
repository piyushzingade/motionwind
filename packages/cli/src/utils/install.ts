import { execSync } from "child_process";
import type { PackageManager } from "./detect-project.js";

export function installDeps(
  packageManager: PackageManager,
  deps: string[],
  cwd: string,
): void {
  const commands: Record<PackageManager, string> = {
    npm: `npm install ${deps.join(" ")}`,
    yarn: `yarn add ${deps.join(" ")}`,
    pnpm: `pnpm add ${deps.join(" ")}`,
    bun: `bun add ${deps.join(" ")}`,
  };

  const cmd = commands[packageManager];
  execSync(cmd, { cwd, stdio: "inherit" });
}

export function installDevDeps(
  packageManager: PackageManager,
  deps: string[],
  cwd: string,
): void {
  const commands: Record<PackageManager, string> = {
    npm: `npm install -D ${deps.join(" ")}`,
    yarn: `yarn add -D ${deps.join(" ")}`,
    pnpm: `pnpm add -D ${deps.join(" ")}`,
    bun: `bun add -D ${deps.join(" ")}`,
  };

  const cmd = commands[packageManager];
  execSync(cmd, { cwd, stdio: "inherit" });
}
