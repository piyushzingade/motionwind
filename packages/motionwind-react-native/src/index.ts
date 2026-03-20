// Component proxy — the main API
export { mw } from "./component.js";

// Hooks for custom usage
export { useMotionwind } from "./use-motionwind.js";
export { useInView } from "./use-in-view.js";

// Parser (shared core logic)
export { parseMotionClasses, clearParserCache } from "./parser.js";

// Types
export type {
  ParsedResult,
  GestureKey,
  AnimatableValues,
  NativeAnimatableStyle,
  TransitionConfig,
  ViewportConfig,
  DragConfig,
} from "./types.js";
