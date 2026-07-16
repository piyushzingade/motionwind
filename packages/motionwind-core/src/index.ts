// Framework-agnostic core for motionwind: the class parser + types.
// Adapters (react, vue, vanilla, …) build on top of this.
export {
  parseMotionClasses,
  clearParserCache,
  classifyMotionToken,
  type MotionTokenCategory,
} from "./parser.js";

export {
  defineConfig,
  defineMotionwindPlugin,
  definePreset,
  DEFAULT_MOTIONWIND_CONFIG,
  type MotionwindConfig,
  type MotionwindTokens,
  type MotionwindPlugin,
  type MotionwindDiagnostic,
  type MotionwindResultPatch,
  type ReducedMotionPolicy,
  type SpringToken,
} from "./config.js";

export {
  defineMotionwindAdapter,
  unsupportedCapabilities,
  type MotionwindAdapter,
  type MotionwindCapability,
  type AdapterCapabilities,
} from "./adapter.js";

export {
  MOTIONWIND_SYNTAX_REGISTRY,
  GESTURE_DEFINITIONS,
  PROPERTY_DEFINITIONS,
  CONFIG_DEFINITIONS,
  GESTURE_MAP,
  GESTURE_KEYS,
  EASING_MAP,
  getSyntaxDefinitions,
  type SyntaxDefinition,
  type SyntaxCategory,
  type Platform,
} from "./registry.js";

export {
  MOTIONWIND_RECIPES,
  BUILT_IN_PRESETS,
  getRecipe,
  type MotionwindRecipe,
} from "./recipes.js";

export {
  analyzeClassName,
  sortMotionClasses,
  type ClassNameAnalysis,
  type DuplicateProp,
} from "./analysis.js";

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
