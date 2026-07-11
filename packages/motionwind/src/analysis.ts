import {
  parseMotionClasses,
  classifyMotionToken,
  type MotionTokenCategory,
} from "./parser.js";

export interface DuplicateProp {
  /** The gesture key (e.g. "whileHover") or "variant-{name}". */
  gesture: string;
  /** The duplicated animatable property (e.g. "scale"). */
  prop: string;
}

export interface ClassNameAnalysis {
  /** `animate-*` tokens that don't match any known motionwind pattern. */
  unknown: string[];
  /** Properties set more than once within the same gesture/variant. */
  duplicates: DuplicateProp[];
}

/** filter properties legitimately combine multiple functions, so never a dup. */
const COMBINABLE = new Set(["filter", "backdropFilter"]);

/**
 * Statically analyze a className for problems: unknown `animate-*` classes and
 * duplicate properties within a gesture/variant. Powers the ESLint plugin's
 * diagnostics without duplicating parser logic.
 */
export function analyzeClassName(className: string): ClassNameAnalysis {
  const tokens = className.split(/\s+/).filter(Boolean);
  const unknown: string[] = [];
  const duplicates: DuplicateProp[] = [];
  const seen = new Set<string>();

  for (const token of tokens) {
    if (!token.startsWith("animate-")) continue;
    const category = classifyMotionToken(token);
    if (category === "tailwind") continue;
    if (category === "unknown") {
      unknown.push(token);
      continue;
    }

    // Parse the single token to recover its gesture/variant + property keys.
    const parsed = parseMotionClasses(token);
    const record = (bucket: string, prop: string) => {
      if (COMBINABLE.has(prop)) return;
      const key = `${bucket}.${prop}`;
      if (seen.has(key)) duplicates.push({ gesture: bucket, prop });
      else seen.add(key);
    };
    for (const [gestureKey, vals] of Object.entries(parsed.gestures)) {
      for (const prop of Object.keys(vals)) record(gestureKey, prop);
    }
    for (const [name, vals] of Object.entries(parsed.variants)) {
      for (const prop of Object.keys(vals)) record(`variant-${name}`, prop);
    }
  }

  return { unknown, duplicates };
}

/** Canonical ordering rank per category (lower sorts first). */
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

/**
 * Sort the classes in a className into a canonical order:
 * variant defs → gestures → transition → viewport → scroll → drag → layout →
 * unknown → tailwind. Stable within each category. Powers the Prettier plugin.
 */
export function sortMotionClasses(className: string): string {
  const tokens = className.split(/\s+/).filter(Boolean);
  return tokens
    .map((token, idx) => ({
      token,
      rank: CATEGORY_RANK[classifyMotionToken(token)],
      idx,
    }))
    .sort((a, b) => (a.rank !== b.rank ? a.rank - b.rank : a.idx - b.idx))
    .map((t) => t.token)
    .join(" ");
}
