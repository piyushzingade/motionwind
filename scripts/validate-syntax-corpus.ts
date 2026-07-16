import {
  analyzeClassName,
  parseMotionClasses,
  sortMotionClasses,
} from "../packages/motionwind-core/src/index.ts";
import { parseMotionClasses as parseNativeClasses } from "../packages/motionwind-react-native/src/parser.ts";
import { generateMotionCode } from "../packages/motionwind/src/codegen.ts";

type Target = "react" | "vue" | "javascript" | "react-native";
interface CorpusEntry {
  id: string;
  classes: string;
  targets: Target[];
}

const corpus = (await Bun.file(
  new URL("../fixtures/syntax-corpus.json", import.meta.url),
).json()) as CorpusEntry[];
const failures: string[] = [];

for (const entry of corpus) {
  const parsed = parseMotionClasses(entry.classes, { strict: true });
  for (const diagnostic of parsed.diagnostics.filter(
    ({ severity }) => severity === "error",
  )) {
    failures.push(`${entry.id}: ${diagnostic.message}`);
  }
  const analysis = analyzeClassName(entry.classes);
  if (analysis.unknown.length > 0) {
    failures.push(`${entry.id}: unknown syntax ${analysis.unknown.join(", ")}`);
  }
  const sorted = sortMotionClasses(entry.classes);
  if (sortMotionClasses(sorted) !== sorted)
    failures.push(`${entry.id}: sorting is not stable`);

  for (const target of entry.targets) {
    const output = generateMotionCode("div", entry.classes, {
      target,
      text: entry.id,
    });
    if (!output.trim())
      failures.push(`${entry.id}: ${target} generated no output`);
    if (target === "react-native") {
      const native = parseNativeClasses(entry.classes, { strict: true });
      for (const diagnostic of native.diagnostics.filter(
        ({ severity }) => severity === "error",
      )) {
        failures.push(`${entry.id} (react-native): ${diagnostic.message}`);
      }
    }
  }
}

if (failures.length > 0) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}

console.log(
  `Validated ${corpus.length} golden syntax cases across adapters and tooling.`,
);
