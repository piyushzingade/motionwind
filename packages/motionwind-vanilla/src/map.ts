import type { AnimatableValues, ParsedResult, TransitionConfig } from "motionwind-core";

/** Resting values used to animate back after a gesture ends. */
const RESET_DEFAULTS: Record<string, number | string> = {
  scale: 1,
  scaleX: 1,
  scaleY: 1,
  opacity: 1,
  x: 0,
  y: 0,
  z: 0,
  rotate: 0,
  rotateX: 0,
  rotateY: 0,
  skewX: 0,
  skewY: 0,
};

/** Transition keys that apply to a single vanilla `animate()` call. */
const OPTION_KEYS: (keyof TransitionConfig)[] = [
  "duration",
  "delay",
  "ease",
  "type",
  "stiffness",
  "damping",
  "mass",
  "bounce",
  "repeat",
  "repeatType",
  "repeatDelay",
  "times",
];

/** Project our TransitionConfig onto vanilla Motion's animate() options. */
export function toAnimateOptions(
  transition: TransitionConfig,
): Record<string, unknown> {
  const opts: Record<string, unknown> = {};
  for (const key of OPTION_KEYS) {
    if (transition[key] !== undefined) opts[key] = transition[key];
  }
  return opts;
}

/**
 * Build the resting values to animate back to when a gesture (hover/tap/focus)
 * ends. Prefers the enter (`animate`) value, then `initial`, then a sensible
 * default, for each key the gestures touch.
 */
export function baseValues(parsed: ParsedResult): AnimatableValues {
  const keys = new Set<string>();
  for (const g of [
    parsed.gestures.whileHover,
    parsed.gestures.whileTap,
    parsed.gestures.whileFocus,
    parsed.gestures.whileInView,
  ]) {
    if (g) Object.keys(g).forEach((k) => keys.add(k));
  }

  const base: AnimatableValues = {};
  const enter = parsed.gestures.animate;
  const initial = parsed.gestures.initial;
  for (const k of keys) {
    const v =
      (enter as Record<string, AnimatableValues[string]> | undefined)?.[k] ??
      (initial as Record<string, AnimatableValues[string]> | undefined)?.[k] ??
      RESET_DEFAULTS[k] ??
      0;
    base[k] = v;
  }
  return base;
}

/** Pick a subset of `values` limited to the keys present in `shape`. */
export function subset(
  values: AnimatableValues,
  shape: AnimatableValues,
): AnimatableValues {
  const out: AnimatableValues = {};
  for (const k of Object.keys(shape)) {
    if (values[k] !== undefined) out[k] = values[k]!;
  }
  return out;
}
