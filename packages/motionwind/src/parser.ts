/**
 * Compatibility facade. The parser implementation lives exclusively in
 * motionwind-core so every adapter and developer tool consumes one grammar.
 */
export {
  parseMotionClasses,
  clearParserCache,
  classifyMotionToken,
  type MotionTokenCategory,
} from "motionwind-core";

export type {
  AnimatableValues,
  GestureKey,
  ParsedResult,
  TransitionConfig,
  ViewportConfig,
  DragConfig,
  LayoutConfig,
  ScrollConfig,
  VariantMap,
  VariantState,
} from "motionwind-core";
