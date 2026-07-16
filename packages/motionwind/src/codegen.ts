import { parseMotionClasses, type MotionwindConfig } from "motionwind-core";
import type { ParsedResult } from "motionwind-core";

export interface GenerateOptions {
  /** Child text to render inside the element (defaults to a placeholder). */
  text?: string;
  /** Indentation unit for nested props. Defaults to two spaces. */
  indent?: string;
  /** Optional project config used for named tokens and presets. */
  config?: MotionwindConfig;
  /** Output surface. Defaults to React's compiled Motion JSX. */
  target?: "react" | "vue" | "javascript" | "react-native";
}

const IDENT_RE = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

function key(k: string): string {
  return IDENT_RE.test(k) ? k : JSON.stringify(k);
}

function serializeValue(v: unknown): string {
  if (Array.isArray(v)) return `[${v.map(serializeValue).join(", ")}]`;
  if (v === Infinity) return "Infinity";
  if (typeof v === "string") return JSON.stringify(v);
  if (typeof v === "object" && v !== null)
    return serializeObject(v as Record<string, unknown>);
  return String(v);
}

function serializeObject(obj: Record<string, unknown>): string {
  const entries = Object.entries(obj).map(
    ([k, v]) => `${key(k)}: ${serializeValue(v)}`,
  );
  return entries.length ? `{ ${entries.join(", ")} }` : "{}";
}

/**
 * Generate the `motion.*` JSX a className compiles to — mirroring the Babel
 * transform's output shape. Scroll-linked classes render as the `mw.*` runtime
 * (matching how Babel routes them). Used by the Playground and docs to show
 * "what this compiles to".
 */
export function generateMotionCode(
  tag: string,
  className: string,
  opts: GenerateOptions = {},
): string {
  const text = opts.text ?? `Content`;
  const indent = opts.indent ?? "  ";
  const parsed: ParsedResult = parseMotionClasses(className, opts.config);
  const target = opts.target ?? "react";

  if (target === "vue") {
    return (
      `<script setup>\nimport { Motionwind } from "motionwind-vue";\n</script>\n\n` +
      `<template>\n${indent}<Motionwind as="${tag}" class="${className}">${text}</Motionwind>\n</template>`
    );
  }

  if (target === "javascript") {
    return (
      `import { motionwind } from "motionwind-vanilla";\n\n` +
      `document.body.innerHTML = \`<${tag} class="${className}">${text}</${tag}>\`;\n` +
      `const cleanup = motionwind({ observe: true });\n\n` +
      `// Call cleanup() when this view is removed.`
    );
  }

  if (target === "react-native") {
    const nativeTag: Record<string, string> = {
      button: "Pressable",
      span: "Text",
      img: "Image",
      a: "Pressable",
    };
    const component = nativeTag[tag] ?? "View";
    return (
      `import { mw } from "motionwind-react-native";\n\n` +
      `<mw.${component} className="${className}">\n${indent}${text}\n</mw.${component}>`
    );
  }

  if (!parsed.hasMotion) {
    return `<${tag} className="${className}">${text}</${tag}>`;
  }

  const isScroll = Object.keys(parsed.scroll.values).length > 0;
  const isComponent = /^[A-Z]/.test(tag);

  // Scroll-linked → runtime mw.* component, className kept intact.
  if (isScroll) {
    return (
      `// scroll-linked → rendered by the mw.* runtime\n` +
      `<mw.${tag} className="${className}">\n${indent}${text}\n</mw.${tag}>`
    );
  }

  const attrs: string[] = [`data-motionwind-motion=""`];
  if (parsed.tailwindClasses)
    attrs.push(`className="${parsed.tailwindClasses}"`);

  for (const [gestureKey, vals] of Object.entries(parsed.gestures)) {
    if (
      (gestureKey === "initial" && parsed.variantState.initial) ||
      (gestureKey === "animate" && parsed.variantState.animate) ||
      (gestureKey === "exit" && parsed.variantState.exit)
    ) {
      continue;
    }
    attrs.push(
      `${gestureKey}={${serializeObject(vals as Record<string, unknown>)}}`,
    );
  }

  if (Object.keys(parsed.transition).length) {
    attrs.push(
      `transition={${serializeObject(parsed.transition as Record<string, unknown>)}}`,
    );
  }
  if (Object.keys(parsed.viewport).length) {
    attrs.push(
      `viewport={${serializeObject(parsed.viewport as Record<string, unknown>)}}`,
    );
  }

  // Drag
  if (parsed.dragConfig.drag === true) attrs.push(`drag`);
  else if (parsed.dragConfig.drag)
    attrs.push(`drag="${parsed.dragConfig.drag}"`);
  if (parsed.dragConfig.dragElastic !== undefined)
    attrs.push(`dragElastic={${parsed.dragConfig.dragElastic}}`);
  if (parsed.dragConfig.dragSnapToOrigin) attrs.push(`dragSnapToOrigin`);
  if (parsed.dragConfig.dragMomentum === false)
    attrs.push(`dragMomentum={false}`);
  if (parsed.dragConfig.dragDirectionLock) attrs.push(`dragDirectionLock`);
  if (parsed.dragConfig.dragConstraints)
    attrs.push(
      `dragConstraints={${serializeObject(parsed.dragConfig.dragConstraints)}}`,
    );

  // Layout
  if (parsed.layoutConfig.layout === true) attrs.push(`layout`);
  else if (parsed.layoutConfig.layout)
    attrs.push(`layout="${parsed.layoutConfig.layout}"`);
  if (parsed.layoutConfig.layoutId)
    attrs.push(`layoutId="${parsed.layoutConfig.layoutId}"`);
  if (parsed.layoutConfig.layoutScroll) attrs.push(`layoutScroll`);
  if (parsed.layoutConfig.layoutRoot) attrs.push(`layoutRoot`);

  // Variants
  if (Object.keys(parsed.variants).length)
    attrs.push(
      `variants={${serializeObject(parsed.variants as Record<string, unknown>)}}`,
    );
  if (parsed.variantState.initial)
    attrs.push(`initial="${parsed.variantState.initial}"`);
  if (parsed.variantState.animate)
    attrs.push(`animate="${parsed.variantState.animate}"`);
  if (parsed.variantState.exit)
    attrs.push(`exit="${parsed.variantState.exit}"`);

  const el = isComponent ? `motion.create(${tag})` : `motion.${tag}`;
  const openTag = isComponent ? `_mw_${tag}` : `motion.${tag}`;
  const header = isComponent ? `const _mw_${tag} = ${el};\n\n` : "";
  const attrsBlock = attrs.length
    ? `\n${attrs.map((a) => indent + a).join("\n")}\n`
    : "";

  return `${header}<${openTag}${attrsBlock}>${attrsBlock ? indent : ""}${text}\n</${openTag}>`;
}
