import { createRequire } from "node:module";
import { runDoctor } from "./doctor.js";
import { runInit } from "./init.js";
import { runMigrate } from "./migrate/index.js";
import { runAddPreset } from "./preset.js";

const _require = createRequire(import.meta.url);

function help(): void {
  console.log(`
create-motionwind

Commands:
  init [--framework=<name>] [--dry-run]  Install and configure an adapter
  doctor                                 Validate the current project
  migrate [path] [--write]               Convert Motion props to classes
  add <preset> [--dry-run]                Add a reviewed preset to config
  help                                   Show this message
  version, --version, -v                 Print the version number
`);
}

function printVersion(): void {
  const pkg = _require("../package.json") as { version: string };
  console.log(pkg.version);
}

const [, , rawCommand, ...args] = process.argv;
const command = rawCommand ?? "init";

try {
  if (command === "init") runInit(args);
  else if (command === "doctor") runDoctor();
  else if (command === "migrate") runMigrate(args);
  else if (command === "add") runAddPreset(args);
  else if (command === "help" || command === "--help" || command === "-h")
    help();
  else if (command === "version" || command === "--version" || command === "-v")
    printVersion();
  else
    throw new Error(
      `Unknown command "${command}". Run create-motionwind help.`,
    );
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`\n✗ ${message}\n`);
  process.exitCode = 1;
}
