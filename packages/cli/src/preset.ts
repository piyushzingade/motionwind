import fs from "node:fs";
import path from "node:path";
import { BUILT_IN_PRESETS } from "motionwind-core";

const CONFIG_PATH = "motionwind.config.ts";

function managedConfig(
  presets: Record<string, string>,
  adapter?: string,
): string {
  const entries = Object.entries(presets)
    .map(
      ([name, classes]) =>
        `    ${JSON.stringify(name)}: ${JSON.stringify(classes)},`,
    )
    .join("\n");
  return `// motionwind-managed-config
import { defineConfig } from "motionwind-core";

export default defineConfig({
${adapter ? `  adapter: ${JSON.stringify(adapter)},\n` : ""}  reducedMotion: "user",
  strict: true,
  presets: {
${entries}
  },
});
`;
}

function currentManagedPresets(source: string): Record<string, string> {
  const presets: Record<string, string> = {};
  const match = source.match(/presets:\s*\{([\s\S]*?)\n\s*\}/);
  if (!match) return presets;
  const entry = /^\s*"([^"]+)":\s*"([^"]*)",?\s*$/gm;
  for (const item of match[1]!.matchAll(entry)) presets[item[1]!] = item[2]!;
  return presets;
}

export function runAddPreset(args: string[]): void {
  const name = args.find((arg) => !arg.startsWith("--"));
  const dryRun = args.includes("--dry-run");
  if (!name)
    throw new Error(
      `Choose a preset: ${Object.keys(BUILT_IN_PRESETS).join(", ")}`,
    );
  const classes = BUILT_IN_PRESETS[name];
  if (!classes)
    throw new Error(
      `Unknown preset "${name}". Available: ${Object.keys(BUILT_IN_PRESETS).join(", ")}`,
    );

  const file = path.join(process.cwd(), CONFIG_PATH);
  const source = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
  if (source && !source.includes("motionwind-managed-config")) {
    console.log(`\n${CONFIG_PATH} is user-managed and was preserved.`);
    console.log(
      `Add this entry to presets:\n\n  ${JSON.stringify(name)}: ${JSON.stringify(classes)}\n`,
    );
    return;
  }
  const presets = currentManagedPresets(source);
  presets[name] = classes;
  const adapter = source.match(/adapter:\s*"([^"]+)"/)?.[1];
  if (!dryRun) fs.writeFileSync(file, managedConfig(presets, adapter), "utf8");
  console.log(
    `\n${dryRun ? "Would add" : "Added"} animate-preset-${name} to ${CONFIG_PATH}.\n`,
  );
}
