import {
  CompletionItemKind,
  InsertTextFormat,
  MarkupKind,
  type CompletionItem,
} from "vscode-languageserver/node.js";
import {
  CONFIG_DEFINITIONS,
  GESTURE_DEFINITIONS,
  PROPERTY_DEFINITIONS,
  type SyntaxDefinition,
} from "motionwind-core";

function completion(
  definition: SyntaxDefinition,
  kind: CompletionItemKind,
): CompletionItem {
  return {
    label: definition.label,
    kind,
    insertText: definition.snippet,
    insertTextFormat: definition.snippet.includes("${")
      ? InsertTextFormat.Snippet
      : InsertTextFormat.PlainText,
    detail: definition.motionKey ?? definition.category,
    documentation: {
      kind: MarkupKind.Markdown,
      value: `${definition.description}\n\n**Category:** ${definition.category}`,
    },
  };
}

export const gestureCompletions: CompletionItem[] = GESTURE_DEFINITIONS.map(
  (definition) => completion(definition, CompletionItemKind.Enum),
);

export const propertyCompletions: CompletionItem[] = PROPERTY_DEFINITIONS.map(
  (definition) => completion(definition, CompletionItemKind.Property),
);

export const transitionCompletions: CompletionItem[] =
  CONFIG_DEFINITIONS.filter(({ category }) => category === "transition").map(
    (definition) => completion(definition, CompletionItemKind.Value),
  );

export const viewportCompletions: CompletionItem[] = CONFIG_DEFINITIONS.filter(
  ({ category }) => category === "viewport",
).map((definition) => completion(definition, CompletionItemKind.Value));

export const dragCompletions: CompletionItem[] = CONFIG_DEFINITIONS.filter(
  ({ category }) => category === "drag",
).map((definition) => completion(definition, CompletionItemKind.Value));

export const layoutCompletions: CompletionItem[] = CONFIG_DEFINITIONS.filter(
  ({ category }) => category === "layout",
).map((definition) => completion(definition, CompletionItemKind.Value));

export const allConfigCompletions: CompletionItem[] = CONFIG_DEFINITIONS.map(
  (definition) => completion(definition, CompletionItemKind.Value),
);
