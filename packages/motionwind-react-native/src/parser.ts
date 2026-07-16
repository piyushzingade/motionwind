import {
  parseMotionClasses as parseCoreMotionClasses,
  type AnimatableValues as CoreAnimatableValues,
  type MotionwindConfig,
  type MotionwindDiagnostic,
  type ParsedResult as CoreParsedResult,
} from "motionwind-core";
import type {
  DragConfig,
  GestureKey,
  NativeAnimatableStyle,
  ParsedResult,
  ScrollConfig,
  TransitionConfig,
  VariantMap,
  ViewportConfig,
} from "./types.js";

const CACHE_MAX = 1000;
const cache = new Map<string, ParsedResult>();
const DEGREE_PROPERTIES = new Set([
  "rotate",
  "rotateX",
  "rotateY",
  "rotateZ",
  "skewX",
  "skewY",
]);
const WEB_ONLY_PROPERTIES = new Set([
  "filter",
  "backdropFilter",
  "clipPath",
  "boxShadow",
  "pathLength",
  "pathOffset",
  "pathSpacing",
  "perspective",
  "z",
]);
const NATIVE_GESTURES = new Set<GestureKey>([
  "whileHover",
  "whileTap",
  "whileFocus",
  "initial",
  "animate",
  "exit",
]);
const WEB_ONLY_TOKEN =
  /(?:^|:)(?:blur-|brightness-|contrast-|saturate-|grayscale-|sepia-|invert-|hue-rotate-|drop-shadow-|backdrop-blur-|clip-path-|path-length-|path-offset-|path-spacing-|perspective-|z-)/;
type NativeValue = string | number | (string | number)[];

function cacheSet(key: string, value: ParsedResult): void {
  if (cache.size >= CACHE_MAX) {
    const firstKey = cache.keys().next().value;
    if (firstKey !== undefined) cache.delete(firstKey);
  }
  cache.set(key, value);
}

function nativeKey(key: string): string {
  if (key === "x") return "translateX";
  if (key === "y") return "translateY";
  return key;
}

function nativeValue(
  key: string,
  value: CoreAnimatableValues[string],
): NativeValue {
  if (!DEGREE_PROPERTIES.has(key)) return value;
  if (Array.isArray(value)) {
    return value.map((item) =>
      typeof item === "number" ? `${item}deg` : item,
    );
  }
  return typeof value === "number" ? `${value}deg` : value;
}

function nativeStyle(
  values: CoreAnimatableValues | undefined,
): NativeAnimatableStyle | undefined {
  if (!values) return undefined;
  const style: Record<string, NativeValue> = {};
  for (const [key, value] of Object.entries(values)) {
    if (WEB_ONLY_PROPERTIES.has(key)) continue;
    const mapped = nativeKey(key);
    style[mapped] = nativeValue(mapped, value);
  }
  return Object.keys(style).length > 0
    ? (style as NativeAnimatableStyle)
    : undefined;
}

function nativeTransition(
  core: CoreParsedResult["transition"],
): TransitionConfig {
  const transition: TransitionConfig = {};
  if (core.type) transition.type = core.type === "spring" ? "spring" : "timing";
  if (core.duration !== undefined) transition.duration = core.duration * 1000;
  if (core.delay !== undefined) transition.delay = core.delay * 1000;
  if (core.ease !== undefined)
    transition.easing = core.ease as TransitionConfig["easing"];
  if (core.stiffness !== undefined) transition.stiffness = core.stiffness;
  if (core.damping !== undefined) transition.damping = core.damping;
  if (core.mass !== undefined) transition.mass = core.mass;
  if (core.repeat !== undefined)
    transition.repeat = core.repeat === Infinity ? -1 : core.repeat;
  if (core.repeatType !== undefined)
    transition.repeatReverse = core.repeatType === "reverse";
  if (core.staggerChildren !== undefined)
    transition.staggerChildren = core.staggerChildren * 1000;
  if (core.staggerDirection !== undefined)
    transition.staggerDirection = core.staggerDirection;
  if (core.delayChildren !== undefined)
    transition.delayChildren = core.delayChildren * 1000;
  if (core.restSpeed !== undefined)
    transition.restSpeedThreshold = core.restSpeed;
  if (core.restDelta !== undefined)
    transition.restDisplacementThreshold = core.restDelta;
  return transition;
}

function nativeViewport(core: CoreParsedResult["viewport"]): ViewportConfig {
  const viewport: ViewportConfig = {};
  if (core.once !== undefined) viewport.once = core.once;
  if (core.amount !== undefined) viewport.amount = core.amount;
  if (core.margin !== undefined)
    viewport.margin = Number.parseFloat(core.margin);
  return viewport;
}

function nativeScroll(core: CoreParsedResult["scroll"]): ScrollConfig {
  const values: Record<string, number[]> = {};
  for (const [key, range] of Object.entries(core.values)) {
    if (WEB_ONLY_PROPERTIES.has(key)) continue;
    values[nativeKey(key)] = range;
  }
  return {
    axis: core.axis,
    container: core.container,
    offset: core.offset,
    values,
  };
}

function unsupportedDiagnostic(
  code: string,
  message: string,
): MotionwindDiagnostic {
  return { code, message, severity: "warning" };
}

function isDevelopment(): boolean {
  if (typeof __DEV__ !== "undefined") return __DEV__;
  return true;
}

/**
 * Parse once with motionwind-core, then adapt the stable Motion-first IR to
 * Reanimated property names and millisecond timing. React Native never owns a
 * second syntax implementation.
 */
export function parseMotionClasses(
  className: string,
  config?: MotionwindConfig,
): ParsedResult {
  const cached = config ? undefined : cache.get(className);
  if (cached) return cached;

  const core = parseCoreMotionClasses(className, config);
  const diagnostics = [...core.diagnostics];
  const gestures: ParsedResult["gestures"] = {};
  for (const [gesture, values] of Object.entries(core.gestures)) {
    if (gesture === "whileInView") {
      diagnostics.push(
        unsupportedDiagnostic(
          "unsupported-native-inview",
          "React Native in-view classes require direct useInView orchestration in v2.",
        ),
      );
      continue;
    }
    if (!NATIVE_GESTURES.has(gesture as GestureKey)) continue;
    const style = nativeStyle(values);
    if (style) gestures[gesture as GestureKey] = style;
  }

  const variants: VariantMap = {};
  for (const [name, values] of Object.entries(core.variants)) {
    const style = nativeStyle(values);
    if (style) variants[name] = style;
  }

  let dragConfig: DragConfig = {};
  if (Object.keys(core.dragConfig).length > 0 || core.gestures.whileDrag) {
    diagnostics.push(
      unsupportedDiagnostic(
        "unsupported-native-drag",
        "React Native drag classes require a direct Gesture Handler integration in v2.",
      ),
    );
    dragConfig = {};
  }
  if (Object.keys(core.layoutConfig).length > 0) {
    diagnostics.push(
      unsupportedDiagnostic(
        "unsupported-native-layout",
        "Use a Reanimated layout transition directly; layout classes are not consumed on React Native.",
      ),
    );
  }

  const unsupportedTokens = className
    .split(/\s+/)
    .filter(
      (token) => token.startsWith("animate-") && WEB_ONLY_TOKEN.test(token),
    );
  if (unsupportedTokens.length > 0) {
    diagnostics.push(
      unsupportedDiagnostic(
        "unsupported-native-property",
        `Unsupported React Native properties: ${unsupportedTokens.join(", ")}.`,
      ),
    );
  }
  if (isDevelopment()) {
    for (const diagnostic of diagnostics.filter(({ code }) =>
      code.startsWith("unsupported-native"),
    )) {
      console.warn(`[motionwind-rn] ${diagnostic.message}`);
    }
  }

  const nativewindClasses = [core.tailwindClasses, ...unsupportedTokens]
    .filter(Boolean)
    .join(" ");
  const scroll = nativeScroll(core.scroll);
  const hasMotion =
    Object.keys(gestures).length > 0 ||
    Object.keys(core.transition).length > 0 ||
    Object.keys(variants).length > 0 ||
    Object.keys(core.variantState).length > 0 ||
    Object.keys(scroll.values).length > 0;

  const result: ParsedResult = {
    nativewindClasses,
    gestures,
    transition: nativeTransition(core.transition),
    viewport: nativeViewport(core.viewport),
    dragConfig,
    scroll,
    variants,
    variantState: core.variantState,
    hasMotion,
    diagnostics,
  };

  if (!config) cacheSet(className, result);
  return result;
}

export function clearParserCache(): void {
  cache.clear();
}

declare const __DEV__: boolean;
