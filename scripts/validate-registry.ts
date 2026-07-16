import { readdirSync } from "node:fs";
import { join } from "node:path";
import {
  MOTIONWIND_RECIPES,
  parseMotionClasses,
  type MotionwindRecipe,
} from "../packages/motionwind-core/src/index.ts";

const registryDirectory = join(import.meta.dir, "..", "registry", "recipes");
const files = readdirSync(registryDirectory).filter((file) =>
  file.endsWith(".json"),
);
const manifests = await Promise.all(
  files.map(async (file) => ({
    file,
    manifest: (await Bun.file(
      join(registryDirectory, file),
    ).json()) as MotionwindRecipe,
  })),
);
const errors: string[] = [];
const ids = new Set<string>();
const fields: (keyof MotionwindRecipe)[] = [
  "id",
  "name",
  "description",
  "category",
  "classes",
  "accessibility",
  "adapters",
  "maintainer",
  "version",
  "compatibleCore",
  "bundleImpact",
  "source",
];

for (const { file, manifest } of manifests) {
  if (ids.has(manifest.id)) errors.push(`${file}: duplicate id ${manifest.id}`);
  ids.add(manifest.id);
  if (`${manifest.id}.json` !== file)
    errors.push(`${file}: filename must match id`);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(manifest.id)) {
    errors.push(`${file}: id must be kebab-case`);
  }
  for (const field of fields) {
    if (manifest[field] === undefined || manifest[field] === "") {
      errors.push(`${file}: missing ${field}`);
    }
  }

  const parsed = parseMotionClasses(manifest.classes, { strict: true });
  for (const diagnostic of parsed.diagnostics.filter(
    ({ severity }) => severity === "error",
  )) {
    errors.push(`${file}: ${diagnostic.message}`);
  }

  const bundled = MOTIONWIND_RECIPES.find(({ id }) => id === manifest.id);
  if (!bundled) {
    errors.push(`${file}: recipe is not exported by motionwind-core`);
    continue;
  }
  for (const field of fields) {
    if (JSON.stringify(manifest[field]) !== JSON.stringify(bundled[field])) {
      errors.push(`${file}: ${field} differs from the bundled recipe`);
    }
  }
}

for (const recipe of MOTIONWIND_RECIPES) {
  if (!ids.has(recipe.id))
    errors.push(`${recipe.id}: bundled recipe has no registry manifest`);
}

if (errors.length > 0) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

console.log(`Validated ${manifests.length} Motionwind recipe manifests.`);
