import type {
  AnimatableValues,
  GestureKey,
  ParsedResult,
  TransitionConfig,
  ViewportConfig,
  DragConfig,
  LayoutConfig,
} from "./types.js";
import {
  GESTURE_MAP,
  GESTURE_KEYS,
  EASING_MAP,
} from "./constants.js";

const CACHE_MAX = 1000;
const cache = new Map<string, ParsedResult>();

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
  "x", "y", "z", "scale", "scaleX", "scaleY", "scaleZ",
  "rotate", "rotateX", "rotateY", "rotateZ",
  "skew", "skewX", "skewY",
  "originX", "originY", "originZ", "perspective",
  "opacity", "filter", "backdropFilter", "clipPath",
  "width", "height", "top", "left", "right", "bottom",
  "padding", "margin", "gap", "borderRadius", "borderWidth",
  "fontSize", "letterSpacing", "lineHeight",
  "backgroundColor", "color", "borderColor", "boxShadow",
  "pathLength", "pathOffset", "pathSpacing",
]);

/**
 * Parse a property-value string (e.g. "scale-110", "x-20", "opacity-0")
 * into a Motion-compatible key-value pair.
 */
function parsePropertyValue(
  raw: string,
): { key: string; value: string | number | number[] } | null {
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
      const rawValues = valuesStr.split(",").map((v) => v.trim());
      if (rawValues.length > 0) {
        const scaleProps = new Set(["scale", "scaleX", "scaleY", "scaleZ", "opacity", "brightness", "contrast", "saturate"]);
        const parsed: (string | number)[] = [];
        let valid = true;
        for (const rv of rawValues) {
          const unitVal = parseNumericWithUnit(rv, 1);
          if (unitVal === null) { valid = false; break; }
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
    if (!isNaN(n)) return { key: "filter", value: `blur(${Math.max(0, n * sign)}px)` };
  }

  // brightness-{n} — clamped to 0 minimum
  if (str.startsWith("brightness-")) {
    const n = Number(str.slice(11));
    if (!isNaN(n)) return { key: "filter", value: `brightness(${Math.max(0, (n / 100) * sign)})` };
  }

  // contrast-{n} — clamped to 0 minimum
  if (str.startsWith("contrast-")) {
    const n = Number(str.slice(9));
    if (!isNaN(n)) return { key: "filter", value: `contrast(${Math.max(0, (n / 100) * sign)})` };
  }

  // saturate-{n} — clamped to 0 minimum
  if (str.startsWith("saturate-")) {
    const n = Number(str.slice(9));
    if (!isNaN(n)) return { key: "filter", value: `saturate(${Math.max(0, (n / 100) * sign)})` };
  }

  // backdrop-blur-{n} — clamped to 0 minimum
  if (str.startsWith("backdrop-blur-")) {
    const n = Number(str.slice(14));
    if (!isNaN(n)) return { key: "backdropFilter", value: `blur(${Math.max(0, n * sign)}px)` };
  }

  // clip-path: clip-[value]
  if (str.startsWith("clip-")) {
    const val = str.slice(5);
    if (val.startsWith("[") && val.endsWith("]")) {
      return { key: "clipPath", value: val.slice(1, -1) };
    }
  }

  // --- Dimensions with unit support ---

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
    "origin-x": "originX",
    "origin-y": "originY",
    "origin-z": "originZ",
    perspective: "perspective",
  };
  return map[name] ?? null;
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
): boolean {
  if (!token.startsWith("animate-")) return false;

  const rest = token.slice(8);

  // --- Gesture prefix: animate-{gesture}:{property-value} ---
  const colonIdx = rest.indexOf(":");
  if (colonIdx !== -1) {
    const gesturePrefix = rest.slice(0, colonIdx);
    const propValueStr = rest.slice(colonIdx + 1);

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
    if (!isNaN(ms)) { transition.duration = ms / 1000; return true; }
  }

  // delay-children (must come before delay)
  if (rest.startsWith("delay-children-")) {
    const ms = Number(rest.slice(15));
    if (!isNaN(ms)) { transition.delayChildren = ms / 1000; return true; }
  }

  // delay
  if (rest.startsWith("delay-")) {
    const ms = Number(rest.slice(6));
    if (!isNaN(ms)) { transition.delay = ms / 1000; return true; }
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
  if (rest === "spring") { transition.type = "spring"; return true; }

  // stiffness
  if (rest.startsWith("stiffness-")) {
    const n = Number(rest.slice(10));
    if (!isNaN(n)) { transition.stiffness = n; return true; }
  }

  // damping
  if (rest.startsWith("damping-")) {
    const n = Number(rest.slice(8));
    if (!isNaN(n)) { transition.damping = n; return true; }
  }

  // bounce
  if (rest.startsWith("bounce-")) {
    const n = Number(rest.slice(7));
    if (!isNaN(n)) { transition.bounce = n / 100; return true; }
  }

  // mass
  if (rest.startsWith("mass-")) {
    const n = Number(rest.slice(5));
    if (!isNaN(n)) { transition.mass = n / 10; return true; }
  }

  // repeat-infinite
  if (rest === "repeat-infinite") { transition.repeat = Infinity; return true; }

  // repeat-reverse
  if (rest === "repeat-reverse") { transition.repeatType = "reverse"; return true; }

  // repeat-mirror
  if (rest === "repeat-mirror") { transition.repeatType = "mirror"; return true; }

  // repeat-delay-{ms}
  if (rest.startsWith("repeat-delay-")) {
    const ms = Number(rest.slice(13));
    if (!isNaN(ms)) { transition.repeatDelay = ms / 1000; return true; }
  }

  // repeat-{n}
  if (rest.startsWith("repeat-")) {
    const n = Number(rest.slice(7));
    if (!isNaN(n)) { transition.repeat = n; return true; }
  }

  // stagger-reverse
  if (rest === "stagger-reverse") { transition.staggerDirection = -1; return true; }

  // stagger-{ms}
  if (rest.startsWith("stagger-")) {
    const ms = Number(rest.slice(8));
    if (!isNaN(ms)) { transition.staggerChildren = ms / 1000; return true; }
  }

  // when-before / when-after
  if (rest === "when-before") { transition.when = "beforeChildren"; return true; }
  if (rest === "when-after") { transition.when = "afterChildren"; return true; }

  // rest-speed-{n} (0.01 increments via hundredths)
  if (rest.startsWith("rest-speed-")) {
    const n = Number(rest.slice(11));
    if (!isNaN(n)) { transition.restSpeed = n; return true; }
  }

  // rest-delta-{n}
  if (rest.startsWith("rest-delta-")) {
    const n = Number(rest.slice(11));
    if (!isNaN(n)) { transition.restDelta = n; return true; }
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

  if (rest === "once") { viewport.once = true; return true; }

  if (rest === "amount-all") { viewport.amount = "all"; return true; }

  if (rest.startsWith("amount-")) {
    const n = Number(rest.slice(7));
    if (!isNaN(n)) { viewport.amount = n / 100; return true; }
  }

  if (rest.startsWith("margin-")) {
    const n = Number(rest.slice(7));
    if (!isNaN(n)) { viewport.margin = `${n}px`; return true; }
  }

  // --- Drag config tokens ---

  if (rest === "drag-x") { dragConfig.drag = "x"; return true; }
  if (rest === "drag-y") { dragConfig.drag = "y"; return true; }
  if (rest === "drag-both") { dragConfig.drag = true; return true; }

  if (rest.startsWith("drag-elastic-")) {
    const n = Number(rest.slice(13));
    if (!isNaN(n)) { dragConfig.dragElastic = n / 100; return true; }
  }

  if (rest === "drag-snap") { dragConfig.dragSnapToOrigin = true; return true; }
  if (rest === "drag-no-momentum") { dragConfig.dragMomentum = false; return true; }
  if (rest === "drag-lock") { dragConfig.dragDirectionLock = true; return true; }

  // drag-constraint-{side}-{n}
  if (rest.startsWith("drag-constraint-")) {
    const sub = rest.slice(16);
    const sides: Record<string, string> = { "t-": "top", "l-": "left", "r-": "right", "b-": "bottom" };
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

  if (rest === "layout") { layoutConfig.layout = true; return true; }
  if (rest === "layout-position") { layoutConfig.layout = "position"; return true; }
  if (rest === "layout-size") { layoutConfig.layout = "size"; return true; }
  if (rest === "layout-preserve") { layoutConfig.layout = "preserve-aspect"; return true; }
  if (rest === "layout-scroll") { layoutConfig.layoutScroll = true; return true; }
  if (rest === "layout-root") { layoutConfig.layoutRoot = true; return true; }

  if (rest.startsWith("layout-id-")) {
    layoutConfig.layoutId = rest.slice(10);
    return true;
  }

  return false;
}

/**
 * Parse a className string and extract motionwind classes into structured
 * Motion props. All non-motionwind classes pass through as tailwindClasses.
 *
 * Results are memoized by input string.
 */
export function parseMotionClasses(className: string): ParsedResult {
  const cached = cache.get(className);
  if (cached) return cached;

  const tokens = className.split(/\s+/).filter(Boolean);
  const tailwind: string[] = [];
  const gestures: Partial<Record<GestureKey, AnimatableValues>> = {};
  const transition: TransitionConfig = {};
  const viewport: ViewportConfig = {};
  const dragConfig: DragConfig = {};
  const layoutConfig: LayoutConfig = {};

  for (const token of tokens) {
    const consumed = classifyToken(
      token,
      gestures,
      transition,
      viewport,
      dragConfig,
      layoutConfig,
    );
    if (!consumed) {
      tailwind.push(token);
    }
  }

  const hasMotion =
    Object.keys(gestures).length > 0 ||
    Object.keys(transition).length > 0 ||
    Object.keys(viewport).length > 0 ||
    Object.keys(dragConfig).length > 0 ||
    Object.keys(layoutConfig).length > 0;

  const result: ParsedResult = {
    tailwindClasses: tailwind.join(" "),
    gestures,
    transition,
    viewport,
    dragConfig,
    layoutConfig,
    hasMotion,
  };

  cacheSet(className, result);
  return result;
}

/** Clear the parser memoization cache */
export function clearParserCache(): void {
  cache.clear();
}
