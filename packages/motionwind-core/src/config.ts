import type { ParsedResult } from "./types.js";
import type { SyntaxDefinition } from "./registry.js";

export type ReducedMotionPolicy = "user" | "always" | "never";

export interface SpringToken {
  stiffness?: number;
  damping?: number;
  bounce?: number;
  mass?: number;
}

export interface MotionwindTokens {
  durations?: Record<string, number>;
  easings?: Record<string, string | number[]>;
  springs?: Record<string, SpringToken>;
}

export interface MotionwindDiagnostic {
  code: string;
  message: string;
  severity: "info" | "warning" | "error";
  token?: string;
  plugin?: string;
}

export interface MotionwindResultPatch {
  gestures?: ParsedResult["gestures"];
  transition?: ParsedResult["transition"];
  viewport?: ParsedResult["viewport"];
  dragConfig?: ParsedResult["dragConfig"];
  layoutConfig?: ParsedResult["layoutConfig"];
  scroll?: Partial<ParsedResult["scroll"]>;
  variants?: ParsedResult["variants"];
  variantState?: ParsedResult["variantState"];
}

export interface MotionwindPluginContext {
  config: MotionwindConfig;
}

export interface MotionwindPlugin {
  name: string;
  version: string;
  core?: string;
  presets?: Record<string, string | readonly string[]>;
  definitions?: readonly SyntaxDefinition[];
  transformToken?: (
    token: string,
    context: MotionwindPluginContext,
  ) => MotionwindResultPatch | null;
  diagnose?: (
    className: string,
    parsed: ParsedResult,
    context: MotionwindPluginContext,
  ) => readonly MotionwindDiagnostic[];
}

export interface MotionwindConfig {
  adapter?: string;
  strict?: boolean;
  reducedMotion?: ReducedMotionPolicy;
  tokens?: MotionwindTokens;
  presets?: Record<string, string | readonly string[]>;
  plugins?: readonly MotionwindPlugin[];
}

export function defineConfig<const T extends MotionwindConfig>(config: T): T {
  return config;
}

export function defineMotionwindPlugin<const T extends MotionwindPlugin>(
  plugin: T,
): T {
  if (!plugin.name.trim())
    throw new Error("[motionwind] Plugins require a name.");
  if (!plugin.version.trim())
    throw new Error("[motionwind] Plugins require a version.");
  return plugin;
}

export function definePreset<const T extends string | readonly string[]>(
  preset: T,
): T {
  return preset;
}

export const DEFAULT_MOTIONWIND_CONFIG: Readonly<MotionwindConfig> =
  Object.freeze({
    strict: false,
    reducedMotion: "user",
    plugins: [],
    presets: {},
    tokens: {},
  });
