"use client";

import React, { useState, useCallback, type ReactNode } from "react";
import { mw } from "motionwind-react";

/**
 * Recursively walks React children and replaces any plain HTML element
 * whose className contains "animate-" with its motionwind `mw.*` runtime
 * equivalent. This is necessary because MDX compiles JSX elements as
 * literal HTML tags — component overrides don't apply to them.
 */
function processChildren(children: ReactNode): ReactNode {
  return React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const props = child.props as Record<string, any>;
    const className: string = props.className || "";
    const innerChildren = props.children;

    // If it's a plain HTML element with animate-* classes, use mw.* instead
    if (typeof child.type === "string" && className.includes("animate-")) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const MWComponent = (mw as any)[child.type];
      if (MWComponent) {
        const { children: _, ...restProps } = props;
        return React.createElement(
          MWComponent,
          restProps,
          innerChildren != null ? processChildren(innerChildren) : undefined,
        );
      }
    }

    // Recursively process children of non-animated elements too
    // (their descendants might have animate-* classes)
    if (
      innerChildren != null &&
      typeof innerChildren !== "string" &&
      typeof innerChildren !== "number" &&
      typeof innerChildren !== "boolean"
    ) {
      const processed = processChildren(innerChildren);
      return React.cloneElement(child, {}, processed);
    }

    return child;
  });
}

export function Demo({
  children,
  title,
  className = "",
}: {
  children: ReactNode;
  title?: string;
  className?: string;
}) {
  const [replayKey, setReplayKey] = useState(0);

  const handleReplay = useCallback(() => {
    setReplayKey((k) => k + 1);
  }, []);

  // Process children: swap HTML elements with animate-* classes to mw.* components
  const processed = processChildren(children);

  return (
    <div className="not-prose my-8 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden shadow-sm">
      {/* Header bar */}
      <div className="border-b border-[var(--color-border)] bg-[var(--color-surface-elevated)]/50 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-accent)] shadow-[0_0_4px_var(--color-accent)]" />
          <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.15em] text-[var(--color-fg-muted)]">
            {title || "Result"}
          </span>
        </div>
        <button
          onClick={handleReplay}
          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[var(--color-fg-muted)] transition-colors duration-150 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:text-[var(--color-accent)] hover:bg-[var(--color-accent)]/[0.06] active:scale-95"
          aria-label="Replay animation"
          title="Replay animation"
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
          </svg>
        </button>
      </div>

      {/* Demo area — key changes force full remount to replay animations */}
      <div className="demo-container">
        <div
          key={replayKey}
          className={`relative z-10 flex min-h-[120px] items-center justify-center px-6 py-5 ${className}`}
        >
          {processed}
        </div>
      </div>
    </div>
  );
}
