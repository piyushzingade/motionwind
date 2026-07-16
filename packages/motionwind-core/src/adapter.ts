import type { ParsedResult } from "./types.js";

export type MotionwindCapability =
  | "gestures"
  | "scroll"
  | "layout"
  | "drag"
  | "variants"
  | "svg"
  | "reduced-motion";

export type AdapterCapabilities = Readonly<
  Record<MotionwindCapability, boolean>
>;

export interface MotionwindAdapter<TContext = unknown, TOutput = unknown> {
  name: string;
  version: string;
  capabilities: AdapterCapabilities;
  compile: (parsed: ParsedResult, context: TContext) => TOutput;
}

export function defineMotionwindAdapter<
  TContext,
  TOutput,
  const T extends MotionwindAdapter<TContext, TOutput>,
>(adapter: T): T {
  return adapter;
}

export function unsupportedCapabilities(
  parsed: ParsedResult,
  capabilities: AdapterCapabilities,
): MotionwindCapability[] {
  const unsupported: MotionwindCapability[] = [];
  if (Object.keys(parsed.gestures).length > 0 && !capabilities.gestures)
    unsupported.push("gestures");
  if (Object.keys(parsed.scroll.values).length > 0 && !capabilities.scroll)
    unsupported.push("scroll");
  if (Object.keys(parsed.layoutConfig).length > 0 && !capabilities.layout)
    unsupported.push("layout");
  if (Object.keys(parsed.dragConfig).length > 0 && !capabilities.drag)
    unsupported.push("drag");
  if (
    (Object.keys(parsed.variants).length > 0 ||
      Object.keys(parsed.variantState).length > 0) &&
    !capabilities.variants
  )
    unsupported.push("variants");
  const svgProperties = new Set(["pathLength", "pathOffset", "pathSpacing"]);
  if (
    !capabilities.svg &&
    Object.values(parsed.gestures).some((values) =>
      Object.keys(values ?? {}).some((property) => svgProperties.has(property)),
    )
  ) {
    unsupported.push("svg");
  }
  return unsupported;
}
