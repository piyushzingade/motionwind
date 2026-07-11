import fs from "fs";
import path from "path";
import { migrateSource } from "./transform.js";

const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const CYAN = "\x1b[36m";
const DIM = "\x1b[2m";

const EXTENSIONS = new Set([".tsx", ".jsx", ".ts", ".js", ".mjs"]);
const IGNORE_DIRS = new Set([
  "node_modules",
  "dist",
  ".next",
  ".git",
  "build",
  "coverage",
  ".turbo",
]);

function collectFiles(target: string, out: string[]): void {
  let stat: fs.Stats;
  try {
    stat = fs.statSync(target);
  } catch {
    return;
  }
  if (stat.isDirectory()) {
    if (IGNORE_DIRS.has(path.basename(target))) return;
    for (const entry of fs.readdirSync(target)) {
      collectFiles(path.join(target, entry), out);
    }
  } else if (EXTENSIONS.has(path.extname(target))) {
    out.push(target);
  }
}

export function runMigrate(args: string[]): void {
  const write = args.includes("--write");
  const targets = args.filter((a) => !a.startsWith("--"));
  const roots = targets.length ? targets : ["."];

  console.log(`\n${BOLD}motionwind migrate${RESET}\n`);
  if (!write) {
    console.log(
      `${DIM}Dry run — no files written. Pass ${RESET}${BOLD}--write${RESET}${DIM} to apply.${RESET}\n`,
    );
  }

  const files: string[] = [];
  for (const root of roots) collectFiles(root, files);

  let filesChanged = 0;
  let totalConverted = 0;
  let totalSkipped = 0;

  for (const file of files) {
    const source = fs.readFileSync(file, "utf8");
    // Quick filter — only files that plausibly use motion.* elements.
    if (!source.includes("motion")) continue;

    let result;
    try {
      result = migrateSource(source);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.log(`${YELLOW}⚠${RESET} ${file} ${DIM}(skipped: ${msg})${RESET}`);
      continue;
    }

    if (!result.changed && result.skipped === 0) continue;

    totalConverted += result.converted;
    totalSkipped += result.skipped;

    const status =
      result.skipped > 0
        ? `${GREEN}${result.converted} converted${RESET}, ${YELLOW}${result.skipped} skipped${RESET}`
        : `${GREEN}${result.converted} converted${RESET}`;
    console.log(`${CYAN}→${RESET} ${file}  ${status}`);

    if (result.changed) {
      filesChanged++;
      if (write) fs.writeFileSync(file, result.code, "utf8");
    }
  }

  console.log(
    `\n${BOLD}${filesChanged}${RESET} file(s) ${write ? "updated" : "would change"}, ` +
      `${GREEN}${totalConverted}${RESET} element(s) converted, ` +
      `${YELLOW}${totalSkipped}${RESET} skipped (dynamic or unsupported props).`,
  );
  if (write && filesChanged > 0) {
    console.log(`${DIM}Run your formatter (e.g. prettier) to tidy the output.${RESET}\n`);
  } else {
    console.log("");
  }
}
