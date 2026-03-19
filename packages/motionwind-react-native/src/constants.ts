import type { GestureKey } from "./types.js";

/** Maps class prefix to gesture prop key */
export const GESTURE_MAP: Record<string, GestureKey> = {
  // "hover" is kept for cross-platform compat but becomes a no-op on native
  hover: "whileHover",
  tap: "whileTap",
  focus: "whileFocus",
  inview: "whileInView",
  initial: "initial",
  enter: "animate",
  exit: "exit",
};

export const GESTURE_KEYS = new Set(Object.keys(GESTURE_MAP));

/** Maps easing class suffixes to Reanimated-compatible easing names */
export const EASING_MAP: Record<string, string> = {
  "ease-in": "easeIn",
  "ease-out": "easeOut",
  "ease-in-out": "easeInOut",
  "ease-linear": "linear",
  "ease-circ-in": "circIn",
  "ease-circ-out": "circOut",
  "ease-circ-in-out": "circInOut",
  "ease-back-in": "backIn",
  "ease-back-out": "backOut",
  "ease-back-in-out": "backInOut",
};

/** Tailwind CSS built-in animate-* classes to exclude from motionwind parsing */
export const TAILWIND_ANIMATE_CLASSES = new Set([
  "animate-spin",
  "animate-ping",
  "animate-pulse",
  "animate-bounce",
  "animate-none",
]);

/**
 * Properties that require degree string values in RN transforms.
 * In web motion, rotate is a number (degrees). In RN, it must be "45deg".
 */
export const DEGREE_PROPERTIES = new Set([
  "rotate",
  "rotateX",
  "rotateY",
  "rotateZ",
  "skewX",
  "skewY",
]);

/**
 * Web-only properties that are NOT supported in React Native.
 * These are silently dropped during parsing.
 */
export const WEB_ONLY_PROPERTIES = new Set([
  "filter",
  "backdropFilter",
  "clipPath",
  "boxShadow",
  "pathLength",
  "pathOffset",
  "pathSpacing",
]);

/**
 * Maps web property names to RN transform property names.
 * Properties like "x" become "translateX" in RN.
 */
export const WEB_TO_RN_PROPERTY_MAP: Record<string, string> = {
  x: "translateX",
  y: "translateY",
};
