import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const CYAN = "\x1b[36m";

type PackageManager = "npm" | "yarn" | "pnpm" | "bun";

function detectPackageManager(cwd: string): PackageManager {
  if (fs.existsSync(path.join(cwd, "bun.lock")) || fs.existsSync(path.join(cwd, "bun.lockb")))
    return "bun";
  if (fs.existsSync(path.join(cwd, "pnpm-lock.yaml"))) return "pnpm";
  if (fs.existsSync(path.join(cwd, "yarn.lock"))) return "yarn";
  return "npm";
}

function install(pm: PackageManager, cwd: string): void {
  const cmds: Record<PackageManager, string> = {
    npm: "npm install motionwind",
    yarn: "yarn add motionwind",
    pnpm: "pnpm add motionwind",
    bun: "bun add motionwind",
  };
  execSync(cmds[pm], { cwd, stdio: "inherit" });
}

// --- Main ---

const cwd = process.cwd();
const pm = detectPackageManager(cwd);

console.log(`\n${BOLD}motionwind${RESET}\n`);
console.log(`${CYAN}→${RESET} Detected package manager: ${BOLD}${pm}${RESET}`);
console.log(`${CYAN}→${RESET} Installing motionwind...\n`);

try {
  install(pm, cwd);
  console.log(`\n${GREEN}${BOLD}✓${RESET} motionwind installed successfully.\n`);
} catch {
  console.error(`\n${RED}${BOLD}✗${RESET} Failed to install. Run manually: ${BOLD}${pm} ${pm === "npm" ? "install" : "add"} motionwind${RESET}\n`);
  process.exit(1);
}
