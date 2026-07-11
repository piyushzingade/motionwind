"use client";

import { useMemo, useState } from "react";
import type { ComponentType, ReactNode } from "react";
import { mw } from "motionwind-react";
import { generateMotionCode } from "motionwind-react/tooling";

/**
 * Compact live playground for MDX docs. Edit the classes, see the animation
 * run (via the mw.* runtime) and the Motion code it compiles to.
 */
export function Playground({
  initial = "animate-hover:scale-110 animate-spring",
  tag = "div",
  text = "Hover me",
}: {
  initial?: string;
  tag?: string;
  text?: string;
}) {
  const [classes, setClasses] = useState(initial);
  const code = useMemo(
    () => generateMotionCode(tag, classes, { text }),
    [tag, classes, text],
  );

  const El = (
    mw as Record<
      string,
      ComponentType<{ className?: string; children?: ReactNode }>
    >
  )[tag]!;

  return (
    <div className="not-prose my-6 overflow-hidden rounded-xl border border-fd-border">
      <textarea
        value={classes}
        onChange={(e) => setClasses(e.target.value)}
        spellCheck={false}
        rows={3}
        className="w-full resize-y border-b border-fd-border bg-fd-secondary p-3 font-mono text-sm text-fd-foreground outline-none"
      />
      <div className="flex min-h-[140px] items-center justify-center bg-fd-card p-8">
        <El className={classes}>{text}</El>
      </div>
      <pre className="overflow-auto border-t border-fd-border bg-fd-secondary p-3 text-xs leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}
