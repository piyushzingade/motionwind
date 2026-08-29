import type { ReactNode } from "react";

/**
 * Lightweight regex-based JSX/motionwind syntax highlighter. Shared by the
 * landing page demos and the /play playground.
 *
 * Keys are the absolute character offset of each token within `code`. Because
 * the input is a fixed string, that offset is a stable, unique id per token —
 * the list never reorders, so this is a real id rather than a positional index.
 */
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
          <span className="code-comment">{line}</span>
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

    while (remaining.length > 0) {
      // animate-* classes (acid green, bold)
      const animateMatch = remaining.match(/^(animate-[\w:.\-[\],]+)/);
      if (animateMatch) {
        const len = animateMatch[1]!.length;
        result.push(
          <span key={pos} className="text-acid font-semibold">
            {animateMatch[1]}
          </span>,
        );
        remaining = remaining.slice(len);
        pos += len;
        continue;
      }

      // JSX tags: <tag or </tag or <Tag
      const tagMatch = remaining.match(/^(<\/?)([\w.]+)/);
      if (tagMatch) {
        result.push(
          <span key={pos} className="code-dim">
            {tagMatch[1]}
          </span>,
        );
        result.push(
          <span key={pos + tagMatch[1]!.length} className="syntax-tag">
            {tagMatch[2]}
          </span>,
        );
        remaining = remaining.slice(tagMatch[0].length);
        pos += tagMatch[0].length;
        continue;
      }

      // Closing >
      const closeMatch = remaining.match(/^(\/?>)/);
      if (closeMatch) {
        const len = closeMatch[1]!.length;
        result.push(
          <span key={pos} className="code-dim">
            {closeMatch[1]}
          </span>,
        );
        remaining = remaining.slice(len);
        pos += len;
        continue;
      }

      // Strings (double-quoted)
      const strMatch = remaining.match(/^"([^"]*)"/);
      if (strMatch) {
        result.push(
          <span key={pos} className="syntax-string">
            {`"${strMatch[1]}"`}
          </span>,
        );
        remaining = remaining.slice(strMatch[0].length);
        pos += strMatch[0].length;
        continue;
      }

      // Template literal markers
      const tmplMatch = remaining.match(/^(`|\$\{|\})/);
      if (tmplMatch) {
        const len = tmplMatch[1]!.length;
        result.push(
          <span key={pos} className="syntax-string">
            {tmplMatch[1]}
          </span>,
        );
        remaining = remaining.slice(len);
        pos += len;
        continue;
      }

      // Keywords
      const kwMatch = remaining.match(
        /^(import|from|export|default|const|let|function|return|className)\b/,
      );
      if (kwMatch) {
        const len = kwMatch[1]!.length;
        result.push(
          <span key={pos} className="text-acid/80">
            {kwMatch[1]}
          </span>,
        );
        remaining = remaining.slice(len);
        pos += len;
        continue;
      }

      // Braces / parens / operators
      const punctMatch = remaining.match(/^([{}()=:;,?])/);
      if (punctMatch) {
        result.push(
          <span key={pos} className="code-dim">
            {punctMatch[1]}
          </span>,
        );
        remaining = remaining.slice(1);
        pos += 1;
        continue;
      }

      // Tailwind / plain classes inside className (dimmed)
      const twMatch = remaining.match(
        /^(rounded-[\w-]+|bg-[\w/.-]+|px-\d+|py-\d+|p-\d+|w-[\w-]+|h-[\w-]+|text-[\w-]+)/,
      );
      if (twMatch) {
        const len = twMatch[1]!.length;
        result.push(
          <span key={pos} className="code-dim">
            {twMatch[1]}
          </span>,
        );
        remaining = remaining.slice(len);
        pos += len;
        continue;
      }

      // Default character
      result.push(
        <span key={pos} className="code-fg">
          {remaining[0]}
        </span>,
      );
      remaining = remaining.slice(1);
      pos += 1;
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
