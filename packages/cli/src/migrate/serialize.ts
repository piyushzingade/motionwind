/**
 * Reverse of motionwind's parser: turn Motion prop values back into
 * `animate-*` classes. Every serializer returns `null` when it can't faithfully
 * represent a value as classes — callers then leave that element untouched so a
 * migration never changes behavior.
 */

export const GESTURE_PREFIX: Record<string, string> = {
  whileHover: "hover",
  whileTap: "tap",
  whileFocus: "focus",
  whileInView: "inview",
  whileDrag: "drag",
  initial: "initial",
  animate: "enter",
  exit: "exit",
};

const EASING_REVERSE: Record<string, string> = {
  easeIn: "ease-in",
  easeOut: "ease-out",
  easeInOut: "ease-in-out",
  linear: "ease-linear",
  circIn: "ease-circ-in",
  circOut: "ease-circ-out",
  circInOut: "ease-circ-in-out",
  backIn: "ease-back-in",
  backOut: "ease-back-out",
  backInOut: "ease-back-in-out",
  anticipate: "ease-anticipate",
};

const round = (n: number) => Math.round(n * 1e6) / 1e6;

function withSign(base: string, n: number): string {
  return n < 0 ? `-${base}-${round(Math.abs(n))}` : `${base}-${round(n)}`;
}

/** x/y/width/etc — number or unit string ("100%", "50vh", "auto"). */
function dimension(base: string, value: unknown): string | null {
  if (typeof value === "number") return withSign(base, value);
  if (typeof value === "string") {
    if (value === "auto") return `${base}-auto`;
    const m = value.match(/^(-?)(\d*\.?\d+)(%|px|vh|vw|rem|em|dvh|svh|lvh)$/);
    if (m) {
      const unit = m[3] === "%" ? "pct" : m[3];
      return `${m[1] ? "-" : ""}${base}-${m[2]}${unit}`;
    }
  }
  return null;
}

/** scale/opacity — stored 0-1, expressed as 0-100 in classes. */
function scaled(base: string, value: unknown): string | null {
  if (typeof value !== "number") return null;
  return withSign(base, value * 100);
}

/** rotate/skew — degrees (number or "45deg"). */
function degrees(base: string, value: unknown): string | null {
  const n =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? parseFloat(value)
        : NaN;
  return isNaN(n) ? null : withSign(base, n);
}

/** color — only hex/rgb/hsl map to classes; named colors fall back to arbitrary. */
function color(base: string, value: unknown): string | null {
  if (typeof value !== "string") return null;
  if (/^#/.test(value) || /^(rgb|rgba|hsl|hsla)\(/.test(value)) {
    return `${base}-${value}`;
  }
  return null;
}

const PROP_SERIALIZERS: Record<string, (v: unknown) => string | null> = {
  x: (v) => dimension("x", v),
  y: (v) => dimension("y", v),
  z: (v) => dimension("z", v),
  scale: (v) => scaled("scale", v),
  scaleX: (v) => scaled("scale-x", v),
  scaleY: (v) => scaled("scale-y", v),
  rotate: (v) => degrees("rotate", v),
  rotateX: (v) => degrees("rotate-x", v),
  rotateY: (v) => degrees("rotate-y", v),
  skew: (v) => degrees("skew", v),
  skewX: (v) => degrees("skew-x", v),
  skewY: (v) => degrees("skew-y", v),
  opacity: (v) => scaled("opacity", v),
  borderRadius: (v) => dimension("rounded", v),
  width: (v) => dimension("w", v),
  height: (v) => dimension("h", v),
  top: (v) => dimension("top", v),
  left: (v) => dimension("left", v),
  right: (v) => dimension("right", v),
  bottom: (v) => dimension("bottom", v),
  backgroundColor: (v) => color("bg", v),
  color: (v) => color("text", v),
  borderColor: (v) => color("border", v),
};

/** Keys allowed as arbitrary [key=value] fallbacks. */
const ARBITRARY_ALLOWLIST = new Set([
  "backgroundColor",
  "color",
  "borderColor",
  "filter",
  "backdropFilter",
  "clipPath",
  "boxShadow",
]);

/** Convert one gesture property to a prop-value token (without the prefix). */
function propToToken(key: string, value: unknown): string | null {
  const fn = PROP_SERIALIZERS[key];
  if (fn) {
    const token = fn(value);
    if (token) return token;
  }
  // Arbitrary fallback for string/number values without spaces.
  if (
    ARBITRARY_ALLOWLIST.has(key) &&
    (typeof value === "string" || typeof value === "number") &&
    !String(value).includes(" ")
  ) {
    return `[${key}=${value}]`;
  }
  return null;
}

/** Serialize a gesture object (e.g. whileHover) → class tokens, or null. */
export function serializeGesture(
  gestureKey: string,
  values: Record<string, unknown>,
): string[] | null {
  const prefix = GESTURE_PREFIX[gestureKey];
  if (!prefix) return null;
  const out: string[] = [];
  for (const [key, value] of Object.entries(values)) {
    const token = propToToken(key, value);
    if (!token) return null;
    out.push(`animate-${prefix}:${token}`);
  }
  return out;
}

/** Serialize a transition object → class tokens, or null if unrepresentable. */
export function serializeTransition(t: Record<string, unknown>): string[] | null {
  const out: string[] = [];
  for (const [key, value] of Object.entries(t)) {
    switch (key) {
      case "type":
        if (value === "spring") out.push("animate-spring");
        else if (value !== "tween") return null; // inertia etc. unsupported
        break;
      case "duration":
        out.push(`animate-duration-${round((value as number) * 1000)}`);
        break;
      case "delay":
        out.push(`animate-delay-${round((value as number) * 1000)}`);
        break;
      case "ease":
        if (typeof value === "string" && EASING_REVERSE[value]) {
          out.push(`animate-${EASING_REVERSE[value]}`);
        } else if (Array.isArray(value) && value.length === 4) {
          out.push(`animate-ease-[${value.join(",")}]`);
        } else return null;
        break;
      case "stiffness":
        out.push(`animate-stiffness-${value}`);
        break;
      case "damping":
        out.push(`animate-damping-${value}`);
        break;
      case "mass":
        out.push(`animate-mass-${round((value as number) * 10)}`);
        break;
      case "bounce":
        out.push(`animate-bounce-${round((value as number) * 100)}`);
        break;
      case "repeat":
        out.push(
          value === Infinity ? "animate-repeat-infinite" : `animate-repeat-${value}`,
        );
        break;
      case "repeatType":
        if (value === "reverse") out.push("animate-repeat-reverse");
        else if (value === "mirror") out.push("animate-repeat-mirror");
        else return null;
        break;
      case "repeatDelay":
        out.push(`animate-repeat-delay-${round((value as number) * 1000)}`);
        break;
      case "staggerChildren":
        out.push(`animate-stagger-${round((value as number) * 1000)}`);
        break;
      case "delayChildren":
        out.push(`animate-delay-children-${round((value as number) * 1000)}`);
        break;
      case "staggerDirection":
        if (value === -1) out.push("animate-stagger-reverse");
        break;
      case "when":
        if (value === "beforeChildren") out.push("animate-when-before");
        else if (value === "afterChildren") out.push("animate-when-after");
        break;
      default:
        return null; // unknown transition key — bail to stay faithful
    }
  }
  return out;
}

/** Serialize a viewport object → class tokens, or null. */
export function serializeViewport(v: Record<string, unknown>): string[] | null {
  const out: string[] = [];
  for (const [key, value] of Object.entries(v)) {
    if (key === "once" && value === true) out.push("animate-once");
    else if (key === "amount" && value === "all") out.push("animate-amount-all");
    else if (key === "amount" && typeof value === "number")
      out.push(`animate-amount-${round(value * 100)}`);
    else if (key === "margin" && typeof value === "string") {
      const m = value.match(/^(-?\d+)px$/);
      if (!m) return null;
      out.push(`animate-margin-${m[1]}`);
    } else return null;
  }
  return out;
}
