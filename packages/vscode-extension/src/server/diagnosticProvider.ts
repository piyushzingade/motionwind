import {
  Diagnostic,
  DiagnosticSeverity,
} from "vscode-languageserver/node.js";
import { TextDocument } from "vscode-languageserver-textdocument";
import {
  findClassNameRegions,
  tokenizeClassValue,
} from "./documentUtils.js";
import { parseMotionClasses } from "../shared/parser.js";
import { GESTURE_KEYS } from "../shared/constants.js";

/** Tailwind's built-in animate-* classes — don't flag these */
const TAILWIND_ANIMATE_CLASSES = new Set([
  "animate-spin",
  "animate-pulse",
  "animate-ping",
  "animate-bounce",
  "animate-none",
]);

/**
 * Validate all animate-* tokens in the document and return diagnostics.
 */
export function computeDiagnostics(
  document: TextDocument,
  classAttributes: string[],
): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  const regions = findClassNameRegions(document, classAttributes);

  for (const region of regions) {
    const tokens = tokenizeClassValue(document, region.value, region.range.start);

    for (const token of tokens) {
      if (!token.value.startsWith("animate-")) continue;

      // Skip Tailwind built-in animate classes
      if (TAILWIND_ANIMATE_CLASSES.has(token.value)) continue;

      const result = parseMotionClasses(token.value);

      if (!result.hasMotion) {
        // Check if it has an unknown gesture prefix
        const rest = token.value.slice(8);
        const colonIdx = rest.indexOf(":");

        if (colonIdx !== -1) {
          const gesturePrefix = rest.slice(0, colonIdx);
          if (!GESTURE_KEYS.has(gesturePrefix)) {
            diagnostics.push({
              severity: DiagnosticSeverity.Error,
              range: token.range,
              message: `Unknown gesture prefix "${gesturePrefix}". Valid prefixes: hover, tap, focus, inview, drag, initial, enter, exit`,
              source: "motionwind",
            });
            continue;
          }
        }

        diagnostics.push({
          severity: DiagnosticSeverity.Warning,
          range: token.range,
          message: `Invalid motionwind class "${token.value}". Could not parse any motion properties.`,
          source: "motionwind",
        });
      }
    }
  }

  return diagnostics;
}
