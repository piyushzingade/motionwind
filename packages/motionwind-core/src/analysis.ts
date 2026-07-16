import {
  classifyMotionToken,
  parseMotionClasses,
  type MotionTokenCategory,
} from "./parser.js";
import type { MotionwindConfig } from "./config.js";

export interface DuplicateProp {
  gesture: string;
  prop: string;
}

export interface ClassNameAnalysis {
  unknown: string[];
  duplicates: DuplicateProp[];
}

const COMBINABLE = new Set(["filter", "backdropFilter"]);

export function analyzeClassName(
  className: string,
  config?: MotionwindConfig,
): ClassNameAnalysis {
  const tokens = className.split(/\s+/).filter(Boolean);
  const unknown: string[] = [];
  const duplicates: DuplicateProp[] = [];
  const seen = new Set<string>();

  for (const token of tokens) {
    if (!token.startsWith("animate-")) continue;
    const category = classifyMotionToken(token, config);
    if (category === "tailwind") continue;
    if (category === "unknown") {
      unknown.push(token);
      continue;
    }
    const parsed = parseMotionClasses(token, config);
    const record = (bucket: string, prop: string) => {
      if (COMBINABLE.has(prop)) return;
      const key = `${bucket}.${prop}`;
      if (seen.has(key)) duplicates.push({ gesture: bucket, prop });
      else seen.add(key);
    };
    for (const [gestureKey, values] of Object.entries(parsed.gestures)) {
      for (const prop of Object.keys(values)) record(gestureKey, prop);
    }
    for (const [name, values] of Object.entries(parsed.variants)) {
      for (const prop of Object.keys(values)) record(`variant-${name}`, prop);
    }
  }

  return { unknown, duplicates };
}

const CATEGORY_RANK: Record<MotionTokenCategory, number> = {
  variant: 0,
  gesture: 1,
  transition: 2,
  viewport: 3,
  scroll: 4,
  drag: 5,
  layout: 6,
  unknown: 7,
  tailwind: 8,
};

export function sortMotionClasses(
  className: string,
  config?: MotionwindConfig,
): string {
  return className
    .split(/\s+/)
    .filter(Boolean)
    .map((token, index) => ({
      token,
      rank: CATEGORY_RANK[classifyMotionToken(token, config)],
      index,
    }))
    .sort((a, b) => a.rank - b.rank || a.index - b.index)
    .map(({ token }) => token)
    .join(" ");
}
