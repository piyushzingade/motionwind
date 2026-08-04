import type {
  AnimatableValues,
  GestureKey,
  ParsedResult,
  TransitionConfig,
  ViewportConfig,
  DragConfig,
  LayoutConfig,
  ScrollConfig,
  VariantMap,
  VariantState,
} from "./types.js";
import { GESTURE_MAP, GESTURE_KEYS, EASING_MAP } from "./constants.js";
import type {
  MotionwindConfig,
  MotionwindDiagnostic,
  MotionwindResultPatch,
} from "./config.js";
import { BUILT_IN_PRESETS } from "./recipes.js";

const CACHE_MAX = 1000;
const cache = new Map<string, ParsedResult>();

function presetClasses(value: string | readonly string[]): string[] {
  return (typeof value === "string" ? value.split(/\s+/) : [...value]).filter(
    Boolean,
  );
}

function availablePresets(
  config?: MotionwindConfig,
): Record<string, string | readonly string[]> {
  const pluginPresets = Object.assign(
    {},
    ...(config?.plugins ?? []).map((plugin) => plugin.presets ?? {}),
  );
  return { ...BUILT_IN_PRESETS, ...pluginPresets, ...(config?.presets ?? {}) };
}

function expandConfiguredTokens(
  className: string,
  config: MotionwindConfig | undefined,
  diagnostics: MotionwindDiagnostic[],
): string[] {
  const presets = availablePresets(config);
  const output: string[] = [];

  const expand = (token: string, stack: string[]) => {
    if (!token.startsWith("animate-preset-")) {
      const durationName = token.startsWith("animate-duration-")
        ? token.slice("animate-duration-".length)
        : "";
      const duration = durationName
        ? config?.tokens?.durations?.[durationName]
        : undefined;
      if (duration !== undefined) {
        output.push(`animate-duration-${duration}`);
        return;
      }

      const easingName = token.startsWith("animate-ease-")
        ? token.slice("animate-ease-".length)
        : "";
      const easing = easingName
        ? config?.tokens?.easings?.[easingName]
        : undefined;
      if (Array.isArray(easing)) {
        output.push(`animate-ease-[${easing.join(",")}]`);
        return;
      }

      const springName = token.startsWith("animate-spring-")
        ? token.slice("animate-spring-".length)
        : "";
      const spring = springName
        ? config?.tokens?.springs?.[springName]
        : undefined;
      if (spring) {
        output.push("animate-spring");
        if (spring.stiffness !== undefined)
          output.push(`animate-stiffness-${spring.stiffness}`);
        if (spring.damping !== undefined)
          output.push(`animate-damping-${spring.damping}`);
        if (spring.bounce !== undefined)
          output.push(`animate-bounce-${spring.bounce}`);
        if (spring.mass !== undefined)
          output.push(`animate-mass-${spring.mass}`);
        return;
      }

      output.push(token);
      return;
    }

    const name = token.slice("animate-preset-".length);
    const preset = presets[name];
    if (!preset) {
      diagnostics.push({
        code: "unknown-preset",
        message: `Unknown motionwind preset "${name}".`,
        severity: config?.strict ? "error" : "warning",
        token,
      });
      output.push(token);
      return;
    }
    if (stack.includes(name) || stack.length >= 8) {
      diagnostics.push({
        code: "circular-preset",
        message: `Circular motionwind preset expansion: ${[...stack, name].join(" → ")}.`,
        severity: "error",
        token,
      });
      return;
    }
    for (const expanded of presetClasses(preset))
      expand(expanded, [...stack, name]);
  };

  for (const token of className.split(/\s+/).filter(Boolean)) expand(token, []);
  return output;
}

function mergePatch(
  patch: MotionwindResultPatch,
  gestures: Partial<Record<GestureKey, AnimatableValues>>,
  transition: TransitionConfig,
  viewport: ViewportConfig,
  dragConfig: DragConfig,
  layoutConfig: LayoutConfig,
  scroll: ScrollConfig,
  variants: VariantMap,
  variantState: VariantState,
): void {
  for (const [key, values] of Object.entries(patch.gestures ?? {})) {
    gestures[key as GestureKey] = {
      ...(gestures[key as GestureKey] ?? {}),
      ...(values ?? {}),
    };
  }
  Object.assign(transition, patch.transition);
  Object.assign(viewport, patch.viewport);
  Object.assign(dragConfig, patch.dragConfig);
  Object.assign(layoutConfig, patch.layoutConfig);
  if (patch.scroll) {
    Object.assign(scroll, patch.scroll);
    if (patch.scroll.values)
      scroll.values = { ...scroll.values, ...patch.scroll.values };
  }
  for (const [name, values] of Object.entries(patch.variants ?? {})) {
    variants[name] = { ...(variants[name] ?? {}), ...values };
  }
  Object.assign(variantState, patch.variantState);
}

/** Tailwind CSS built-in animate-* classes to exclude from warnings */
const TAILWIND_ANIMATE_CLASSES = new Set([
  "animate-spin",
  "animate-ping",
  "animate-pulse",
  "animate-bounce",
  "animate-none",
]);

/** Evict oldest entries when cache exceeds max size */
function cacheSet(key: string, value: ParsedResult): void {
  if (cache.size >= CACHE_MAX) {
    // Map iterates in insertion order — delete the first (oldest) key
    const firstKey = cache.keys().next().value;
    if (firstKey !== undefined) cache.delete(firstKey);
  }
  cache.set(key, value);
}

/** Unit suffix map for string-unit values: x-100pct → "100%" */
const UNIT_MAP: Record<string, string> = {
  pct: "%",
  px: "px",
  vh: "vh",
  vw: "vw",
  rem: "rem",
  em: "em",
  dvh: "dvh",
  svh: "svh",
  lvh: "lvh",
};

/**
 * Try to parse a numeric value with an optional unit suffix.
 * Returns the number if no unit, or a string like "100%" / "50vh" if unit present.
 * Returns null if not a valid number.
 */
function parseNumericWithUnit(
  str: string,
  sign: number,
): string | number | null {
  // Check for "auto" keyword
  if (str === "auto") return "auto";

  // Check for unit suffix: e.g. "100pct", "50vh", "2rem"
  for (const [suffix, unit] of Object.entries(UNIT_MAP)) {
    if (str.endsWith(suffix)) {
      const numPart = str.slice(0, -suffix.length);
      const n = Number(numPart);
      if (isNaN(n)) return null;
      return `${n * sign}${unit}`;
    }
  }

  // Plain number
  const n = Number(str);
  if (isNaN(n)) return null;
  return n * sign;
}

/** Allowed properties for arbitrary value syntax [key=value] */
const ARBITRARY_VALUE_ALLOWLIST = new Set([
  "x",
  "y",
  "z",
  "scale",
  "scaleX",
  "scaleY",
  "scaleZ",
  "rotate",
  "rotateX",
  "rotateY",
  "rotateZ",
  "skew",
  "skewX",
  "skewY",
  "originX",
  "originY",
  "originZ",
  "perspective",
  "opacity",
  "filter",
  "backdropFilter",
  "clipPath",
  "width",
  "height",
  "top",
  "left",
  "right",
  "bottom",
  "padding",
  "margin",
  "gap",
  "borderRadius",
  "borderTopLeftRadius",
  "borderTopRightRadius",
  "borderBottomLeftRadius",
  "borderBottomRightRadius",
  "borderWidth",
  "fontSize",
  "letterSpacing",
  "lineHeight",
  "backgroundColor",
  "color",
  "borderColor",
  "boxShadow",
  "textShadow",
  "zIndex",
  "pathLength",
  "pathOffset",
  "pathSpacing",
]);

/**
 * Parse a property-value string (e.g. "scale-110", "x-20", "opacity-0")
 * into a Motion-compatible key-value pair.
 */
function parsePropertyValue(
  raw: string,
): { key: string; value: string | number | (string | number)[] } | null {
  // Arbitrary value: [key=value]
  if (raw.startsWith("[") && raw.endsWith("]")) {
    const inner = raw.slice(1, -1);
    const eqIdx = inner.indexOf("=");
    if (eqIdx === -1) return null;
    const key = inner.slice(0, eqIdx);
    if (!ARBITRARY_VALUE_ALLOWLIST.has(key)) return null;
    const val = inner.slice(eqIdx + 1);
    const num = Number(val);
    return { key, value: isNaN(num) ? val : num };
  }

  // Negative prefix
  let negative = false;
  let str = raw;
  if (str.startsWith("-")) {
    negative = true;
    str = str.slice(1);
  }

  const sign = negative ? -1 : 1;

  // Keyframe array syntax: property-[v1,v2,v3] — supports numbers and unit values
  const keyframeMatch = str.match(/^(\w+(?:-\w+)?)-\[([^\]]+)\]$/);
  if (keyframeMatch) {
    const propName = keyframeMatch[1]!;
    const valuesStr = keyframeMatch[2]!;
    const propKey = normalizePropertyName(propName);
    if (propKey) {
      const rawValues = valuesStr.split(",").reduce<string[]>((acc, v) => {
        const t = v.trim();
        if (t) acc.push(t);
        return acc;
      }, []);
      if (rawValues.length > 0) {
        const scaleProps = new Set([
          "scale",
          "scaleX",
          "scaleY",
          "scaleZ",
          "opacity",
          "brightness",
          "contrast",
          "saturate",
        ]);
        const parsed: (string | number)[] = [];
        let valid = true;
        for (const rv of rawValues) {
          const unitVal = parseNumericWithUnit(rv, 1);
          if (unitVal === null) {
            valid = false;
            break;
          }
          if (typeof unitVal === "number" && scaleProps.has(propKey)) {
            parsed.push(unitVal / 100);
          } else {
            parsed.push(unitVal);
          }
        }
        if (valid) {
          return { key: propKey, value: parsed };
        }
      }
    }
    // Fall through — may be shadow-[...] etc.
  }

  // --- Transform properties ---

  // scale-z-{n}
  if (str.startsWith("scale-z-")) {
    const n = Number(str.slice(8));
    if (!isNaN(n)) return { key: "scaleZ", value: (n / 100) * sign };
  }

  // scale-x-{n}
  if (str.startsWith("scale-x-")) {
    const n = Number(str.slice(8));
    if (!isNaN(n)) return { key: "scaleX", value: (n / 100) * sign };
  }
  if (str.startsWith("scale-y-")) {
    const n = Number(str.slice(8));
    if (!isNaN(n)) return { key: "scaleY", value: (n / 100) * sign };
  }

  // scale-{n}
  if (str.startsWith("scale-")) {
    const n = Number(str.slice(6));
    if (!isNaN(n)) return { key: "scale", value: (n / 100) * sign };
  }

  // rotate-x-{n} / rotate-y-{n}
  if (str.startsWith("rotate-x-")) {
    const n = Number(str.slice(9));
    if (!isNaN(n)) return { key: "rotateX", value: n * sign };
  }
  if (str.startsWith("rotate-y-")) {
    const n = Number(str.slice(9));
    if (!isNaN(n)) return { key: "rotateY", value: n * sign };
  }

  // rotate-{n}
  if (str.startsWith("rotate-")) {
    const n = Number(str.slice(7));
    if (!isNaN(n)) return { key: "rotate", value: n * sign };
  }

  // skew-x-{n}
  if (str.startsWith("skew-x-")) {
    const n = Number(str.slice(7));
    if (!isNaN(n)) return { key: "skewX", value: n * sign };
  }

  // skew-y-{n}
  if (str.startsWith("skew-y-")) {
    const n = Number(str.slice(7));
    if (!isNaN(n)) return { key: "skewY", value: n * sign };
  }

  // skew-{n} (uniform)
  if (str.startsWith("skew-")) {
    const n = Number(str.slice(5));
    if (!isNaN(n)) return { key: "skew", value: n * sign };
  }

  // origin-x-{n} (0-100 → 0-1)
  if (str.startsWith("origin-x-")) {
    const n = Number(str.slice(9));
    if (!isNaN(n)) return { key: "originX", value: (n / 100) * sign };
  }

  // origin-y-{n}
  if (str.startsWith("origin-y-")) {
    const n = Number(str.slice(9));
    if (!isNaN(n)) return { key: "originY", value: (n / 100) * sign };
  }

  // origin-z-{n}
  if (str.startsWith("origin-z-")) {
    const n = Number(str.slice(9));
    if (!isNaN(n)) return { key: "originZ", value: n * sign };
  }

  // perspective-{n}
  if (str.startsWith("perspective-")) {
    const n = Number(str.slice(12));
    if (!isNaN(n)) return { key: "perspective", value: n * sign };
  }

  // --- Translate with unit support: x-{n}, x-{n}pct, x-{n}vh, x-auto ---

  if (str.startsWith("x-")) {
    const val = parseNumericWithUnit(str.slice(2), sign);
    if (val !== null) return { key: "x", value: val };
  }

  if (str.startsWith("y-")) {
    const val = parseNumericWithUnit(str.slice(2), sign);
    if (val !== null) return { key: "y", value: val };
  }

  // z-{n} → zIndex for Tailwind-standard values (0, 10, 20, 30, 40, 50, auto).
  // Any other numeric value falls through to the z-translate handler below.
  if (str.startsWith("z-")) {
    const suffix = str.slice(2);
    if (suffix === "auto") return { key: "zIndex", value: "auto" };
    const zn = Number(suffix);
    if (!isNaN(zn) && [0, 10, 20, 30, 40, 50].includes(zn))
      return { key: "zIndex", value: zn };
  }

  // z-{n} → z-translate (arbitrary values with optional unit)
  if (str.startsWith("z-")) {
    const val = parseNumericWithUnit(str.slice(2), sign);
    if (val !== null) return { key: "z", value: val };
  }

  // --- Visual properties ---

  // opacity-{n}
  if (str.startsWith("opacity-")) {
    const n = Number(str.slice(8));
    if (!isNaN(n)) return { key: "opacity", value: (n / 100) * sign };
  }

  // blur-{n} — clamped to 0 minimum (negative blur is invalid CSS)
  if (str.startsWith("blur-")) {
    const n = Number(str.slice(5));
    if (!isNaN(n))
      return { key: "filter", value: `blur(${Math.max(0, n * sign)}px)` };
  }

  // brightness-{n} — clamped to 0 minimum
  if (str.startsWith("brightness-")) {
    const n = Number(str.slice(11));
    if (!isNaN(n))
      return {
        key: "filter",
        value: `brightness(${Math.max(0, (n / 100) * sign)})`,
      };
  }

  // contrast-{n} — clamped to 0 minimum
  if (str.startsWith("contrast-")) {
    const n = Number(str.slice(9));
    if (!isNaN(n))
      return {
        key: "filter",
        value: `contrast(${Math.max(0, (n / 100) * sign)})`,
      };
  }

  // saturate-{n} — clamped to 0 minimum
  if (str.startsWith("saturate-")) {
    const n = Number(str.slice(9));
    if (!isNaN(n))
      return {
        key: "filter",
        value: `saturate(${Math.max(0, (n / 100) * sign)})`,
      };
  }

  // grayscale-{n} — 0-100 → 0-1, clamped to 0 minimum
  if (str.startsWith("grayscale-")) {
    const n = Number(str.slice(10));
    if (!isNaN(n))
      return {
        key: "filter",
        value: `grayscale(${Math.max(0, (n / 100) * sign)})`,
      };
  }

  // sepia-{n} — 0-100 → 0-1, clamped to 0 minimum
  if (str.startsWith("sepia-")) {
    const n = Number(str.slice(6));
    if (!isNaN(n))
      return {
        key: "filter",
        value: `sepia(${Math.max(0, (n / 100) * sign)})`,
      };
  }

  // invert-{n} — 0-100 → 0-1, clamped to 0 minimum
  if (str.startsWith("invert-")) {
    const n = Number(str.slice(7));
    if (!isNaN(n))
      return {
        key: "filter",
        value: `invert(${Math.max(0, (n / 100) * sign)})`,
      };
  }

  // hue-rotate-{n} — degrees, supports negative values
  if (str.startsWith("hue-rotate-")) {
    const n = Number(str.slice(11));
    if (!isNaN(n))
      return { key: "filter", value: `hue-rotate(${n * sign}deg)` };
  }

  // drop-shadow: drop-shadow-[value] — underscores become spaces (Tailwind convention)
  if (str.startsWith("drop-shadow-")) {
    const val = str.slice(12);
    if (val.startsWith("[") && val.endsWith("]")) {
      return {
        key: "filter",
        value: `drop-shadow(${val.slice(1, -1).replace(/_/g, " ")})`,
      };
    }
  }

  // backdrop-blur-{n} — clamped to 0 minimum
  if (str.startsWith("backdrop-blur-")) {
    const n = Number(str.slice(14));
    if (!isNaN(n))
      return {
        key: "backdropFilter",
        value: `blur(${Math.max(0, n * sign)}px)`,
      };
  }

  // clip-path: clip-[value]
  if (str.startsWith("clip-")) {
    const val = str.slice(5);
    if (val.startsWith("[") && val.endsWith("]")) {
      return { key: "clipPath", value: val.slice(1, -1) };
    }
  }

  // --- Dimensions with unit support ---

  // Per-corner border radius (must come before generic rounded- check)
  if (str.startsWith("rounded-tl-")) {
    const n = Number(str.slice(11));
    if (!isNaN(n)) return { key: "borderTopLeftRadius", value: n * sign };
  }
  if (str.startsWith("rounded-tr-")) {
    const n = Number(str.slice(11));
    if (!isNaN(n)) return { key: "borderTopRightRadius", value: n * sign };
  }
  if (str.startsWith("rounded-bl-")) {
    const n = Number(str.slice(11));
    if (!isNaN(n)) return { key: "borderBottomLeftRadius", value: n * sign };
  }
  if (str.startsWith("rounded-br-")) {
    const n = Number(str.slice(11));
    if (!isNaN(n)) return { key: "borderBottomRightRadius", value: n * sign };
  }

  // rounded-{n}
  if (str.startsWith("rounded-")) {
    const n = Number(str.slice(8));
    if (!isNaN(n)) return { key: "borderRadius", value: n * sign };
  }

  // w-{n} / w-auto / w-{n}pct
  if (str.startsWith("w-")) {
    const val = parseNumericWithUnit(str.slice(2), sign);
    if (val !== null) return { key: "width", value: val };
  }

  // h-{n} / h-auto / h-{n}pct
  if (str.startsWith("h-")) {
    const val = parseNumericWithUnit(str.slice(2), sign);
    if (val !== null) return { key: "height", value: val };
  }

  // --- Position properties ---

  // top-{n} / top-{n}pct / top-auto
  if (str.startsWith("top-")) {
    const val = parseNumericWithUnit(str.slice(4), sign);
    if (val !== null) return { key: "top", value: val };
  }

  // left-{n}
  if (str.startsWith("left-")) {
    const val = parseNumericWithUnit(str.slice(5), sign);
    if (val !== null) return { key: "left", value: val };
  }

  // right-{n}
  if (str.startsWith("right-")) {
    const val = parseNumericWithUnit(str.slice(6), sign);
    if (val !== null) return { key: "right", value: val };
  }

  // bottom-{n}
  if (str.startsWith("bottom-")) {
    const val = parseNumericWithUnit(str.slice(7), sign);
    if (val !== null) return { key: "bottom", value: val };
  }

  // --- Spacing ---

  // p-{n} → padding
  if (str.startsWith("p-")) {
    const val = parseNumericWithUnit(str.slice(2), sign);
    if (val !== null) return { key: "padding", value: val };
  }

  // m-{n} → margin
  if (str.startsWith("m-")) {
    const val = parseNumericWithUnit(str.slice(2), sign);
    if (val !== null) return { key: "margin", value: val };
  }

  // gap-{n}
  if (str.startsWith("gap-")) {
    const val = parseNumericWithUnit(str.slice(4), sign);
    if (val !== null) return { key: "gap", value: val };
  }

  // --- Typography ---

  // text-size-{n} → fontSize
  if (str.startsWith("text-size-")) {
    const val = parseNumericWithUnit(str.slice(10), sign);
    if (val !== null) return { key: "fontSize", value: val };
  }

  // tracking-{n} → letterSpacing
  if (str.startsWith("tracking-")) {
    const val = parseNumericWithUnit(str.slice(9), sign);
    if (val !== null) return { key: "letterSpacing", value: val };
  }

  // leading-{n} → lineHeight
  if (str.startsWith("leading-")) {
    const val = parseNumericWithUnit(str.slice(8), sign);
    if (val !== null) return { key: "lineHeight", value: val };
  }

  // --- Border ---

  // border-w-{n} → borderWidth
  if (str.startsWith("border-w-")) {
    const n = Number(str.slice(9));
    if (!isNaN(n)) return { key: "borderWidth", value: n * sign };
  }

  // --- SVG path properties ---

  if (str.startsWith("path-length-")) {
    const n = Number(str.slice(12));
    if (!isNaN(n)) return { key: "pathLength", value: n * sign };
  }

  if (str.startsWith("path-offset-")) {
    const n = Number(str.slice(12));
    if (!isNaN(n)) return { key: "pathOffset", value: n * sign };
  }

  if (str.startsWith("path-spacing-")) {
    const n = Number(str.slice(13));
    if (!isNaN(n)) return { key: "pathSpacing", value: n * sign };
  }

  // --- Color properties ---

  if (str.startsWith("bg-")) {
    const color = str.slice(3);
    if (isValidColor(color)) {
      return { key: "backgroundColor", value: color };
    }
    return null;
  }

  // text-shadow: text-shadow-[value] — underscores become spaces
  if (str.startsWith("text-shadow-")) {
    const val = str.slice(12);
    if (val.startsWith("[") && val.endsWith("]")) {
      return {
        key: "textShadow",
        value: val.slice(1, -1).replace(/_/g, " "),
      };
    }
  }

  if (str.startsWith("text-")) {
    const color = str.slice(5);
    if (isValidColor(color)) {
      return { key: "color", value: color };
    }
    // fall through — could be text-size which is handled above
    return null;
  }

  if (str.startsWith("border-")) {
    const color = str.slice(7);
    if (isValidColor(color)) {
      return { key: "borderColor", value: color };
    }
    // fall through — could be border-w which is handled above
    return null;
  }

  // box-shadow: shadow-[value]
  if (str.startsWith("shadow-")) {
    const val = str.slice(7);
    if (val.startsWith("[") && val.endsWith("]")) {
      return { key: "boxShadow", value: val.slice(1, -1) };
    }
    return null;
  }

  return null;
}

/** Validate that a color string is a plausible CSS color */
const HEX_COLOR_RE = /^#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
const FUNC_COLOR_RE = /^(?:rgb|rgba|hsl|hsla)\(.+\)$/;

function isValidColor(color: string): boolean {
  return HEX_COLOR_RE.test(color) || FUNC_COLOR_RE.test(color);
}

/** Map shorthand property names to Motion property keys */
function normalizePropertyName(name: string): string | null {
  const map: Record<string, string> = {
    scale: "scale",
    "scale-x": "scaleX",
    "scale-y": "scaleY",
    "scale-z": "scaleZ",
    rotate: "rotate",
    "rotate-x": "rotateX",
    "rotate-y": "rotateY",
    x: "x",
    y: "y",
    z: "z",
    opacity: "opacity",
    "skew-x": "skewX",
    "skew-y": "skewY",
    skew: "skew",
    w: "width",
    h: "height",
    rounded: "borderRadius",
    "rounded-tl": "borderTopLeftRadius",
    "rounded-tr": "borderTopRightRadius",
    "rounded-bl": "borderBottomLeftRadius",
    "rounded-br": "borderBottomRightRadius",
    "origin-x": "originX",
    "origin-y": "originY",
    "origin-z": "originZ",
    perspective: "perspective",
  };
  return map[name] ?? null;
}

/** Normalize a scroll property name to a Motion style key. */
function normalizeScrollProp(name: string): string | null {
  const n = name.toLowerCase().replace(/-/g, "");
  const map: Record<string, string> = {
    x: "x",
    y: "y",
    z: "z",
    opacity: "opacity",
    rotate: "rotate",
    rotatex: "rotateX",
    rotatey: "rotateY",
    scale: "scale",
    scalex: "scaleX",
    scaley: "scaleY",
  };
  return map[n] ?? null;
}

/**
 * Parse a scroll value token like "y-[0,-200]" or "scaleX-[0,1]" into a
 * Motion style key and a literal output range. Unlike gesture values, scroll
 * ranges are NOT rescaled (0.5 means 0.5, 200 means 200px).
 */
function parseScrollValue(
  raw: string,
): { key: string; value: number[] } | null {
  const m = raw.match(/^([\w-]+?)-\[([^\]]+)\]$/);
  if (!m) return null;
  const key = normalizeScrollProp(m[1]!);
  if (!key) return null;
  const parts = m[2]!.split(",").map((v) => Number(v.trim()));
  if (parts.length < 2 || parts.some((n) => isNaN(n))) return null;
  return { key, value: parts };
}

/**
 * Classify a single class token and update the result accordingly.
 * Returns true if the token was consumed (is a motionwind class).
 */
function classifyToken(
  token: string,
  gestures: Partial<Record<GestureKey, AnimatableValues>>,
  transition: TransitionConfig,
  viewport: ViewportConfig,
  dragConfig: DragConfig,
  layoutConfig: LayoutConfig,
  scroll: ScrollConfig,
  variants: VariantMap,
  variantState: VariantState,
): boolean {
  if (!token.startsWith("animate-")) return false;

  const rest = token.slice(8);

  // --- Gesture prefix: animate-{gesture}:{property-value} ---
  const colonIdx = rest.indexOf(":");
  if (colonIdx !== -1) {
    const gesturePrefix = rest.slice(0, colonIdx);
    const propValueStr = rest.slice(colonIdx + 1);

    // Scroll-linked value: animate-scroll:{prop}-[from,to]
    if (gesturePrefix === "scroll") {
      const parsed = parseScrollValue(propValueStr);
      if (parsed) {
        scroll.values[parsed.key] = parsed.value;
        return true;
      }
      return false;
    }

    // Variant definition: animate-variant-{name}:{prop-value}
    if (gesturePrefix.startsWith("variant-")) {
      const variantName = gesturePrefix.slice(8);
      const parsed = parsePropertyValue(propValueStr);
      if (variantName && parsed) {
        if (!variants[variantName]) variants[variantName] = {};
        const bucket = variants[variantName]!;
        if (
          (parsed.key === "filter" || parsed.key === "backdropFilter") &&
          typeof parsed.value === "string" &&
          typeof bucket[parsed.key] === "string"
        ) {
          bucket[parsed.key] += ` ${parsed.value}`;
        } else {
          bucket[parsed.key] = parsed.value;
        }
        return true;
      }
      return false;
    }

    if (GESTURE_KEYS.has(gesturePrefix)) {
      const gestureKey = GESTURE_MAP[gesturePrefix]!;
      const parsed = parsePropertyValue(propValueStr);
      if (parsed) {
        if (!gestures[gestureKey]) gestures[gestureKey] = {};
        // Combine multiple filter/backdropFilter functions
        if (
          (parsed.key === "filter" || parsed.key === "backdropFilter") &&
          typeof parsed.value === "string" &&
          typeof gestures[gestureKey]![parsed.key] === "string"
        ) {
          gestures[gestureKey]![parsed.key] += ` ${parsed.value}`;
        } else {
          if (
            process.env.NODE_ENV !== "production" &&
            gestures[gestureKey]![parsed.key] !== undefined
          ) {
            console.warn(
              `[motionwind] Duplicate property "${parsed.key}" in "${gestureKey}" ` +
                `(class "${token}"). The last value will be used.`,
            );
          }
          gestures[gestureKey]![parsed.key] = parsed.value;
        }
        return true;
      }
    }
    return false;
  }

  // --- Transition config tokens ---

  // duration
  if (rest.startsWith("duration-")) {
    const ms = Number(rest.slice(9));
    if (!isNaN(ms)) {
      transition.duration = ms / 1000;
      return true;
    }
  }

  // delay-children (must come before delay)
  if (rest.startsWith("delay-children-")) {
    const ms = Number(rest.slice(15));
    if (!isNaN(ms)) {
      transition.delayChildren = ms / 1000;
      return true;
    }
  }

  // delay
  if (rest.startsWith("delay-")) {
    const ms = Number(rest.slice(6));
    if (!isNaN(ms)) {
      transition.delay = ms / 1000;
      return true;
    }
  }

  // ease-[n,n,n,n] — custom cubic-bezier
  if (rest.startsWith("ease-[") && rest.endsWith("]")) {
    const inner = rest.slice(6, -1);
    const values = inner.split(",").map((v) => Number(v.trim()));
    if (values.length === 4 && values.every((v) => !isNaN(v))) {
      transition.ease = values;
      return true;
    }
  }

  // ease-steps-{n}
  if (rest.startsWith("ease-steps-")) {
    const n = Number(rest.slice(11));
    if (!isNaN(n) && n > 0) {
      transition.ease = `steps(${n})`;
      return true;
    }
  }

  // Named easing from EASING_MAP
  for (const [suffix, easeValue] of Object.entries(EASING_MAP)) {
    if (rest === suffix) {
      transition.ease = easeValue;
      return true;
    }
  }

  // spring
  if (rest === "spring") {
    transition.type = "spring";
    return true;
  }

  // stiffness
  if (rest.startsWith("stiffness-")) {
    const n = Number(rest.slice(10));
    if (!isNaN(n)) {
      transition.stiffness = n;
      return true;
    }
  }

  // damping
  if (rest.startsWith("damping-")) {
    const n = Number(rest.slice(8));
    if (!isNaN(n)) {
      transition.damping = n;
      return true;
    }
  }

  // bounce
  if (rest.startsWith("bounce-")) {
    const n = Number(rest.slice(7));
    if (!isNaN(n)) {
      transition.bounce = n / 100;
      return true;
    }
  }

  // mass
  if (rest.startsWith("mass-")) {
    const n = Number(rest.slice(5));
    if (!isNaN(n)) {
      transition.mass = n / 10;
      return true;
    }
  }

  // repeat-infinite
  if (rest === "repeat-infinite") {
    transition.repeat = Infinity;
    return true;
  }

  // repeat-reverse
  if (rest === "repeat-reverse") {
    transition.repeatType = "reverse";
    return true;
  }

  // repeat-mirror
  if (rest === "repeat-mirror") {
    transition.repeatType = "mirror";
    return true;
  }

  // repeat-delay-{ms}
  if (rest.startsWith("repeat-delay-")) {
    const ms = Number(rest.slice(13));
    if (!isNaN(ms)) {
      transition.repeatDelay = ms / 1000;
      return true;
    }
  }

  // repeat-{n}
  if (rest.startsWith("repeat-")) {
    const n = Number(rest.slice(7));
    if (!isNaN(n)) {
      transition.repeat = n;
      return true;
    }
  }

  // stagger-reverse
  if (rest === "stagger-reverse") {
    transition.staggerDirection = -1;
    return true;
  }

  // stagger-{ms}
  if (rest.startsWith("stagger-")) {
    const ms = Number(rest.slice(8));
    if (!isNaN(ms)) {
      transition.staggerChildren = ms / 1000;
      return true;
    }
  }

  // when-before / when-after
  if (rest === "when-before") {
    transition.when = "beforeChildren";
    return true;
  }
  if (rest === "when-after") {
    transition.when = "afterChildren";
    return true;
  }

  // rest-speed-{n} (0.01 increments via hundredths)
  if (rest.startsWith("rest-speed-")) {
    const n = Number(rest.slice(11));
    if (!isNaN(n)) {
      transition.restSpeed = n;
      return true;
    }
  }

  // rest-delta-{n}
  if (rest.startsWith("rest-delta-")) {
    const n = Number(rest.slice(11));
    if (!isNaN(n)) {
      transition.restDelta = n;
      return true;
    }
  }

  // times-[0,0.5,1]
  if (rest.startsWith("times-[") && rest.endsWith("]")) {
    const inner = rest.slice(7, -1);
    const values = inner.split(",").map((v) => Number(v.trim()));
    if (!values.some(isNaN)) {
      transition.times = values;
      return true;
    }
  }

  // --- Viewport config tokens ---

  if (rest === "once") {
    viewport.once = true;
    return true;
  }

  if (rest === "amount-all") {
    viewport.amount = "all";
    return true;
  }

  if (rest.startsWith("amount-")) {
    const n = Number(rest.slice(7));
    if (!isNaN(n)) {
      viewport.amount = n / 100;
      return true;
    }
  }

  if (rest.startsWith("margin-")) {
    const n = Number(rest.slice(7));
    if (!isNaN(n)) {
      viewport.margin = `${n}px`;
      return true;
    }
  }

  // --- Scroll-linked config tokens ---

  if (rest === "scroll-axis-x") {
    scroll.axis = "x";
    return true;
  }
  if (rest === "scroll-axis-y") {
    scroll.axis = "y";
    return true;
  }
  if (rest === "scroll-container") {
    scroll.container = true;
    return true;
  }

  // scroll-offset-[start_end,end_start] — underscores become spaces
  if (rest.startsWith("scroll-offset-[") && rest.endsWith("]")) {
    const inner = rest.slice(15, -1);
    const parts = inner.split(",").map((p) => p.trim().replace(/_/g, " "));
    if (parts.length === 2) {
      scroll.offset = [parts[0]!, parts[1]!];
      return true;
    }
  }

  // --- Variant state selectors ---
  // animate-from-{name} → initial, animate-to-{name} → animate, animate-exit-{name} → exit
  if (rest.startsWith("from-")) {
    const name = rest.slice(5);
    if (name && !/\s/.test(name)) {
      variantState.initial = name;
      return true;
    }
  }
  if (rest.startsWith("to-")) {
    const name = rest.slice(3);
    if (name && !/\s/.test(name)) {
      variantState.animate = name;
      return true;
    }
  }
  if (rest.startsWith("exit-")) {
    const name = rest.slice(5);
    if (name && !/\s/.test(name)) {
      variantState.exit = name;
      return true;
    }
  }

  // --- Drag config tokens ---

  if (rest === "drag-x") {
    dragConfig.drag = "x";
    return true;
  }
  if (rest === "drag-y") {
    dragConfig.drag = "y";
    return true;
  }
  if (rest === "drag-both") {
    dragConfig.drag = true;
    return true;
  }

  if (rest.startsWith("drag-elastic-")) {
    const n = Number(rest.slice(13));
    if (!isNaN(n)) {
      dragConfig.dragElastic = n / 100;
      return true;
    }
  }

  if (rest === "drag-snap") {
    dragConfig.dragSnapToOrigin = true;
    return true;
  }
  if (rest === "drag-no-momentum") {
    dragConfig.dragMomentum = false;
    return true;
  }
  if (rest === "drag-lock") {
    dragConfig.dragDirectionLock = true;
    return true;
  }

  // drag-constraint-{side}-{n}
  if (rest.startsWith("drag-constraint-")) {
    const sub = rest.slice(16);
    const sides: Record<string, string> = {
      "t-": "top",
      "l-": "left",
      "r-": "right",
      "b-": "bottom",
    };
    for (const [prefix, side] of Object.entries(sides)) {
      if (sub.startsWith(prefix)) {
        const n = Number(sub.slice(2));
        if (!isNaN(n)) {
          if (!dragConfig.dragConstraints) dragConfig.dragConstraints = {};
          (dragConfig.dragConstraints as Record<string, number>)[side] = n;
          return true;
        }
      }
    }
  }

  // --- Layout config tokens ---

  if (rest === "layout") {
    layoutConfig.layout = true;
    return true;
  }
  if (rest === "layout-position") {
    layoutConfig.layout = "position";
    return true;
  }
  if (rest === "layout-size") {
    layoutConfig.layout = "size";
    return true;
  }
  if (rest === "layout-preserve") {
    layoutConfig.layout = "preserve-aspect";
    return true;
  }
  if (rest === "layout-scroll") {
    layoutConfig.layoutScroll = true;
    return true;
  }
  if (rest === "layout-root") {
    layoutConfig.layoutRoot = true;
    return true;
  }

  if (rest.startsWith("layout-id-")) {
    const id = rest.slice(10);
    if (id && !/\s/.test(id)) {
      layoutConfig.layoutId = id;
      return true;
    }
    return false;
  }

  return false;
}

/**
 * Parse a className string and extract motionwind classes into structured
 * Motion props. All non-motionwind classes pass through as tailwindClasses.
 *
 * Results are memoized by input string.
 */
export function parseMotionClasses(
  className: string,
  config?: MotionwindConfig,
): ParsedResult {
  const cached = config ? undefined : cache.get(className);
  if (cached) return cached;

  const diagnostics: MotionwindDiagnostic[] = [];
  const tokens = expandConfiguredTokens(className, config, diagnostics);
  const tailwind: string[] = [];
  const gestures: Partial<Record<GestureKey, AnimatableValues>> = {};
  const transition: TransitionConfig = {};
  const viewport: ViewportConfig = {};
  const dragConfig: DragConfig = {};
  const layoutConfig: LayoutConfig = {};
  const scroll: ScrollConfig = { axis: "y", container: false, values: {} };
  const variants: VariantMap = {};
  const variantState: VariantState = {};
  let reducedMotionPolicy: "reduce" | "safe" | undefined = undefined;

  for (const token of tokens) {
    // Detect and strip motion-reduce:/motion-safe: prefixes.
    // The inner token is processed normally; the prefix sets reducedMotionPolicy.
    let innerToken = token;
    if (token.startsWith("motion-reduce:")) {
      reducedMotionPolicy = "reduce";
      innerToken = token.slice("motion-reduce:".length);
    } else if (token.startsWith("motion-safe:")) {
      reducedMotionPolicy = "safe";
      innerToken = token.slice("motion-safe:".length);
    }
    // Skip empty inner tokens (e.g. a bare "motion-reduce:" with nothing after)
    if (!innerToken) continue;

    let consumed = classifyToken(
      innerToken,
      gestures,
      transition,
      viewport,
      dragConfig,
      layoutConfig,
      scroll,
      variants,
      variantState,
    );

    if (!consumed) {
      const easingName = innerToken.startsWith("animate-ease-")
        ? innerToken.slice("animate-ease-".length)
        : "";
      const easing = easingName
        ? config?.tokens?.easings?.[easingName]
        : undefined;
      if (typeof easing === "string") {
        transition.ease = easing;
        consumed = true;
      }
    }

    if (!consumed) {
      for (const plugin of config?.plugins ?? []) {
        const patch = plugin.transformToken?.(innerToken, { config: config! });
        if (!patch) continue;
        mergePatch(
          patch,
          gestures,
          transition,
          viewport,
          dragConfig,
          layoutConfig,
          scroll,
          variants,
          variantState,
        );
        consumed = true;
        break;
      }
    }

    if (!consumed) {
      if (
        innerToken.startsWith("animate-") &&
        !TAILWIND_ANIMATE_CLASSES.has(innerToken)
      ) {
        diagnostics.push({
          code: "unknown-class",
          message: `Unrecognized motionwind class "${innerToken}".`,
          severity: config?.strict ? "error" : "warning",
          token: innerToken,
        });
      }
      if (
        process.env.NODE_ENV !== "production" &&
        innerToken.startsWith("animate-") &&
        !TAILWIND_ANIMATE_CLASSES.has(innerToken)
      ) {
        console.warn(
          `[motionwind] Unrecognized class "${innerToken}". ` +
            `It starts with "animate-" but doesn't match any known pattern.`,
        );
      }
      tailwind.push(innerToken);
    }
  }

  const hasMotion =
    Object.keys(gestures).length > 0 ||
    Object.keys(transition).length > 0 ||
    Object.keys(viewport).length > 0 ||
    Object.keys(dragConfig).length > 0 ||
    Object.keys(layoutConfig).length > 0 ||
    Object.keys(scroll.values).length > 0 ||
    Object.keys(variants).length > 0 ||
    Object.keys(variantState).length > 0;

  const result: ParsedResult = {
    tailwindClasses: tailwind.join(" "),
    gestures,
    transition,
    viewport,
    dragConfig,
    layoutConfig,
    scroll,
    variants,
    variantState,
    hasMotion,
    ...(reducedMotionPolicy !== undefined && { reducedMotionPolicy }),
    diagnostics,
  };

  for (const plugin of config?.plugins ?? []) {
    const pluginDiagnostics =
      plugin.diagnose?.(className, result, { config: config! }) ?? [];
    diagnostics.push(
      ...pluginDiagnostics.map((diagnostic) => ({
        ...diagnostic,
        plugin: plugin.name,
      })),
    );
  }

  if (!config) cacheSet(className, result);
  return result;
}

/** Clear the parser memoization cache */
export function clearParserCache(): void {
  cache.clear();
}

/** Category of a single class token, used by tooling (linting, sorting). */
export type MotionTokenCategory =
  | "variant"
  | "gesture"
  | "transition"
  | "viewport"
  | "scroll"
  | "drag"
  | "layout"
  | "tailwind"
  | "unknown";

/** Build throwaway accumulators for single-token classification. */
function freshAccumulators() {
  return {
    gestures: {} as Partial<Record<GestureKey, AnimatableValues>>,
    transition: {} as TransitionConfig,
    viewport: {} as ViewportConfig,
    dragConfig: {} as DragConfig,
    layoutConfig: {} as LayoutConfig,
    scroll: { axis: "y", container: false, values: {} } as ScrollConfig,
    variants: {} as VariantMap,
    variantState: {} as VariantState,
  };
}

/**
 * Classify a single class token into a motionwind category. Non-motionwind
 * classes are "tailwind"; `animate-*` classes that don't match any pattern are
 * "unknown". Reuses the real `classifyToken` so it never drifts from parsing.
 */
export function classifyMotionToken(
  token: string,
  config?: MotionwindConfig,
): MotionTokenCategory {
  // Strip motion-reduce:/motion-safe: wrapper prefixes and classify the inner token.
  if (token.startsWith("motion-reduce:") || token.startsWith("motion-safe:")) {
    const inner = token.startsWith("motion-reduce:")
      ? token.slice("motion-reduce:".length)
      : token.slice("motion-safe:".length);
    return inner ? classifyMotionToken(inner, config) : "tailwind";
  }
  if (!token.startsWith("animate-")) return "tailwind";
  if (TAILWIND_ANIMATE_CLASSES.has(token)) return "tailwind";
  if (config || token.startsWith("animate-preset-")) {
    const parsed = parseMotionClasses(token, config);
    if (!parsed.hasMotion) return "unknown";
    if (
      Object.keys(parsed.variantState).length ||
      Object.keys(parsed.variants).length
    )
      return "variant";
    if (Object.keys(parsed.gestures).length) return "gesture";
    if (Object.keys(parsed.viewport).length) return "viewport";
    if (Object.keys(parsed.scroll.values).length) return "scroll";
    if (Object.keys(parsed.dragConfig).length) return "drag";
    if (Object.keys(parsed.layoutConfig).length) return "layout";
    return "transition";
  }
  const a = freshAccumulators();
  const consumed = classifyToken(
    token,
    a.gestures,
    a.transition,
    a.viewport,
    a.dragConfig,
    a.layoutConfig,
    a.scroll,
    a.variants,
    a.variantState,
  );
  if (!consumed) return "unknown";
  if (token.startsWith("animate-scroll")) return "scroll";
  if (token.startsWith("animate-variant-")) return "variant";
  if (Object.keys(a.variantState).length) return "variant";
  if (Object.keys(a.gestures).length) return "gesture";
  if (Object.keys(a.viewport).length) return "viewport";
  if (Object.keys(a.dragConfig).length) return "drag";
  if (Object.keys(a.layoutConfig).length) return "layout";
  return "transition";
}
