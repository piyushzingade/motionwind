"use client";

import React, { useState, useCallback, useEffect, type ReactNode } from "react";
import { useTheme } from "next-themes";

/**
 * Lightweight JSX/TSX syntax highlighter for code blocks.
 * Colors: keywords, strings, components, props, comments, animate-* classes.
 */
function highlightCode(code: string): ReactNode[] {
  const lines = code.split("\n");
  return lines.map((line, lineIdx) => {
    const parts: ReactNode[] = [];
    let remaining = line;
    let key = 0;

    // Process tokens left-to-right
    while (remaining.length > 0) {
      let matched = false;

      // Comments: // ...
      const commentMatch = remaining.match(/^(\/\/.*)/);
      if (commentMatch) {
        parts.push(<span key={key++} className="rn-hl-comment">{commentMatch[1]}</span>);
        remaining = remaining.slice(commentMatch[1]!.length);
        matched = true;
        continue;
      }

      // animate-* classes (accent color)
      const animMatch = remaining.match(/^(animate-[\w:[\].,=-]+)/);
      if (animMatch) {
        parts.push(<span key={key++} className="rn-hl-animate">{animMatch[1]}</span>);
        remaining = remaining.slice(animMatch[1]!.length);
        matched = true;
        continue;
      }

      // Strings: "..." or '...' or `...`
      const strMatch = remaining.match(/^("[^"]*"|'[^']*'|`[^`]*`)/);
      if (strMatch) {
        parts.push(<span key={key++} className="rn-hl-string">{strMatch[1]}</span>);
        remaining = remaining.slice(strMatch[1]!.length);
        matched = true;
        continue;
      }

      // JSX tags: <Component or </Component or <mw.View
      const tagMatch = remaining.match(/^(<\/?)([\w.]+)/);
      if (tagMatch) {
        parts.push(<span key={key++} className="rn-hl-punct">{tagMatch[1]}</span>);
        const tagName = tagMatch[2]!;
        const isComponent = /^[A-Z]/.test(tagName) || tagName.startsWith("mw.");
        parts.push(
          <span key={key++} className={isComponent ? "rn-hl-component" : "rn-hl-tag"}>
            {tagName}
          </span>
        );
        remaining = remaining.slice(tagMatch[0]!.length);
        matched = true;
        continue;
      }

      // Keywords
      const kwMatch = remaining.match(/^(import|from|export|function|const|let|return|if|else|className|style|onPress|key)\b/);
      if (kwMatch) {
        parts.push(<span key={key++} className="rn-hl-keyword">{kwMatch[1]}</span>);
        remaining = remaining.slice(kwMatch[1]!.length);
        matched = true;
        continue;
      }

      // Props: word= or word={
      const propMatch = remaining.match(/^(\w+)(=)/);
      if (propMatch) {
        parts.push(<span key={key++} className="rn-hl-prop">{propMatch[1]}</span>);
        parts.push(<span key={key++} className="rn-hl-punct">{propMatch[2]}</span>);
        remaining = remaining.slice(propMatch[0]!.length);
        matched = true;
        continue;
      }

      // Numbers
      const numMatch = remaining.match(/^(\d+\.?\d*)/);
      if (numMatch) {
        parts.push(<span key={key++} className="rn-hl-number">{numMatch[1]}</span>);
        remaining = remaining.slice(numMatch[1]!.length);
        matched = true;
        continue;
      }

      // Default: take one character
      if (!matched) {
        parts.push(<span key={key++}>{remaining[0]}</span>);
        remaining = remaining.slice(1);
      }
    }

    return (
      <React.Fragment key={lineIdx}>
        {parts}
        {lineIdx < lines.length - 1 ? "\n" : null}
      </React.Fragment>
    );
  });
}

/**
 * Phone-shaped preview component for React Native documentation.
 * Shows a mobile device frame with an animated preview inside,
 * matching the web <Demo> component's header bar pattern.
 */

export function RNPreview({
  children,
  title,
  code,
}: {
  children: ReactNode;
  title?: string;
  code?: string;
}) {
  const [replayKey, setReplayKey] = useState(0);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleReplay = useCallback(() => {
    setReplayKey((k) => k + 1);
  }, []);

  // Before hydration, default to dark
  const siteIsDark = mounted ? resolvedTheme === "dark" : true;

  return (
    <div className="not-prose my-8 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden shadow-sm">
      {/* Header bar */}
      <div className="border-b border-[var(--color-border)] bg-[var(--color-surface-elevated)]/50 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-accent)] shadow-[0_0_4px_var(--color-accent)]" />
            <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.15em] text-[var(--color-fg-muted)]">
              {title || "Preview"}
            </span>
          </span>
          <span className="inline-flex items-center gap-1 ml-2 px-1.5 py-0.5 rounded bg-[var(--color-fg-muted)]/[0.08] text-[9px] font-[family-name:var(--font-mono)] text-[var(--color-fg-muted)]/60 uppercase tracking-wider">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
              <path d="M12 18h.01" />
            </svg>
            Native
          </span>
        </div>
        <button
          onClick={handleReplay}
          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[var(--color-fg-muted)] transition-colors duration-150 hover:text-[var(--color-accent)] hover:bg-[var(--color-accent)]/[0.06] active:scale-95"
          aria-label="Replay animation"
          title="Replay animation"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
          </svg>
        </button>
      </div>

      {/* Preview area — single phone that follows site theme */}
      <div className="flex items-center justify-center px-6 py-8 demo-container">
        <div
          className={`relative w-[240px] rounded-[28px] border-[3px] overflow-hidden transition-all duration-300 ${
            siteIsDark
              ? "border-[#2a2a3a] bg-[#0a0a0f] shadow-xl shadow-black/30"
              : "border-[#d4d4d8] bg-[#fafaf9] shadow-xl shadow-black/8"
          }`}
        >
          {/* Status bar */}
          <div
            className={`flex items-center justify-between px-5 pt-3 pb-1 transition-colors duration-300 ${
              siteIsDark ? "text-white/40" : "text-black/30"
            }`}
          >
            <span className="text-[8px] font-semibold">9:41</span>
            <div className="flex items-center gap-1">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3a4.24 4.24 0 0 0-6 0zm-4-4l2 2a7.07 7.07 0 0 1 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
              </svg>
              <svg width="12" height="10" viewBox="0 0 24 24" fill="currentColor">
                <rect x="1" y="6" width="4" height="12" rx="1" opacity=".3" />
                <rect x="7" y="4" width="4" height="14" rx="1" opacity=".5" />
                <rect x="13" y="2" width="4" height="16" rx="1" opacity=".7" />
                <rect x="19" y="0" width="4" height="18" rx="1" />
              </svg>
            </div>
          </div>

          {/* Content area */}
          <div
            key={replayKey}
            className="px-4 pb-5 pt-2 min-h-[180px] flex items-center justify-center"
          >
            {children}
          </div>

          {/* Home indicator */}
          <div className="flex justify-center pb-2">
            <div
              className={`w-[80px] h-[4px] rounded-full transition-colors duration-300 ${
                siteIsDark ? "bg-white/15" : "bg-black/10"
              }`}
            />
          </div>
        </div>
      </div>

      {/* Code panel — below the preview */}
      {code && (
        <div className="rn-code-panel">
          <div className="rn-code-panel-header px-4 py-2 flex items-center gap-2">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#94a3b8] dark:text-[var(--color-code-muted)]">
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
            <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.15em] text-[#94a3b8] dark:text-[var(--color-code-muted)]">
              Code
            </span>
          </div>
          <pre className="p-4 overflow-x-auto text-[13px] leading-[1.85] font-[family-name:var(--font-mono)]">
            <code className="rn-code-block">
              {highlightCode(code)}
            </code>
          </pre>
        </div>
      )}
    </div>
  );
}

/**
 * Simulated RN animated box for documentation previews.
 * Uses CSS animations that mirror what Reanimated would do on native.
 */
export function AnimBox({
  children,
  animation = "fadeSlideUp",
  delay = 0,
  className = "",
  dark = true,
}: {
  children?: ReactNode;
  animation?:
    | "fadeSlideUp"
    | "fadeIn"
    | "scaleIn"
    | "slideRight"
    | "rotate"
    | "bounce"
    | "pulse"
    | "tapScale"
    | "spring";
  delay?: number;
  className?: string;
  dark?: boolean;
}) {
  const animClass = `rn-anim-${animation}`;
  return (
    <div
      className={`${animClass} ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
