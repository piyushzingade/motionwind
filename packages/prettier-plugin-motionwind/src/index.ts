import type { Parser } from "prettier";
import { parsers as babelParsers } from "prettier/plugins/babel";
import { parsers as typescriptParsers } from "prettier/plugins/typescript";
import { sortMotionClasses } from "motionwind-core";

// AST keys that hold position/comment metadata or create cycles — skip them.
const SKIP_KEYS = new Set([
  "loc",
  "start",
  "end",
  "range",
  "comments",
  "leadingComments",
  "trailingComments",
  "innerComments",
  "tokens",
  "parent",
]);

function setSorted(node: any, original: string): void {
  if (!original.includes("animate-")) return;
  const sorted = sortMotionClasses(original);
  if (sorted === original) return;
  node.value = sorted;
  // Re-quote the cached raw text (estree `.raw`, babel `.extra.raw`) using the
  // original quote character — the printer reads raw and would choke on null.
  // classNames never contain quote chars, so simple re-quoting is safe.
  if (typeof node.raw === "string" && node.raw.length >= 2) {
    const q = node.raw[0];
    node.raw = q + sorted + q;
  }
  if (
    node.extra &&
    typeof node.extra.raw === "string" &&
    node.extra.raw.length >= 2
  ) {
    const q = node.extra.raw[0];
    node.extra.raw = q + sorted + q;
    node.extra.rawValue = sorted;
  }
}

function sortAttributeValue(value: any): void {
  if (!value || typeof value.value !== "string") return;
  // babel → "StringLiteral"; typescript/estree → "Literal".
  if (value.type === "StringLiteral" || value.type === "Literal") {
    setSorted(value, value.value);
  }
}

function walk(node: any, seen: WeakSet<object>): void {
  if (!node || typeof node !== "object") return;
  if (seen.has(node)) return;
  seen.add(node);

  if (Array.isArray(node)) {
    for (const item of node) walk(item, seen);
    return;
  }

  if (node.type === "JSXAttribute" && node.name?.name === "className") {
    sortAttributeValue(node.value);
  }

  for (const key in node) {
    if (SKIP_KEYS.has(key)) continue;
    const child = node[key];
    if (child && typeof child === "object") walk(child, seen);
  }
}

function withSort(parser: Parser): Parser {
  return {
    ...parser,
    async parse(...args: unknown[]) {
      const ast = await (parser.parse as any)(...args);
      walk(ast, new WeakSet());
      return ast;
    },
  };
}

export const parsers: Record<string, Parser> = {
  babel: withSort((babelParsers as Record<string, Parser>).babel!),
  "babel-ts": withSort((babelParsers as Record<string, Parser>)["babel-ts"]!),
  typescript: withSort(
    (typescriptParsers as Record<string, Parser>).typescript!,
  ),
};
