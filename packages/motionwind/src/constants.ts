import type { GestureKey } from "./types.js";

/** Maps class prefix to Motion gesture prop */
export const GESTURE_MAP: Record<string, GestureKey> = {
  hover: "whileHover",
  tap: "whileTap",
  focus: "whileFocus",
  inview: "whileInView",
  drag: "whileDrag",
  initial: "initial",
  enter: "animate",
  exit: "exit",
};

/** Set of known gesture keys for fast lookup */
export const GESTURE_KEYS = new Set(Object.keys(GESTURE_MAP));

/** Maps easing class suffixes to Motion easing values */
export const EASING_MAP: Record<string, string> = {
  "ease-in": "easeIn",
  "ease-out": "easeOut",
  "ease-in-out": "easeInOut",
  "ease-linear": "linear",
};

/** Known transition config keywords (after `animate-` prefix) */
export const TRANSITION_KEYWORDS = new Set([
  "duration",
  "delay",
  "ease-in",
  "ease-out",
  "ease-in-out",
  "ease-linear",
  "spring",
  "stiffness",
  "damping",
  "bounce",
  "mass",
  "repeat",
  "repeat-infinite",
]);

/** Known viewport config keywords */
export const VIEWPORT_KEYWORDS = new Set(["once", "amount-all", "margin"]);

/** Known drag config keywords */
export const DRAG_KEYWORDS = new Set([
  "drag-x",
  "drag-y",
  "drag-both",
  "drag-elastic",
]);
