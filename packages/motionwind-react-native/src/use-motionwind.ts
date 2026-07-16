import { useEffect, useRef, useMemo, useCallback } from "react";
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  withRepeat,
  withSequence,
  interpolate,
  Easing,
  type SharedValue,
  type AnimatedStyle,
  runOnJS,
  useReducedMotion,
} from "react-native-reanimated";
import type {
  NativeAnimatableStyle,
  TransitionConfig,
  ParsedResult,
} from "./types.js";
import { parseMotionClasses } from "./parser.js";
import { DEGREE_PROPERTIES } from "./constants.js";
import {
  useVariantContext,
  type VariantContextValue,
} from "./variant-context.js";
import { useMotionScrollContext } from "./scroll-context.js";
import { useMotionwindConfig } from "./config.js";

/** Transform properties that go into the `transform` array */
const TRANSFORM_KEYS = new Set([
  "translateX",
  "translateY",
  "scale",
  "scaleX",
  "scaleY",
  "rotate",
  "rotateX",
  "rotateY",
  "rotateZ",
  "skewX",
  "skewY",
]);

/** Default style values when no initial state is specified */
const DEFAULT_VALUES: Record<string, number | string> = {
  translateX: 0,
  translateY: 0,
  scale: 1,
  scaleX: 1,
  scaleY: 1,
  rotate: "0deg",
  rotateX: "0deg",
  rotateY: "0deg",
  rotateZ: "0deg",
  skewX: "0deg",
  skewY: "0deg",
  opacity: 1,
  borderRadius: 0,
  borderWidth: 0,
};

/**
 * Build a Reanimated easing function from our TransitionConfig.
 */
function getEasing(config: TransitionConfig) {
  if (!config.easing) return Easing.out(Easing.cubic);

  if (Array.isArray(config.easing)) {
    const [x1, y1, x2, y2] = config.easing;
    return Easing.bezier(x1!, y1!, x2!, y2!);
  }

  switch (config.easing) {
    case "linear":
      return Easing.linear;
    case "easeIn":
      return Easing.in(Easing.cubic);
    case "easeOut":
      return Easing.out(Easing.cubic);
    case "easeInOut":
      return Easing.inOut(Easing.cubic);
    case "circIn":
      return Easing.in(Easing.circle);
    case "circOut":
      return Easing.out(Easing.circle);
    case "circInOut":
      return Easing.inOut(Easing.circle);
    case "backIn":
      return Easing.in(Easing.back(1.7));
    case "backOut":
      return Easing.out(Easing.back(1.7));
    case "backInOut":
      return Easing.inOut(Easing.back(1.7));
    default:
      return Easing.out(Easing.cubic);
  }
}

/**
 * Create a Reanimated animation wrapper based on transition config.
 */
function createAnimation(
  toValue: number | string,
  config: TransitionConfig,
): number | string {
  "worklet";
  // This function is called outside worklet context — we build the animation config
  // and return the wrapped animation value.

  const isSpring =
    config.type === "spring" || config.stiffness || config.damping;

  let animation: number | string;

  if (isSpring) {
    const springConfig: Record<string, number> = {};
    if (config.stiffness !== undefined)
      springConfig.stiffness = config.stiffness;
    if (config.damping !== undefined) springConfig.damping = config.damping;
    if (config.mass !== undefined) springConfig.mass = config.mass;
    if (config.restDisplacementThreshold !== undefined)
      springConfig.restDisplacementThreshold = config.restDisplacementThreshold;
    if (config.restSpeedThreshold !== undefined)
      springConfig.restSpeedThreshold = config.restSpeedThreshold;

    animation = withSpring(toValue as number, springConfig);
  } else {
    const timingConfig: {
      duration?: number;
      easing?: ReturnType<typeof getEasing>;
    } = {};
    if (config.duration !== undefined) timingConfig.duration = config.duration;
    timingConfig.easing = getEasing(config);

    animation = withTiming(toValue as number, timingConfig);
  }

  // Wrap with delay if specified
  if (config.delay && config.delay > 0) {
    animation = withDelay(config.delay, animation as number);
  }

  // Wrap with repeat if specified
  if (config.repeat !== undefined) {
    const repeatCount = config.repeat === -1 ? -1 : config.repeat;
    animation = withRepeat(
      animation as number,
      repeatCount,
      config.repeatReverse ?? false,
    );
  }

  return animation;
}

/**
 * Collect all unique animatable property keys from a parsed result's gestures.
 */
function collectAnimatableKeys(parsed: ParsedResult): string[] {
  const keys = new Set<string>();
  for (const style of Object.values(parsed.gestures)) {
    if (style) {
      for (const key of Object.keys(style)) {
        keys.add(key);
      }
    }
  }
  // Variant target styles also need shared values.
  for (const style of Object.values(parsed.variants)) {
    if (style) {
      for (const key of Object.keys(style)) {
        keys.add(key);
      }
    }
  }
  return Array.from(keys);
}

/**
 * Hook that parses a motionwind className and returns Reanimated animated styles.
 *
 * @example
 * ```tsx
 * const { animatedStyle, handlers } = useMotionwind(
 *   "animate-enter:opacity-0 animate-enter:y-20 animate-duration-300"
 * );
 * ```
 */
export function useMotionwind(className: string) {
  const config = useMotionwindConfig();
  const systemReducedMotion = useReducedMotion();
  const reduceMotion =
    config?.reducedMotion === "always" ||
    (config?.reducedMotion !== "never" && systemReducedMotion);
  const parsed = useMemo(
    () => parseMotionClasses(className, config),
    [className, config],
  );

  const variantCtx = useVariantContext();
  const scrollCtx = useMotionScrollContext();

  // Resolve the active/initial variant names (self overrides inherited context).
  const hasVariants = Object.keys(parsed.variants).length > 0;
  const activeVariant = parsed.variantState.animate ?? variantCtx.active;
  const initialVariant = parsed.variantState.initial ?? variantCtx.initial;

  // Create shared values for each animatable property
  const sharedValues = useRef<Map<string, SharedValue<number | string>>>(
    new Map(),
  );

  const animatableKeys = useMemo(() => collectAnimatableKeys(parsed), [parsed]);

  // Initialize shared values for all animatable properties
  // We use a stable ref map to avoid recreating shared values
  for (const key of animatableKeys) {
    if (!sharedValues.current.has(key)) {
      const initialGesture = parsed.gestures.initial;
      const initialVariantStyle =
        initialVariant && parsed.variants[initialVariant]
          ? parsed.variants[initialVariant]
          : undefined;
      // A named initial variant takes precedence over the initial gesture.
      const source = initialVariantStyle ?? initialGesture;
      const defaultVal = DEFAULT_VALUES[key] ?? 0;
      const initialVal = source
        ? (((source as Record<string, unknown>)[key] as
            | number
            | string
            | undefined) ?? defaultVal)
        : defaultVal;

      // eslint-disable-next-line react-hooks/rules-of-hooks
      const sv = useSharedValue(initialVal);
      sharedValues.current.set(key, sv);
    }
  }
  // Capture shared values in a plain array. Reanimated Web cannot discover
  // subscriptions hidden inside a Map stored on a React ref.
  const animatedEntries = useMemo(
    () =>
      animatableKeys.map(
        (key) => [key, sharedValues.current.get(key)!] as const,
      ),
    [animatableKeys],
  );

  /**
   * Animate to a target gesture state.
   */
  const animateTo = useCallback(
    (gestureStyle: NativeAnimatableStyle | undefined) => {
      if (!gestureStyle) return;

      for (const [key, targetValue] of Object.entries(gestureStyle)) {
        const sv = sharedValues.current.get(key);
        if (sv) {
          sv.value = reduceMotion
            ? (targetValue as number | string)
            : createAnimation(
                targetValue as number | string,
                parsed.transition,
              );
        }
      }
    },
    [parsed.transition, reduceMotion],
  );

  /**
   * Reset to the "animate" (enter) state or defaults.
   */
  const resetToBase = useCallback(() => {
    const baseStyle = parsed.gestures.animate;

    for (const key of animatableKeys) {
      const sv = sharedValues.current.get(key);
      if (!sv) continue;

      const baseVal = baseStyle
        ? ((baseStyle as Record<string, unknown>)[key] as
            | number
            | string
            | undefined)
        : undefined;
      const defaultVal = DEFAULT_VALUES[key] ?? 0;
      const target = baseVal ?? defaultVal;

      sv.value = reduceMotion
        ? target
        : createAnimation(target, parsed.transition);
    }
  }, [parsed, animatableKeys, reduceMotion]);

  // Run entrance animation on mount
  useEffect(() => {
    if (parsed.gestures.animate) {
      // If there's an initial state, animate from initial → animate
      const delay = parsed.transition.delay ?? 0;
      const timer = setTimeout(() => {
        animateTo(parsed.gestures.animate);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [parsed, animateTo]);

  // Animate to the active variant target whenever it changes (self or inherited).
  // `variantCtx.active` is listed explicitly since `activeVariant` derives from
  // it, so the effect always animates to the freshest inherited variant.
  useEffect(() => {
    if (hasVariants && activeVariant) {
      const target = parsed.variants[activeVariant];
      if (target) {
        // Schedule after the animated style has subscribed to its shared
        // values. This is required by Reanimated Web and is harmless on native.
        const delay = parsed.transition.delay ?? 0;
        const timer = setTimeout(() => animateTo(target), delay);
        return () => clearTimeout(timer);
      }
    }
  }, [hasVariants, activeVariant, parsed, animateTo, variantCtx.active]);

  // Precompute scroll config outside the worklet.
  const scrollValues = parsed.scroll.values;
  const scrollAxis = parsed.scroll.axis;
  const hasScroll = Object.keys(scrollValues).length > 0;
  const progressX = scrollCtx.progressX;
  const progressY = scrollCtx.progressY;

  // Build animated style
  const animatedStyle = useAnimatedStyle(() => {
    const style: Record<string, unknown> = {};
    const transforms: Record<string, number | string>[] = [];

    for (const [key, sv] of animatedEntries) {
      if (TRANSFORM_KEYS.has(key)) {
        transforms.push({ [key]: sv.value });
      } else {
        style[key] = sv.value;
      }
    }

    // Scroll-linked values interpolate the container progress into style.
    if (hasScroll) {
      const progress = scrollAxis === "x" ? progressX : progressY;
      if (progress) {
        for (const key in scrollValues) {
          const range = scrollValues[key]!;
          const input = range.map((_, i) =>
            range.length === 1 ? 0 : i / (range.length - 1),
          );
          const raw = interpolate(progress.value, input, range);
          const val: number | string = DEGREE_PROPERTIES.has(key)
            ? `${raw}deg`
            : raw;
          if (TRANSFORM_KEYS.has(key)) {
            transforms.push({ [key]: val });
          } else {
            style[key] = val;
          }
        }
      }
    }

    if (transforms.length > 0) {
      style.transform = transforms;
    }

    return style;
  }, [
    animatedEntries,
    hasScroll,
    progressX,
    progressY,
    scrollAxis,
    scrollValues,
  ]);

  // Gesture handlers for tap, hover (pressIn/pressOut on RN)
  const handlers = useMemo(() => {
    const h: Record<string, () => void> = {};

    if (reduceMotion) return h;

    if (parsed.gestures.whileTap) {
      h.onPressIn = () => animateTo(parsed.gestures.whileTap);
      h.onPressOut = () => resetToBase();
    }

    // whileHover → onHoverIn/onHoverOut (RN 0.71+ with Pointer Events)
    if (parsed.gestures.whileHover) {
      h.onHoverIn = () => animateTo(parsed.gestures.whileHover);
      h.onHoverOut = () => resetToBase();
    }

    // whileFocus → onFocus/onBlur
    if (parsed.gestures.whileFocus) {
      h.onFocus = () => animateTo(parsed.gestures.whileFocus);
      h.onBlur = () => resetToBase();
    }

    return h;
  }, [parsed.gestures, animateTo, resetToBase, reduceMotion]);

  // If this element selects a variant state, propagate it to descendants.
  const variantProvide: VariantContextValue | undefined =
    parsed.variantState.animate || parsed.variantState.initial
      ? { active: activeVariant, initial: initialVariant }
      : undefined;

  return {
    animatedStyle,
    handlers,
    parsed,
    animateTo,
    resetToBase,
    variantProvide,
  };
}
