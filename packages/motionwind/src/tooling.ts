// Shared helpers for tooling built on top of motionwind: the ESLint plugin,
// the Prettier class-sorter, the Playground, and docs codegen.

export {
  parseMotionClasses,
  classifyMotionToken,
  type MotionTokenCategory,
  analyzeClassName,
  sortMotionClasses,
  MOTIONWIND_SYNTAX_REGISTRY,
  MOTIONWIND_RECIPES,
  type ClassNameAnalysis,
  type DuplicateProp,
  type SyntaxDefinition,
} from "motionwind-core";
export { generateMotionCode, type GenerateOptions } from "./codegen.js";
export type { ParsedResult } from "motionwind-core";
