import type {
  AnimatableValues,
  GestureKey,
  ParsedResult,
  TransitionConfig,
  ViewportConfig,
  DragConfig,
} from "./types.js";
import {
  GESTURE_MAP,
  GESTURE_KEYS,
  EASING_MAP,
  TRANSITION_KEYWORDS,
  VIEWPORT_KEYWORDS,
  DRAG_KEYWORDS,
} from "./constants.js";

const cache = new Map<string, ParsedResult>();

/**
 * Parse a property-value string (e.g. "scale-110", "x-20", "opacity-0")
 * into a Motion-compatible key-value pair.
 */
function parsePropertyValue(
  raw: string,
): { key: string; value: string | number } | null {
  // Arbitrary value: [key=value]
  if (raw.startsWith("[") && raw.endsWith("]")) {
    const inner = raw.slice(1, -1);
    const eqIdx = inner.indexOf("=");
    if (eqIdx === -1) return null;
    const key = inner.slice(0, eqIdx);
    const val = inner.slice(eqIdx + 1);
    // Try to parse as number
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

  // scale-x-{n} / scale-y-{n}
  if (str.startsWith("scale-x-")) {
    const n = Number(str.slice(8));
    if (isNaN(n)) return null;
    return { key: "scaleX", value: (n / 100) * sign };
  }
  if (str.startsWith("scale-y-")) {
    const n = Number(str.slice(8));
    if (isNaN(n)) return null;
    return { key: "scaleY", value: (n / 100) * sign };
  }

  // scale-{n}
  if (str.startsWith("scale-")) {
    const n = Number(str.slice(6));
    if (isNaN(n)) return null;
    return { key: "scale", value: (n / 100) * sign };
  }

  // rotate-x-{n} / rotate-y-{n}
  if (str.startsWith("rotate-x-")) {
    const n = Number(str.slice(9));
    if (isNaN(n)) return null;
    return { key: "rotateX", value: n * sign };
  }
  if (str.startsWith("rotate-y-")) {
    const n = Number(str.slice(9));
    if (isNaN(n)) return null;
    return { key: "rotateY", value: n * sign };
  }

  // rotate-{n}
  if (str.startsWith("rotate-")) {
    const n = Number(str.slice(7));
    if (isNaN(n)) return null;
    return { key: "rotate", value: n * sign };
  }

  // skew-x-{n}
  if (str.startsWith("skew-x-")) {
    const n = Number(str.slice(7));
    if (isNaN(n)) return null;
    return { key: "skewX", value: n * sign };
  }

  // skew-y-{n}
  if (str.startsWith("skew-y-")) {
    const n = Number(str.slice(7));
    if (isNaN(n)) return null;
    return { key: "skewY", value: n * sign };
  }

  // x-{n}
  if (str.startsWith("x-")) {
    const n = Number(str.slice(2));
    if (isNaN(n)) return null;
    return { key: "x", value: n * sign };
  }

  // y-{n}
  if (str.startsWith("y-")) {
    const n = Number(str.slice(2));
    if (isNaN(n)) return null;
    return { key: "y", value: n * sign };
  }

  // opacity-{n}
  if (str.startsWith("opacity-")) {
    const n = Number(str.slice(8));
    if (isNaN(n)) return null;
    return { key: "opacity", value: (n / 100) * sign };
  }

  // blur-{n}
  if (str.startsWith("blur-")) {
    const n = Number(str.slice(5));
    if (isNaN(n)) return null;
    return { key: "filter", value: `blur(${n * sign}px)` };
  }

  // brightness-{n}
  if (str.startsWith("brightness-")) {
    const n = Number(str.slice(11));
    if (isNaN(n)) return null;
    return { key: "filter", value: `brightness(${(n / 100) * sign})` };
  }

  // contrast-{n}
  if (str.startsWith("contrast-")) {
    const n = Number(str.slice(9));
    if (isNaN(n)) return null;
    return { key: "filter", value: `contrast(${(n / 100) * sign})` };
  }

  // saturate-{n}
  if (str.startsWith("saturate-")) {
    const n = Number(str.slice(9));
    if (isNaN(n)) return null;
    return { key: "filter", value: `saturate(${(n / 100) * sign})` };
  }

  // rounded-{n}
  if (str.startsWith("rounded-")) {
    const n = Number(str.slice(8));
    if (isNaN(n)) return null;
    return { key: "borderRadius", value: n * sign };
  }

  // w-{n}
  if (str.startsWith("w-")) {
    const n = Number(str.slice(2));
    if (isNaN(n)) return null;
    return { key: "width", value: n * sign };
  }

  // h-{n}
  if (str.startsWith("h-")) {
    const n = Number(str.slice(2));
    if (isNaN(n)) return null;
    return { key: "height", value: n * sign };
  }

  return null;
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
): boolean {
  // Must start with `animate-`
  if (!token.startsWith("animate-")) return false;

  const rest = token.slice(8); // after "animate-"

  // Check for gesture prefix: `animate-{gesture}:{property-value}`
  const colonIdx = rest.indexOf(":");
  if (colonIdx !== -1) {
    const gesturePrefix = rest.slice(0, colonIdx);
    const propValueStr = rest.slice(colonIdx + 1);

    if (GESTURE_KEYS.has(gesturePrefix)) {
      const gestureKey = GESTURE_MAP[gesturePrefix]!;
      const parsed = parsePropertyValue(propValueStr);
      if (parsed) {
        if (!gestures[gestureKey]) gestures[gestureKey] = {};
        gestures[gestureKey]![parsed.key] = parsed.value;
        return true;
      }
    }
    // Unknown gesture prefix — pass through as Tailwind class
    return false;
  }

  // Transition config tokens (no colon)

  // animate-duration-{ms}
  if (rest.startsWith("duration-")) {
    const ms = Number(rest.slice(9));
    if (!isNaN(ms)) {
      transition.duration = ms / 1000;
      return true;
    }
  }

  // animate-delay-{ms}
  if (rest.startsWith("delay-")) {
    const ms = Number(rest.slice(6));
    if (!isNaN(ms)) {
      transition.delay = ms / 1000;
      return true;
    }
  }

  // animate-ease-*
  for (const [suffix, easeValue] of Object.entries(EASING_MAP)) {
    if (rest === suffix) {
      transition.ease = easeValue;
      return true;
    }
  }

  // animate-spring
  if (rest === "spring") {
    transition.type = "spring";
    return true;
  }

  // animate-stiffness-{n}
  if (rest.startsWith("stiffness-")) {
    const n = Number(rest.slice(10));
    if (!isNaN(n)) {
      transition.stiffness = n;
      return true;
    }
  }

  // animate-damping-{n}
  if (rest.startsWith("damping-")) {
    const n = Number(rest.slice(8));
    if (!isNaN(n)) {
      transition.damping = n;
      return true;
    }
  }

  // animate-bounce-{n}
  if (rest.startsWith("bounce-")) {
    const n = Number(rest.slice(7));
    if (!isNaN(n)) {
      transition.bounce = n / 100;
      return true;
    }
  }

  // animate-mass-{n}
  if (rest.startsWith("mass-")) {
    const n = Number(rest.slice(5));
    if (!isNaN(n)) {
      transition.mass = n / 10;
      return true;
    }
  }

  // animate-repeat-infinite
  if (rest === "repeat-infinite") {
    transition.repeat = Infinity;
    return true;
  }

  // animate-repeat-{n}
  if (rest.startsWith("repeat-")) {
    const n = Number(rest.slice(7));
    if (!isNaN(n)) {
      transition.repeat = n;
      return true;
    }
  }

  // Viewport config tokens

  // animate-once
  if (rest === "once") {
    viewport.once = true;
    return true;
  }

  // animate-amount-all
  if (rest === "amount-all") {
    viewport.amount = "all";
    return true;
  }

  // animate-margin-{n}
  if (rest.startsWith("margin-")) {
    const n = Number(rest.slice(7));
    if (!isNaN(n)) {
      viewport.margin = `${n}px`;
      return true;
    }
  }

  // Drag config tokens

  // animate-drag-x
  if (rest === "drag-x") {
    dragConfig.drag = "x";
    return true;
  }

  // animate-drag-y
  if (rest === "drag-y") {
    dragConfig.drag = "y";
    return true;
  }

  // animate-drag-both
  if (rest === "drag-both") {
    dragConfig.drag = true;
    return true;
  }

  // animate-drag-elastic-{n}
  if (rest.startsWith("drag-elastic-")) {
    const n = Number(rest.slice(13));
    if (!isNaN(n)) {
      dragConfig.dragElastic = n / 100;
      return true;
    }
  }

  // Not a recognized motionwind token — pass through
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

  for (const token of tokens) {
    const consumed = classifyToken(
      token,
      gestures,
      transition,
      viewport,
      dragConfig,
    );
    if (!consumed) {
      tailwind.push(token);
    }
  }

  const hasMotion =
    Object.keys(gestures).length > 0 ||
    Object.keys(transition).length > 0 ||
    Object.keys(viewport).length > 0 ||
    Object.keys(dragConfig).length > 0;

  const result: ParsedResult = {
    tailwindClasses: tailwind.join(" "),
    gestures,
    transition,
    viewport,
    dragConfig,
    hasMotion,
  };

  cache.set(className, result);
  return result;
}

/** Clear the parser memoization cache */
export function clearParserCache(): void {
  cache.clear();
}
