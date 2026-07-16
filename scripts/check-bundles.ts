import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dir, "..");
const budgets: Record<string, number> = {
  "motionwind-core": 170,
  "motionwind-react": 110,
  "motionwind-vue": 35,
  "motionwind-vanilla": 150,
  "motionwind-react-native": 100,
  "create-motionwind": 70,
  "eslint-plugin-motionwind": 25,
  "prettier-plugin-motionwind": 15,
  "motionwind-unplugin": 35,
  "motionwind-mcp": 20,
};
const packageDirectories: Record<string, string> = {
  "motionwind-core": "motionwind-core",
  "motionwind-react": "motionwind",
  "motionwind-vue": "motionwind-vue",
  "motionwind-vanilla": "motionwind-vanilla",
  "motionwind-react-native": "motionwind-react-native",
  "create-motionwind": "cli",
  "eslint-plugin-motionwind": "eslint-plugin-motionwind",
  "prettier-plugin-motionwind": "prettier-plugin-motionwind",
  "motionwind-unplugin": "motionwind-unplugin",
  "motionwind-mcp": "motionwind-mcp",
};

function filesIn(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? filesIn(file) : [file];
  });
}

const failures: string[] = [];
for (const [name, budget] of Object.entries(budgets)) {
  const directory = path.join(
    root,
    "packages",
    packageDirectories[name]!,
    "dist",
  );
  if (!fs.existsSync(directory)) {
    failures.push(`${name}: build output is missing`);
    continue;
  }
  const files = filesIn(directory);
  const JavaScript = files.filter((file) => /\.(?:js|cjs)$/.test(file));
  const bytes = JavaScript.reduce(
    (total, file) => total + fs.statSync(file).size,
    0,
  );
  const kibibytes = bytes / 1024;
  if (kibibytes > budget) {
    failures.push(
      `${name}: ${kibibytes.toFixed(1)} KiB exceeds ${budget} KiB budget`,
    );
  }
  for (const file of JavaScript) {
    if (!fs.existsSync(`${file}.map`)) {
      failures.push(
        `${name}: missing source map for ${path.relative(directory, file)}`,
      );
    }
  }

  if (!["create-motionwind", "motionwind-mcp"].includes(name)) {
    const manifest = JSON.parse(
      fs.readFileSync(
        path.join(root, "packages", packageDirectories[name]!, "package.json"),
        "utf8",
      ),
    );
    if (manifest.sideEffects !== false)
      failures.push(`${name}: sideEffects must be false`);
  }

  console.log(`✓ ${name}: ${kibibytes.toFixed(1)} KiB / ${budget} KiB`);
}

if (failures.length > 0) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}
