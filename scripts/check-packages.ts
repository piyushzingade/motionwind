import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dir, "..");
const packageRoot = path.join(root, "packages");
const failures: string[] = [];

for (const directory of fs.readdirSync(packageRoot)) {
  const cwd = path.join(packageRoot, directory);
  const manifest = path.join(cwd, "package.json");
  if (!fs.existsSync(manifest)) continue;
  const pkg = JSON.parse(fs.readFileSync(manifest, "utf8"));
  if (pkg.private) continue;
  try {
    execFileSync("npm", ["pack", "--dry-run", "--json"], {
      cwd,
      stdio: "pipe",
    });
    console.log(`✓ ${pkg.name}`);
  } catch (error) {
    failures.push(pkg.name);
    console.error(`✗ ${pkg.name}`);
  }
}

if (failures.length) {
  console.error(`Package checks failed: ${failures.join(", ")}`);
  process.exit(1);
}
