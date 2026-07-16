export { GESTURE_MAP, GESTURE_KEYS, EASING_MAP } from "./registry.js";

/** Known transition config keywords (after `animate-` prefix) */
export const TRANSITION_KEYWORDS = new Set([
  "duration",
  "delay",
  "ease-in",
  "ease-out",
  "ease-in-out",
  "ease-linear",
  "ease-circ-in",
  "ease-circ-out",
  "ease-circ-in-out",
  "ease-back-in",
  "ease-back-out",
  "ease-back-in-out",
  "ease-anticipate",
  "ease-steps",
  "spring",
  "stiffness",
  "damping",
  "bounce",
  "mass",
  "repeat",
  "repeat-infinite",
  "repeat-reverse",
  "repeat-mirror",
  "repeat-delay",
  "stagger",
  "stagger-reverse",
  "delay-children",
  "when-before",
  "when-after",
  "rest-speed",
  "rest-delta",
  "times",
]);

/** Known viewport config keywords */
export const VIEWPORT_KEYWORDS = new Set([
  "once",
  "amount-all",
  "amount",
  "margin",
]);

/** Known drag config keywords */
export const DRAG_KEYWORDS = new Set([
  "drag-x",
  "drag-y",
  "drag-both",
  "drag-elastic",
  "drag-snap",
  "drag-no-momentum",
  "drag-lock",
  "drag-constraint-t",
  "drag-constraint-l",
  "drag-constraint-r",
  "drag-constraint-b",
]);

/** Known layout config keywords */
export const LAYOUT_KEYWORDS = new Set([
  "layout",
  "layout-position",
  "layout-size",
  "layout-preserve",
  "layout-id",
  "layout-scroll",
  "layout-root",
]);
