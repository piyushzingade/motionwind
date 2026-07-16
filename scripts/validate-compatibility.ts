import fs from "node:fs";
import path from "node:path";
import { REACT_CAPABILITIES } from "../packages/motionwind/src/adapter.ts";
import { VUE_CAPABILITIES } from "../packages/motionwind-vue/src/adapter.ts";
import { VANILLA_CAPABILITIES } from "../packages/motionwind-vanilla/src/adapter.ts";
import { REACT_NATIVE_CAPABILITIES } from "../packages/motionwind-react-native/src/adapter.ts";

type Status = "pass" | "beta" | "warning" | "unsupported" | "not-applicable";
type Capability = keyof typeof REACT_CAPABILITIES;
interface FrameworkEntry {
  adapter: keyof typeof adapters;
  tier: "stable" | "beta" | "community";
  browserScenarios: BrowserScenario[];
  features: Record<string, Status>;
}
interface Matrix {
  version: string;
  statuses: Status[];
  frameworks: Record<string, FrameworkEntry>;
}

const adapters = {
  react: REACT_CAPABILITIES,
  vue: VUE_CAPABILITIES,
  vanilla: VANILLA_CAPABILITIES,
  "react-native": REACT_NATIVE_CAPABILITIES,
};
type BrowserScenario =
  | "variant"
  | "layout"
  | "drag"
  | "inview"
  | "scroll"
  | "svg";
const scenarioFeatures: Record<BrowserScenario, string> = {
  variant: "variants",
  layout: "layout",
  drag: "drag",
  inview: "in-view",
  scroll: "scroll",
  svg: "svg",
};
const requiredFeatures = [
  "gestures",
  "scroll",
  "layout",
  "drag",
  "variants",
  "svg",
  "reduced-motion",
  "compile-time",
  "dynamic-classes",
  "keyboard-focus",
  "in-view",
  "ssr-hydration",
  "unsupported-warnings",
];
const capabilityFeatures = Object.keys(REACT_CAPABILITIES) as Capability[];
const root = path.resolve(import.meta.dir, "..");
const matrix = (await Bun.file(
  path.join(root, "fixtures", "compatibility-matrix.json"),
).json()) as Matrix;
const failures: string[] = [];

if (matrix.version !== "2.0.0")
  failures.push("matrix version must match Motionwind v2.0.0");
for (const [framework, entry] of Object.entries(matrix.frameworks)) {
  if (!fs.existsSync(path.join(root, "starters", framework))) {
    failures.push(`${framework}: installable starter is missing`);
  }
  for (const feature of requiredFeatures) {
    if (!entry.features[feature])
      failures.push(`${framework}: ${feature} has no declared status`);
  }
  if (new Set(entry.browserScenarios).size !== entry.browserScenarios.length) {
    failures.push(`${framework}: browser scenarios contain duplicates`);
  }
  for (const scenario of entry.browserScenarios) {
    const feature = scenarioFeatures[scenario];
    if (!feature) {
      failures.push(`${framework}: unknown browser scenario ${scenario}`);
    } else if (!["pass", "beta"].includes(entry.features[feature]!)) {
      failures.push(
        `${framework}: browser scenario ${scenario} targets ${feature}, which is marked ${entry.features[feature]}`,
      );
    }
  }
  const capabilities = adapters[entry.adapter];
  for (const feature of capabilityFeatures) {
    const supported = capabilities[feature];
    const status = entry.features[feature];
    if (supported && !["pass", "beta"].includes(status)) {
      failures.push(
        `${framework}: ${feature} is supported by the adapter but marked ${status}`,
      );
    }
    if (!supported && !["warning", "unsupported"].includes(status)) {
      failures.push(
        `${framework}: ${feature} is unsupported by the adapter but marked ${status}`,
      );
    }
  }
}

if (failures.length > 0) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}

console.log(
  `Validated the Motionwind v2 compatibility matrix for ${Object.keys(matrix.frameworks).length} frameworks.`,
);
