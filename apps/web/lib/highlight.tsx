import type { ReactNode } from "react";

/**
 * Lightweight regex-based JSX/motionwind syntax highlighter. Shared by the
 * landing page demos and the /play playground.
 */
export function highlightCode(code: string): ReactNode[] {
  const lines = code.split("\n");
  return lines.map((line, i) => {
    // Comments
    if (line.trimStart().startsWith("//")) {
      return (
        <span key={i}>
          <span className="text-white/25">{line}</span>
          {"\n"}
        </span>
      );
    }

    // Process the line character by character for proper highlighting
    const result: ReactNode[] = [];
    let remaining = line;
    let keyIdx = 0;

    while (remaining.length > 0) {
      // animate-* classes (acid green, bold)
      const animateMatch = remaining.match(/^(animate-[\w:.\-[\],]+)/);
      if (animateMatch) {
        result.push(
          <span key={`${i}-${keyIdx++}`} className="text-acid font-semibold">
            {animateMatch[1]}
          </span>
        );
        remaining = remaining.slice(animateMatch[1]!.length);
        continue;
      }

      // JSX tags: <tag or </tag or <Tag
      const tagMatch = remaining.match(/^(<\/?)([\w.]+)/);
      if (tagMatch) {
        result.push(
          <span key={`${i}-${keyIdx++}`} className="text-white/30">
            {tagMatch[1]}
          </span>
        );
        result.push(
          <span key={`${i}-${keyIdx++}`} className="text-pink-400">
            {tagMatch[2]}
          </span>
        );
        remaining = remaining.slice(tagMatch[0].length);
        continue;
      }

      // Closing >
      const closeMatch = remaining.match(/^(\/?>)/);
      if (closeMatch) {
        result.push(
          <span key={`${i}-${keyIdx++}`} className="text-white/30">
            {closeMatch[1]}
          </span>
        );
        remaining = remaining.slice(closeMatch[1]!.length);
        continue;
      }

      // Strings (double-quoted)
      const strMatch = remaining.match(/^"([^"]*)"/);
      if (strMatch) {
        result.push(
          <span key={`${i}-${keyIdx++}`} className="text-amber-300">
            {`"${strMatch[1]}"`}
          </span>
        );
        remaining = remaining.slice(strMatch[0].length);
        continue;
      }

      // Template literal markers
      const tmplMatch = remaining.match(/^(`|\$\{|\})/);
      if (tmplMatch) {
        result.push(
          <span key={`${i}-${keyIdx++}`} className="text-amber-300">
            {tmplMatch[1]}
          </span>
        );
        remaining = remaining.slice(tmplMatch[1]!.length);
        continue;
      }

      // Keywords
      const kwMatch = remaining.match(
        /^(import|from|export|default|const|let|function|return|className)\b/
      );
      if (kwMatch) {
        result.push(
          <span key={`${i}-${keyIdx++}`} className="text-acid/80">
            {kwMatch[1]}
          </span>
        );
        remaining = remaining.slice(kwMatch[1]!.length);
        continue;
      }

      // Braces / parens / operators
      const punctMatch = remaining.match(/^([{}()=:;,?])/);
      if (punctMatch) {
        result.push(
          <span key={`${i}-${keyIdx++}`} className="text-white/30">
            {punctMatch[1]}
          </span>
        );
        remaining = remaining.slice(1);
        continue;
      }

      // Tailwind / plain classes inside className (dimmed)
      const twMatch = remaining.match(
        /^(rounded-[\w-]+|bg-[\w/.-]+|px-\d+|py-\d+|p-\d+|w-[\w-]+|h-[\w-]+|text-[\w-]+)/
      );
      if (twMatch) {
        result.push(
          <span key={`${i}-${keyIdx++}`} className="text-white/30">
            {twMatch[1]}
          </span>
        );
        remaining = remaining.slice(twMatch[1]!.length);
        continue;
      }

      // Default character
      result.push(
        <span key={`${i}-${keyIdx++}`} className="text-white/60">
          {remaining[0]}
        </span>
      );
      remaining = remaining.slice(1);
    }

    return (
      <span key={i}>
        {result}
        {"\n"}
      </span>
    );
  });
}
