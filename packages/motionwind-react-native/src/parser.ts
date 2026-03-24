import type {
  GestureKey,
  NativeAnimatableStyle,
  ParsedResult,
  TransitionConfig,
  ViewportConfig,
  DragConfig,
} from "./types.js";
import {
  GESTURE_MAP,
  GESTURE_KEYS,
  EASING_MAP,
  TAILWIND_ANIMATE_CLASSES,
  DEGREE_PROPERTIES,
  WEB_ONLY_PROPERTIES,
  WEB_TO_RN_PROPERTY_MAP,
} from "./constants.js";

const CACHE_MAX = 1000;
const cache = new Map<string, ParsedResult>();

function cacheSet(key: string, value: ParsedResult): void {
  if (cache.size >= CACHE_MAX) {
    const firstKey = cache.keys().next().value;
    if (firstKey !== undefined) cache.delete(firstKey);
  }
  cache.set(key, value);
}

/**
 * Parse a numeric value. Returns the number or null.
 * RN doesn't support CSS units like vh/vw/rem in animations,
 * so we only accept plain numbers and percentages (as numbers).
 */
function parseNumericValue(str: string, sign: number): number | null {
  // Percentage: 100pct → 100 (as a number, caller handles semantics)
  if (str.endsWith("pct")) {
    const n = Number(str.slice(0, -3));
    if (isNaN(n)) return null;
    return n * sign;
  }

  // Pixels: 50px → 50 (RN uses device-independent pixels by default)
  if (str.endsWith("px")) {
    const n = Number(str.slice(0, -2));
    if (isNaN(n)) return null;
    return n * sign;
  }

  // Plain number
  const n = Number(str);
  if (isNaN(n)) return null;
  return n * sign;
}

/**
 * Parse a property-value pair from a motionwind class token.
 * Returns an RN-compatible key-value pair.
 *
 * Key differences from web parser:
 * - "x"/"y" → "translateX"/"translateY"
 * - rotate/skew values become degree strings ("45deg")
 * - filter/backdrop/clipPath/SVG props are dropped (web-only)
 * - No CSS unit strings — everything resolves to numbers
 */
function parsePropertyValue(
  raw: string,
): { key: string; value: string | number | number[] } | null {
  // Negative prefix
  let negative = false;
  let str = raw;
  if (str.startsWith("-")) {
    negative = true;
    str = str.slice(1);
  }
  const sign = negative ? -1 : 1;

  // Keyframe array: property-[v1,v2,v3]
  const keyframeMatch = str.match(/^(\w+(?:-\w+)?)-\[([^\]]+)\]$/);
  if (keyframeMatch) {
    const propName = keyframeMatch[1]!;
    const valuesStr = keyframeMatch[2]!;
    const propKey = normalizePropertyName(propName);
    if (propKey && !WEB_ONLY_PROPERTIES.has(propKey)) {
      const rawValues = valuesStr
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
      const scaleProps = new Set(["scale", "scaleX", "scaleY", "opacity"]);
      const parsed: number[] = [];
      let valid = true;
      for (const rv of rawValues) {
        const n = Number(rv);
        if (isNaN(n)) {
          valid = false;
          break;
        }
        parsed.push(scaleProps.has(propKey) ? n / 100 : n);
      }
      if (valid && parsed.length > 0) {
        const finalKey = WEB_TO_RN_PROPERTY_MAP[propKey] ?? propKey;
        return { key: finalKey, value: parsed };
      }
    }
    return null;
  }

  // --- Transform properties ---

  // scale-x-{n}, scale-y-{n}, scale-{n}
  if (str.startsWith("scale-x-")) {
    const n = Number(str.slice(8));
    if (!isNaN(n)) return { key: "scaleX", value: (n / 100) * sign };
  }
  if (str.startsWith("scale-y-")) {
    const n = Number(str.slice(8));
    if (!isNaN(n)) return { key: "scaleY", value: (n / 100) * sign };
  }
  if (str.startsWith("scale-")) {
    const n = Number(str.slice(6));
    if (!isNaN(n)) return { key: "scale", value: (n / 100) * sign };
  }

  // rotate-x-{n}, rotate-y-{n}, rotate-{n} → degree strings
  if (str.startsWith("rotate-x-")) {
    const n = Number(str.slice(9));
    if (!isNaN(n)) return { key: "rotateX", value: `${n * sign}deg` };
  }
  if (str.startsWith("rotate-y-")) {
    const n = Number(str.slice(9));
    if (!isNaN(n)) return { key: "rotateY", value: `${n * sign}deg` };
  }
  if (str.startsWith("rotate-")) {
    const n = Number(str.slice(7));
    if (!isNaN(n)) return { key: "rotate", value: `${n * sign}deg` };
  }

  // skew-x-{n}, skew-y-{n}
  if (str.startsWith("skew-x-")) {
    const n = Number(str.slice(7));
    if (!isNaN(n)) return { key: "skewX", value: `${n * sign}deg` };
  }
  if (str.startsWith("skew-y-")) {
    const n = Number(str.slice(7));
    if (!isNaN(n)) return { key: "skewY", value: `${n * sign}deg` };
  }

  // x-{n} → translateX, y-{n} → translateY
  if (str.startsWith("x-")) {
    const val = parseNumericValue(str.slice(2), sign);
    if (val !== null) return { key: "translateX", value: val };
  }
  if (str.startsWith("y-")) {
    const val = parseNumericValue(str.slice(2), sign);
    if (val !== null) return { key: "translateY", value: val };
  }

  // --- Visual properties ---

  // opacity-{n}
  if (str.startsWith("opacity-")) {
    const n = Number(str.slice(8));
    if (!isNaN(n)) return { key: "opacity", value: (n / 100) * sign };
  }

  // blur/brightness/contrast/saturate/backdrop-blur → web-only, skip
  if (
    str.startsWith("blur-") ||
    str.startsWith("brightness-") ||
    str.startsWith("contrast-") ||
    str.startsWith("saturate-") ||
    str.startsWith("backdrop-blur-") ||
    str.startsWith("clip-")
  ) {
    return null;
  }

  // --- Dimensions ---

  if (str.startsWith("rounded-")) {
    const n = Number(str.slice(8));
    if (!isNaN(n)) return { key: "borderRadius", value: n * sign };
  }
  if (str.startsWith("w-")) {
    const val = parseNumericValue(str.slice(2), sign);
    if (val !== null) return { key: "width", value: val };
  }
  if (str.startsWith("h-")) {
    const val = parseNumericValue(str.slice(2), sign);
    if (val !== null) return { key: "height", value: val };
  }

  // --- Position ---

  if (str.startsWith("top-")) {
    const val = parseNumericValue(str.slice(4), sign);
    if (val !== null) return { key: "top", value: val };
  }
  if (str.startsWith("left-")) {
    const val = parseNumericValue(str.slice(5), sign);
    if (val !== null) return { key: "left", value: val };
  }
  if (str.startsWith("right-")) {
    const val = parseNumericValue(str.slice(6), sign);
    if (val !== null) return { key: "right", value: val };
  }
  if (str.startsWith("bottom-")) {
    const val = parseNumericValue(str.slice(7), sign);
    if (val !== null) return { key: "bottom", value: val };
  }

  // --- Spacing ---

  if (str.startsWith("p-")) {
    const val = parseNumericValue(str.slice(2), sign);
    if (val !== null) return { key: "padding", value: val };
  }
  if (str.startsWith("m-")) {
    const val = parseNumericValue(str.slice(2), sign);
    if (val !== null) return { key: "margin", value: val };
  }
  if (str.startsWith("gap-")) {
    const val = parseNumericValue(str.slice(4), sign);
    if (val !== null) return { key: "gap", value: val };
  }

  // --- Typography ---

  if (str.startsWith("text-size-")) {
    const val = parseNumericValue(str.slice(10), sign);
    if (val !== null) return { key: "fontSize", value: val };
  }
  if (str.startsWith("tracking-")) {
    const val = parseNumericValue(str.slice(9), sign);
    if (val !== null) return { key: "letterSpacing", value: val };
  }
  if (str.startsWith("leading-")) {
    const val = parseNumericValue(str.slice(8), sign);
    if (val !== null) return { key: "lineHeight", value: val };
  }

  // --- Border ---

  if (str.startsWith("border-w-")) {
    const n = Number(str.slice(9));
    if (!isNaN(n)) return { key: "borderWidth", value: n * sign };
  }

  // --- SVG path props → web-only, skip ---
  if (
    str.startsWith("path-length-") ||
    str.startsWith("path-offset-") ||
    str.startsWith("path-spacing-")
  ) {
    return null;
  }

  // --- Color properties ---

  if (str.startsWith("bg-")) {
    const color = str.slice(3);
    if (isValidColor(color)) return { key: "backgroundColor", value: color };
    return null;
  }
  if (str.startsWith("text-")) {
    const color = str.slice(5);
    if (isValidColor(color)) return { key: "color", value: color };
    return null;
  }
  if (str.startsWith("border-")) {
    const color = str.slice(7);
    if (isValidColor(color)) return { key: "borderColor", value: color };
    return null;
  }

  return null;
}

const HEX_COLOR_RE =
  /^#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
const FUNC_COLOR_RE = /^(?:rgb|rgba|hsl|hsla)\(.+\)$/;

function isValidColor(color: string): boolean {
  return HEX_COLOR_RE.test(color) || FUNC_COLOR_RE.test(color);
}

function normalizePropertyName(name: string): string | null {
  const map: Record<string, string> = {
    scale: "scale",
    "scale-x": "scaleX",
    "scale-y": "scaleY",
    rotate: "rotate",
    "rotate-x": "rotateX",
    "rotate-y": "rotateY",
    x: "translateX",
    y: "translateY",
    opacity: "opacity",
    "skew-x": "skewX",
    "skew-y": "skewY",
    w: "width",
    h: "height",
    rounded: "borderRadius",
  };
  return map[name] ?? null;
}

/**
 * Classify a single class token and update the result.
 * Returns true if the token was consumed.
 */
function classifyToken(
  token: string,
  gestures: Partial<Record<GestureKey, NativeAnimatableStyle>>,
  transition: TransitionConfig,
  viewport: ViewportConfig,
  dragConfig: DragConfig,
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
        if (!gestures[gestureKey])
          gestures[gestureKey] = {} as NativeAnimatableStyle;
        (gestures[gestureKey] as Record<string, unknown>)[parsed.key] =
          parsed.value;
        return true;
      }
    }
    return false;
  }

  // --- Transition config tokens ---

  if (rest.startsWith("duration-")) {
    const ms = Number(rest.slice(9));
    if (!isNaN(ms)) {
      transition.duration = ms;
      return true;
    }
  }

  if (rest.startsWith("delay-children-")) {
    const ms = Number(rest.slice(15));
    if (!isNaN(ms)) {
      transition.delayChildren = ms;
      return true;
    }
  }

  if (rest.startsWith("delay-")) {
    const ms = Number(rest.slice(6));
    if (!isNaN(ms)) {
      transition.delay = ms;
      return true;
    }
  }

  // Custom cubic-bezier: ease-[n,n,n,n]
  if (rest.startsWith("ease-[") && rest.endsWith("]")) {
    const inner = rest.slice(6, -1);
    const values = inner.split(",").map((v) => Number(v.trim()));
    if (values.length === 4 && values.every((v) => !isNaN(v))) {
      transition.easing = values;
      return true;
    }
  }

  // Named easing
  for (const [suffix, easeValue] of Object.entries(EASING_MAP)) {
    if (rest === suffix) {
      transition.easing = easeValue as TransitionConfig["easing"];
      return true;
    }
  }

  // Spring
  if (rest === "spring") {
    transition.type = "spring";
    return true;
  }
  if (rest.startsWith("stiffness-")) {
    const n = Number(rest.slice(10));
    if (!isNaN(n)) {
      transition.stiffness = n;
      return true;
    }
  }
  if (rest.startsWith("damping-")) {
    const n = Number(rest.slice(8));
    if (!isNaN(n)) {
      transition.damping = n;
      return true;
    }
  }
  if (rest.startsWith("mass-")) {
    const n = Number(rest.slice(5));
    if (!isNaN(n)) {
      transition.mass = n / 10;
      return true;
    }
  }

  // Repeat
  if (rest === "repeat-infinite") {
    transition.repeat = -1;
    return true;
  }
  if (rest === "repeat-reverse") {
    transition.repeatReverse = true;
    return true;
  }
  if (rest.startsWith("repeat-")) {
    const n = Number(rest.slice(7));
    if (!isNaN(n)) {
      transition.repeat = n;
      return true;
    }
  }

  // Stagger
  if (rest === "stagger-reverse") {
    transition.staggerDirection = -1;
    return true;
  }
  if (rest.startsWith("stagger-")) {
    const ms = Number(rest.slice(8));
    if (!isNaN(ms)) {
      transition.staggerChildren = ms;
      return true;
    }
  }

  // --- Viewport config ---

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
      viewport.margin = n;
      return true;
    }
  }

  // --- Drag config ---

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

  // Drag constraints
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

  // Layout keywords are web-only (Reanimated handles layout differently)
  if (rest.startsWith("layout")) return true;

  return false;
}

/**
 * Parse a className string and extract motionwind animation classes
 * into structured React Native / Reanimated props.
 *
 * Non-motionwind classes pass through as `nativewindClasses` for NativeWind/Tailwind.
 * Results are memoized by input string.
 */
export function parseMotionClasses(className: string): ParsedResult {
  const cached = cache.get(className);
  if (cached) return cached;

  const tokens = className.split(/\s+/).filter(Boolean);
  const nativewind: string[] = [];
  const gestures: Partial<Record<GestureKey, NativeAnimatableStyle>> = {};
  const transition: TransitionConfig = {};
  const viewport: ViewportConfig = {};
  const dragConfig: DragConfig = {};

  for (const token of tokens) {
    const consumed = classifyToken(
      token,
      gestures,
      transition,
      viewport,
      dragConfig,
    );
    if (!consumed) {
      if (
        __DEV__ &&
        token.startsWith("animate-") &&
        !TAILWIND_ANIMATE_CLASSES.has(token)
      ) {
        console.warn(
          `[motionwind-rn] Unrecognized class "${token}". ` +
            `It starts with "animate-" but doesn't match any known pattern.`,
        );
      }
      nativewind.push(token);
    }
  }

  const hasMotion =
    Object.keys(gestures).length > 0 ||
    Object.keys(transition).length > 0 ||
    Object.keys(viewport).length > 0 ||
    Object.keys(dragConfig).length > 0;

  const result: ParsedResult = {
    nativewindClasses: nativewind.join(" "),
    gestures,
    transition,
    viewport,
    dragConfig,
    hasMotion,
  };

  cacheSet(className, result);
  return result;
}

/** Clear the parser memoization cache */
export function clearParserCache(): void {
  cache.clear();
}

// RN global __DEV__ fallback
declare const __DEV__: boolean;
