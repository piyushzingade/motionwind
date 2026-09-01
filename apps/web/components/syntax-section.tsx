"use client";

import type { CodeKey } from "../lib/code-examples";
import { onActivateKey } from "../lib/on-activate-key";

const GESTURES = [
  ["hover:", "whileHover"],
  ["tap:", "whileTap"],
  ["focus:", "whileFocus"],
  ["inview:", "whileInView"],
  ["drag:", "whileDrag"],
  ["initial:", "initial"],
  ["enter:", "animate"],
  ["exit:", "exit"],
] as const;

export function SyntaxSection({
  openCode,
}: {
  openCode: (key: CodeKey) => void;
}) {
  return (
    <section className="relative py-20 sm:py-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div
          role="button"
          tabIndex={0}
          aria-label="View syntax examples"
          onClick={() => openCode("syntax")}
          onKeyDown={onActivateKey(() => openCode("syntax"))}
          className="animate-initial:opacity-0 animate-initial:y-20 animate-inview:opacity-100 animate-inview:y-0 animate-duration-600 animate-ease-out animate-once text-center mb-12 sm:mb-16 cursor-pointer group/syn"
        >
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-acid/70 mb-4 block">
            Syntax
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight group-hover/syn:text-acid/90 transition-colors">
            One pattern, infinite motion
          </h2>
          <p className="mt-2 text-[11px] text-text-muted opacity-0 group-hover/syn:opacity-100 transition-opacity flex items-center gap-1 justify-center">
            <svg
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
              />
            </svg>
            Click to see examples
          </p>
        </div>

        <div className="animate-initial:opacity-0 animate-initial:y-20 animate-inview:opacity-100 animate-inview:y-0 animate-duration-600 animate-ease-out animate-once rounded-2xl border border-border-subtle bg-surface-raised overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-border-subtle">
            <div className="flex items-center justify-center">
              <code className="text-base sm:text-lg md:text-2xl font-[family-name:var(--font-mono)] flex flex-wrap items-center gap-1 justify-center">
                <span className="text-text-muted">animate-</span>
                <span className="text-acid bg-acid/10 px-2 py-0.5 rounded">
                  {"{"}
                  <span className="text-[10px] align-top">gesture</span>
                  {"}"}
                </span>
                <span className="text-text-muted">:</span>
                <span className="text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                  {"{"}
                  <span className="text-[10px] align-top">property</span>
                  {"}"}
                </span>
                <span className="text-text-muted">-</span>
                <span className="text-fuchsia-400 bg-fuchsia-400/10 px-2 py-0.5 rounded">
                  {"{"}
                  <span className="text-[10px] align-top">value</span>
                  {"}"}
                </span>
              </code>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              {GESTURES.map(([prefix, prop]) => (
                <div
                  key={prefix}
                  className="rounded-lg bg-surface/50 border border-border-subtle p-3 text-center"
                >
                  <code className="text-xs font-[family-name:var(--font-mono)] text-acid">
                    {prefix}
                  </code>
                  <p className="text-[10px] text-text-muted mt-1">{prop}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
