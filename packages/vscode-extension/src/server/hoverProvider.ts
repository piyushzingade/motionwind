import { Hover, HoverParams, MarkupKind } from "vscode-languageserver/node.js";
import { TextDocument } from "vscode-languageserver-textdocument";
import { getTokenAtPosition } from "./documentUtils.js";
import { parseMotionClasses } from "../shared/parser.js";
import type { ParsedResult } from "../shared/types.js";

/**
 * Handle hover requests: parse the class under cursor and show compiled Motion output.
 */
export function handleHover(
  params: HoverParams,
  document: TextDocument,
  classAttributes: string[],
): Hover | null {
  const token = getTokenAtPosition(document, params.position, classAttributes);
  if (!token) return null;

  // Only show hover for motionwind classes
  if (!token.value.startsWith("animate-")) return null;

  const result = parseMotionClasses(token.value);
  if (!result.hasMotion) return null;

  const markdown = renderMotionOutput(token.value, result);

  return {
    contents: {
      kind: MarkupKind.Markdown,
      value: markdown,
    },
    range: token.range,
  };
}

function renderMotionOutput(className: string, result: ParsedResult): string {
  const lines: string[] = [];
  lines.push(`**motionwind** \`${className}\`\n`);
  lines.push("```jsx");
  lines.push("<motion.div");

  // Gesture props
  for (const [gesture, values] of Object.entries(result.gestures)) {
    const propName = gesture;
    const formatted = formatValues(values);
    lines.push(`  ${propName}={${formatted}}`);
  }

  // Transition
  if (Object.keys(result.transition).length > 0) {
    lines.push(`  transition={${formatObject(result.transition as unknown as Record<string, unknown>)}}`);
  }

  // Viewport
  if (Object.keys(result.viewport).length > 0) {
    lines.push(`  viewport={${formatObject(result.viewport as unknown as Record<string, unknown>)}}`);
  }

  // Drag
  if (result.dragConfig.drag !== undefined) {
    const { drag, ...rest } = result.dragConfig;
    if (drag === true) {
      lines.push(`  drag={true}`);
    } else {
      lines.push(`  drag="${drag}"`);
    }
    for (const [key, value] of Object.entries(rest)) {
      if (typeof value === "object") {
        lines.push(`  ${key}={${formatObject(value)}}`);
      } else {
        lines.push(`  ${key}={${JSON.stringify(value)}}`);
      }
    }
  }

  // Layout
  if (result.layoutConfig.layout !== undefined) {
    const { layout, ...rest } = result.layoutConfig;
    if (layout === true) {
      lines.push(`  layout`);
    } else {
      lines.push(`  layout="${layout}"`);
    }
    for (const [key, value] of Object.entries(rest)) {
      if (typeof value === "string") {
        lines.push(`  ${key}="${value}"`);
      } else {
        lines.push(`  ${key}={${JSON.stringify(value)}}`);
      }
    }
  } else {
    // Handle remaining layout props without layout itself
    const { layout: _, ...rest } = result.layoutConfig;
    for (const [key, value] of Object.entries(rest)) {
      if (typeof value === "string") {
        lines.push(`  ${key}="${value}"`);
      } else {
        lines.push(`  ${key}={${JSON.stringify(value)}}`);
      }
    }
  }

  lines.push("/>");
  lines.push("```");

  return lines.join("\n");
}

function formatValues(values: Record<string, unknown>): string {
  const entries = Object.entries(values)
    .map(([k, v]) => {
      if (typeof v === "string") return `${k}: "${v}"`;
      if (Array.isArray(v)) return `${k}: [${v.join(", ")}]`;
      return `${k}: ${v}`;
    })
    .join(", ");
  return `{ ${entries} }`;
}

function formatObject(obj: Record<string, unknown>): string {
  const entries = Object.entries(obj)
    .map(([k, v]) => {
      if (v === Infinity) return `${k}: Infinity`;
      if (typeof v === "string") return `${k}: "${v}"`;
      if (typeof v === "object" && v !== null) {
        if (Array.isArray(v)) return `${k}: [${v.join(", ")}]`;
        return `${k}: ${formatObject(v as Record<string, unknown>)}`;
      }
      return `${k}: ${v}`;
    })
    .join(", ");
  return `{ ${entries} }`;
}
