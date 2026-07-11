// Framework-agnostic core for motionwind: the class parser + types.
// Adapters (react, vue, vanilla, …) build on top of this.
export {
  parseMotionClasses,
  clearParserCache,
  classifyMotionToken,
  type MotionTokenCategory,
} from "./parser.js";

export type {
  ParsedResult,
  GestureKey,
  AnimatableValues,
  TransitionConfig,
  ViewportConfig,
  DragConfig,
  LayoutConfig,
  ScrollConfig,
  VariantMap,
  VariantState,
} from "./types.js";
