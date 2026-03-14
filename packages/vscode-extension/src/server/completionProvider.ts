import {
  CompletionItem,
  CompletionList,
  CompletionParams,
  InsertTextFormat,
} from "vscode-languageserver/node.js";
import { TextDocument } from "vscode-languageserver-textdocument";
import { getCursorContext } from "./documentUtils.js";
import {
  gestureCompletions,
  propertyCompletions,
  allConfigCompletions,
} from "./completionData.js";

/**
 * Handle completion requests. Three modes:
 * 1. No colon typed yet → offer gesture prefixes + config keywords
 * 2. After `animate-{gesture}:` → offer animatable property completions
 * 3. Partial match → filter by prefix
 */
export function handleCompletion(
  params: CompletionParams,
  document: TextDocument,
  classAttributes: string[],
): CompletionList | null {
  const ctx = getCursorContext(document, params.position, classAttributes);
  if (!ctx.inRegion) return null;

  const prefix = ctx.prefix;

  // Mode 2: After gesture prefix colon — e.g., "animate-hover:" or "animate-hover:sca"
  const gestureColonMatch = prefix.match(/^animate-(\w+):(.*)$/);
  if (gestureColonMatch) {
    const propertyPrefix = gestureColonMatch[2]!;
    const gesturePrefix = gestureColonMatch[1]!;

    // Return property completions, adjusting insertText to include the full class
    const items: CompletionItem[] = propertyCompletions
      .filter((item) => {
        const label = item.label as string;
        return label.startsWith(propertyPrefix) || propertyPrefix === "";
      })
      .map((item, index) => {
        const label = item.label as string;
        return {
          ...item,
          label: `${label}`,
          insertText: item.insertText
            ? `animate-${gesturePrefix}:${item.insertText}`
            : undefined,
          filterText: `animate-${gesturePrefix}:${label}`,
          sortText: String(index).padStart(3, "0"),
          textEdit: undefined,
        };
      });

    return CompletionList.create(items, false);
  }

  // Mode 1: Typing "animate-" or partial — offer gestures + config
  if (prefix === "" || prefix.startsWith("animate-") || "animate-".startsWith(prefix)) {
    const items: CompletionItem[] = [];

    // Add gesture completions
    for (let i = 0; i < gestureCompletions.length; i++) {
      items.push({
        ...gestureCompletions[i]!,
        sortText: `0${String(i).padStart(3, "0")}`,
      });
    }

    // Add config completions
    for (let i = 0; i < allConfigCompletions.length; i++) {
      items.push({
        ...allConfigCompletions[i]!,
        sortText: `1${String(i).padStart(3, "0")}`,
      });
    }

    return CompletionList.create(items, false);
  }

  return null;
}
