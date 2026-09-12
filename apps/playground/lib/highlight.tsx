import type { ReactNode } from "react";

/**
 * Regex-based JSX/motionwind syntax highlighter for the playground studio.
 * Emits `pg-tok-*` token classes (defined in app/globals.css, light + dark).
 *
 * Keys are the absolute character offset of each token within `code`. Because
 * the input is a fixed string, that offset is a stable, unique id per token —
 * the list never reorders, so this is a real id rather than a positional index.
 */

const MOTION_KEYWORDS = new Set([
  "import",
  "from",
  "export",
  "default",
  "const",
  "let",
  "function",
  "return",
  // Motion lifecycle + config props
  "whileHover",
  "whileTap",
  "whileFocus",
  "whileInView",
  "whileDrag",
  "initial",
  "animate",
  "exit",
  "transition",
  "viewport",
  "variants",
  "drag",
  "dragElastic",
  "dragSnapToOrigin",
  "dragMomentum",
  "dragDirectionLock",
  "dragConstraints",
  "layout",
  "layoutId",
  "layoutScroll",
  "layoutRoot",
  "staggerChildren",
  "staggerDirection",
  "delayChildren",
  "when",
  "repeat",
  "repeatType",
  "repeatDelay",
  "ease",
  "duration",
  "delay",
  "stiffness",
  "damping",
  "bounce",
  "mass",
  "times",
  "amount",
  "once",
  "axis",
  "container",
  "offset",
  "type",
  "as",
]);

const PROP_NAMES = new Set([
  "className",
  "style",
  "children",
  "key",
  "ref",
  "observe",
]);

const BOOLEAN_RE = /^(true|false|null|undefined)\b/;
const NUMBER_RE = /^\d+\.?\d*/;
const STRING_RE = /^("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/;
const TAG_RE = /^(<\/?)([A-Za-z][\w.]*)/;
const ANIMATE_RE = /^(animate-[\w:.\-[\],]+)/;
const WORD_RE = /^[A-Za-z_$][\w$]*/;
const TAILWIND_RE =
  /^(rounded-[\w-]+|bg-[\w/.-]+|px-\d+|py-\d+|p-\d+|w-[\w-]+|h-[\w-]+|text-[\w-]+)/;

export function highlightCode(code: string): ReactNode[] {
  const lines = code.split("\n");
  const out: ReactNode[] = [];
  let abs = 0; // absolute char offset of the current line within `code`

  for (const line of lines) {
    const lineKey = abs;

    // Comments
    if (line.trimStart().startsWith("//")) {
      out.push(
        <span key={lineKey}>
          <span className="pg-tok-comment">{line}</span>
          {"\n"}
        </span>,
      );
      abs += line.length + 1; // +1 for the split "\n"
      continue;
    }

    // Process the line character by character for proper highlighting
    const result: ReactNode[] = [];
    let remaining = line;
    let pos = abs; // absolute offset of the next unconsumed char

    const push = (className: string, value: string) => {
      result.push(
        <span key={pos} className={className}>
          {value}
        </span>,
      );
      remaining = remaining.slice(value.length);
      pos += value.length;
    };

    while (remaining.length > 0) {
      // animate-* classes (accent, bold)
      const animateMatch = remaining.match(ANIMATE_RE);
      if (animateMatch) {
        push("pg-tok-animate", animateMatch[1]!);
        continue;
      }

      // JSX tags: <tag, </tag, <Tag, <motion.tag, <mw.View
      const tagMatch = remaining.match(TAG_RE);
      if (tagMatch) {
        push("pg-tok-punct", tagMatch[1]!);
        const name = tagMatch[2]!;
        const isComponent =
          name[0] === name[0]!.toUpperCase() || name.includes(".");
        push(isComponent ? "pg-tok-component" : "pg-tok-tag", name);
        continue;
      }

      // Closing /> or >
      if (remaining[0] === "/" && remaining[1] === ">") {
        push("pg-tok-punct", "/>");
        continue;
      }
      if (remaining[0] === ">") {
        push("pg-tok-punct", ">");
        continue;
      }

      // Strings (single- or double-quoted)
      const strMatch = remaining.match(STRING_RE);
      if (strMatch) {
        push("pg-tok-string", strMatch[1]!);
        continue;
      }

      // Template literal markers
      const tmplMatch = remaining.match(/^(`|\$\{|\})/);
      if (tmplMatch) {
        push("pg-tok-string", tmplMatch[1]!);
        continue;
      }

      // Numbers
      const numMatch = remaining.match(NUMBER_RE);
      if (numMatch) {
        push("pg-tok-number", numMatch[0]!);
        continue;
      }

      // Words: booleans, motion keywords, props
      const wordMatch = remaining.match(WORD_RE);
      if (wordMatch) {
        const word = wordMatch[0]!;
        if (BOOLEAN_RE.test(word)) push("pg-tok-bool", word);
        else if (MOTION_KEYWORDS.has(word)) push("pg-tok-keyword", word);
        else if (PROP_NAMES.has(word)) push("pg-tok-prop", word);
        else push("pg-tok-plain", word);
        continue;
      }

      // Tailwind / plain classes inside className (dimmed)
      const twMatch = remaining.match(TAILWIND_RE);
      if (twMatch) {
        push("pg-tok-plain", twMatch[1]!);
        continue;
      }

      // Punctuation
      if (/^[{}()=:;,?.[\]]/.test(remaining)) {
        push("pg-tok-punct", remaining[0]!);
        continue;
      }

      // Default character
      push("pg-tok-plain", remaining[0]!);
    }

    out.push(
      <span key={lineKey}>
        {result}
        {"\n"}
      </span>,
    );
    abs += line.length + 1; // +1 for the split "\n"
  }

  return out;
}
