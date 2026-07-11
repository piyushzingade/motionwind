import { parse } from "@babel/parser";
import * as babelTraverse from "@babel/traverse";
import * as babelGenerate from "@babel/generator";
import * as t from "@babel/types";
import {
  serializeGesture,
  serializeTransition,
  serializeViewport,
} from "./serialize.js";

// ESM/CJS interop for the default-exported Babel helpers. Depending on the
// loader (Node, bun, bundlers), the callable can be nested one or two `.default`
// levels deep, so unwrap until we reach the function.
function resolveDefault<T>(mod: unknown): T {
  let m = mod as { default?: unknown };
  while (m && typeof m !== "function" && typeof m.default !== "undefined") {
    m = m.default as { default?: unknown };
  }
  return m as T;
}
const traverse = resolveDefault<typeof import("@babel/traverse").default>(babelTraverse);
const generate = resolveDefault<typeof import("@babel/generator").default>(babelGenerate);

const GESTURE_ATTRS = new Set([
  "whileHover",
  "whileTap",
  "whileFocus",
  "whileInView",
  "whileDrag",
  "initial",
  "animate",
  "exit",
]);
const DRAG_ATTRS = new Set([
  "drag",
  "dragElastic",
  "dragSnapToOrigin",
  "dragMomentum",
  "dragDirectionLock",
  "dragConstraints",
]);
const LAYOUT_ATTRS = new Set(["layout", "layoutId", "layoutScroll", "layoutRoot"]);

// Motion-only props we can't express as classes — their presence blocks conversion.
const UNSUPPORTED = new Set([
  "variants",
  "custom",
  "transformTemplate",
  "transformValues",
  "layoutDependency",
  "onAnimationStart",
  "onAnimationComplete",
  "onUpdate",
  "onHoverStart",
  "onHoverEnd",
  "onTap",
  "onTapStart",
  "onTapCancel",
  "onDrag",
  "onDragStart",
  "onDragEnd",
  "onViewportEnter",
  "onViewportLeave",
]);

export interface MigrateResult {
  code: string;
  converted: number;
  skipped: number;
  changed: boolean;
}

/** Extract a literal JS value from an expression node, or { ok: false }. */
function literal(node: t.Node | null | undefined): { ok: boolean; value?: unknown } {
  if (!node) return { ok: true, value: true }; // bare attribute → true
  if (t.isStringLiteral(node) || t.isNumericLiteral(node) || t.isBooleanLiteral(node))
    return { ok: true, value: node.value };
  if (t.isNullLiteral(node)) return { ok: true, value: null };
  if (t.isIdentifier(node) && node.name === "Infinity")
    return { ok: true, value: Infinity };
  if (t.isUnaryExpression(node) && node.operator === "-") {
    const inner = literal(node.argument);
    if (inner.ok && typeof inner.value === "number")
      return { ok: true, value: -inner.value };
    return { ok: false };
  }
  if (t.isObjectExpression(node)) {
    const obj: Record<string, unknown> = {};
    for (const prop of node.properties) {
      if (!t.isObjectProperty(prop) || prop.computed) return { ok: false };
      const key = t.isIdentifier(prop.key)
        ? prop.key.name
        : t.isStringLiteral(prop.key)
          ? prop.key.value
          : null;
      if (key === null) return { ok: false };
      const val = literal(prop.value as t.Node);
      if (!val.ok) return { ok: false };
      obj[key] = val.value;
    }
    return { ok: true, value: obj };
  }
  if (t.isArrayExpression(node)) {
    const arr: unknown[] = [];
    for (const el of node.elements) {
      if (el === null) return { ok: false };
      const val = literal(el as t.Node);
      if (!val.ok) return { ok: false };
      arr.push(val.value);
    }
    return { ok: true, value: arr };
  }
  return { ok: false };
}

/** The literal value behind a JSX attribute (unwrapping expression containers). */
function attrValue(attr: t.JSXAttribute): { ok: boolean; value?: unknown } {
  if (attr.value === null) return { ok: true, value: true };
  if (t.isStringLiteral(attr.value)) return { ok: true, value: attr.value.value };
  if (t.isJSXExpressionContainer(attr.value)) {
    if (t.isJSXEmptyExpression(attr.value.expression)) return { ok: false };
    return literal(attr.value.expression);
  }
  return { ok: false };
}

function dragTokens(name: string, value: unknown): string[] | null {
  const r = (n: number) => Math.round(n * 1e6) / 1e6;
  switch (name) {
    case "drag":
      if (value === true) return ["animate-drag-both"];
      if (value === "x") return ["animate-drag-x"];
      if (value === "y") return ["animate-drag-y"];
      return null;
    case "dragElastic":
      return typeof value === "number" ? [`animate-drag-elastic-${r(value * 100)}`] : null;
    case "dragSnapToOrigin":
      return value === true ? ["animate-drag-snap"] : null;
    case "dragMomentum":
      return value === false ? ["animate-drag-no-momentum"] : null;
    case "dragDirectionLock":
      return value === true ? ["animate-drag-lock"] : null;
    case "dragConstraints": {
      if (typeof value !== "object" || value === null) return null;
      const sides: Record<string, string> = { top: "t", left: "l", right: "r", bottom: "b" };
      const out: string[] = [];
      for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
        if (!sides[k] || typeof v !== "number") return null;
        out.push(`animate-drag-constraint-${sides[k]}-${v}`);
      }
      return out;
    }
    default:
      return null;
  }
}

function layoutTokens(name: string, value: unknown): string[] | null {
  switch (name) {
    case "layout":
      if (value === true) return ["animate-layout"];
      if (value === "position") return ["animate-layout-position"];
      if (value === "size") return ["animate-layout-size"];
      if (value === "preserve-aspect") return ["animate-layout-preserve"];
      return null;
    case "layoutId":
      return typeof value === "string" ? [`animate-layout-id-${value}`] : null;
    case "layoutScroll":
      return value === true ? ["animate-layout-scroll"] : null;
    case "layoutRoot":
      return value === true ? ["animate-layout-root"] : null;
    default:
      return null;
  }
}

/** Rewrite `<motion.tag …>` elements into plain tags + animate-* classes. */
export function migrateSource(code: string): MigrateResult {
  const ast = parse(code, {
    sourceType: "module",
    plugins: ["jsx", "typescript"],
  });

  let converted = 0;
  let skipped = 0;

  traverse(ast, {
    JSXElement(path) {
      const opening = path.node.openingElement;
      const name = opening.name;
      // Only <motion.X> member elements.
      if (
        !t.isJSXMemberExpression(name) ||
        !t.isJSXIdentifier(name.object) ||
        name.object.name !== "motion" ||
        !t.isJSXIdentifier(name.property)
      ) {
        return;
      }
      const tag = name.property.name;

      // Bail if any spread or unsupported motion-only prop is present.
      const tokens: string[] = [];
      const toRemove = new Set<t.JSXAttribute>();
      let classNameAttr: t.JSXAttribute | undefined;
      let existingClass = "";
      let convertible = true;

      for (const attr of opening.attributes) {
        if (t.isJSXSpreadAttribute(attr)) {
          convertible = false;
          break;
        }
        if (!t.isJSXAttribute(attr) || !t.isJSXIdentifier(attr.name)) continue;
        const attrName = attr.name.name;

        if (UNSUPPORTED.has(attrName)) {
          convertible = false;
          break;
        }

        if (attrName === "className") {
          classNameAttr = attr;
          if (attr.value && t.isStringLiteral(attr.value)) {
            existingClass = attr.value.value;
          } else if (attr.value) {
            // dynamic className — can't safely merge tokens
            convertible = false;
            break;
          }
          continue;
        }

        if (GESTURE_ATTRS.has(attrName)) {
          const v = attrValue(attr);
          if (!v.ok || typeof v.value !== "object" || v.value === null) {
            convertible = false;
            break;
          }
          const g = serializeGesture(attrName, v.value as Record<string, unknown>);
          if (!g) {
            convertible = false;
            break;
          }
          tokens.push(...g);
          toRemove.add(attr);
        } else if (attrName === "transition") {
          const v = attrValue(attr);
          if (!v.ok || typeof v.value !== "object" || v.value === null) {
            convertible = false;
            break;
          }
          const tr = serializeTransition(v.value as Record<string, unknown>);
          if (!tr) {
            convertible = false;
            break;
          }
          tokens.push(...tr);
          toRemove.add(attr);
        } else if (attrName === "viewport") {
          const v = attrValue(attr);
          if (!v.ok || typeof v.value !== "object" || v.value === null) {
            convertible = false;
            break;
          }
          const vp = serializeViewport(v.value as Record<string, unknown>);
          if (!vp) {
            convertible = false;
            break;
          }
          tokens.push(...vp);
          toRemove.add(attr);
        } else if (DRAG_ATTRS.has(attrName)) {
          const v = attrValue(attr);
          const d = v.ok ? dragTokens(attrName, v.value) : null;
          if (!d) {
            convertible = false;
            break;
          }
          tokens.push(...d);
          toRemove.add(attr);
        } else if (LAYOUT_ATTRS.has(attrName)) {
          const v = attrValue(attr);
          const l = v.ok ? layoutTokens(attrName, v.value) : null;
          if (!l) {
            convertible = false;
            break;
          }
          tokens.push(...l);
          toRemove.add(attr);
        }
        // Any other attribute (id, style, onClick, data-*, …) passes through.
      }

      if (!convertible) {
        skipped++;
        return;
      }

      // Rename <motion.tag> → <tag> on both opening and closing elements.
      opening.name = t.jsxIdentifier(tag);
      if (path.node.closingElement) {
        path.node.closingElement.name = t.jsxIdentifier(tag);
      }

      // Remove converted attributes.
      opening.attributes = opening.attributes.filter(
        (a) => !(t.isJSXAttribute(a) && toRemove.has(a)),
      );

      // Merge classes.
      const merged = [existingClass, ...tokens].filter(Boolean).join(" ");
      if (merged) {
        if (classNameAttr) {
          classNameAttr.value = t.stringLiteral(merged);
        } else {
          opening.attributes.unshift(
            t.jsxAttribute(t.jsxIdentifier("className"), t.stringLiteral(merged)),
          );
        }
      }

      converted++;
    },
  });

  // Remove the now-unused `motion` import if nothing references it anymore.
  if (converted > 0) removeUnusedMotionImport(ast);

  const output = generate(ast, { retainLines: false }, code);
  return {
    code: output.code,
    converted,
    skipped,
    changed: converted > 0,
  };
}

/** Drop `import { motion } from "motion/react"` when motion is no longer used. */
function removeUnusedMotionImport(ast: t.File): void {
  let motionUsed = false;
  traverse(ast, {
    Identifier(path) {
      if (path.node.name !== "motion") return;
      // Ignore the import specifier itself.
      if (path.parent && t.isImportSpecifier(path.parent)) return;
      if (path.parent && t.isImportDefaultSpecifier(path.parent)) return;
      motionUsed = true;
    },
    JSXIdentifier(path) {
      if (path.node.name === "motion") motionUsed = true;
    },
  });
  if (motionUsed) return;

  traverse(ast, {
    ImportDeclaration(path) {
      const src = path.node.source.value;
      if (src !== "motion/react" && src !== "framer-motion") return;
      path.node.specifiers = path.node.specifiers.filter(
        (s) =>
          !(
            t.isImportSpecifier(s) &&
            t.isIdentifier(s.imported) &&
            s.imported.name === "motion"
          ),
      );
      if (path.node.specifiers.length === 0) path.remove();
    },
  });
}
