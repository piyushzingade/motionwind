export { mw } from "./component.js";
export { MotionwindProvider } from "./component.js";
export { reactAdapter, REACT_CAPABILITIES } from "./adapter.js";
export { AnimatePresence as MotionwindPresence } from "motion/react";
export {
  parseMotionClasses,
  clearParserCache,
  defineConfig,
  definePreset,
  defineMotionwindPlugin,
  defineMotionwindAdapter,
  unsupportedCapabilities,
  MOTIONWIND_SYNTAX_REGISTRY,
  MOTIONWIND_RECIPES,
  BUILT_IN_PRESETS,
} from "motionwind-core";

export type {
  ParsedResult,
  GestureKey,
  AnimatableValues,
  TransitionConfig,
  ViewportConfig,
  DragConfig,
  LayoutConfig,
  MotionwindConfig,
  MotionwindPlugin,
  MotionwindAdapter,
  AdapterCapabilities,
  MotionwindRecipe,
} from "motionwind-core";
