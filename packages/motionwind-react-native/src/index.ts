// Component proxy — the main API
export { mw } from "./component.js";
export { MotionwindProvider, useMotionwindConfig } from "./config.js";
export { reactNativeAdapter, REACT_NATIVE_CAPABILITIES } from "./adapter.js";

// Hooks for custom usage
export { useMotionwind } from "./use-motionwind.js";
export { useInView } from "./use-in-view.js";

// Parser (shared core logic)
export { parseMotionClasses, clearParserCache } from "./parser.js";

// Variant + scroll context (for advanced/custom orchestration)
export {
  MotionwindVariantContext,
  useVariantContext,
} from "./variant-context.js";
export {
  MotionwindScrollContext,
  useMotionScrollContext,
} from "./scroll-context.js";

export {
  defineConfig,
  definePreset,
  defineMotionwindPlugin,
  MOTIONWIND_RECIPES,
} from "motionwind-core";
export type { MotionwindConfig, MotionwindDiagnostic } from "motionwind-core";

// Types
export type {
  ParsedResult,
  GestureKey,
  AnimatableValues,
  NativeAnimatableStyle,
  TransitionConfig,
  ViewportConfig,
  DragConfig,
  ScrollConfig,
  VariantMap,
  VariantState,
} from "./types.js";
