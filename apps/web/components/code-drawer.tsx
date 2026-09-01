"use client";

import type { CodeKey } from "../lib/code-examples";
import { CODE_EXAMPLES } from "../lib/code-examples";
import { highlightCode } from "../lib/highlight";

export function CodeDrawer({
  codeOpen,
  setCodeOpen,
  activeCode,
  setActiveCode,
}: {
  codeOpen: boolean;
  setCodeOpen: (open: boolean) => void;
  activeCode: CodeKey;
  setActiveCode: (key: CodeKey) => void;
}) {
  const example = CODE_EXAMPLES[activeCode];

  return (
    <>
      {codeOpen && (
        <button
          type="button"
          aria-label="Close code panel"
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm cursor-pointer"
          onClick={() => setCodeOpen(false)}
        />
      )}

      <div
        className={`
          fixed top-0 right-0 z-50 h-full
          w-full sm:w-[480px] md:w-[520px]
          bg-surface-raised border-l border-border-strong
          shadow-[-20px_0_60px_rgba(0,0,0,0.5)]
          transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
          ${codeOpen ? "translate-x-0" : "translate-x-full"}
          flex flex-col
        `}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
            </div>
            <span className="text-[11px] text-text-muted font-[family-name:var(--font-mono)]">
              {example.file}
            </span>
          </div>
          <button
            type="button"
            aria-label="Close code panel"
            onClick={() => setCodeOpen(false)}
            className="w-7 h-7 rounded-md flex items-center justify-center text-text-muted hover:text-foreground hover:bg-surface-inset transition-colors cursor-pointer"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex gap-0 px-3 pt-2 border-b border-border-subtle overflow-x-auto scrollbar-none">
          {(Object.keys(CODE_EXAMPLES) as CodeKey[]).map((key) => (
            <button
              type="button"
              key={key}
              onClick={() => setActiveCode(key)}
              className={`px-3 py-2.5 text-[10px] font-medium tracking-wide uppercase whitespace-nowrap transition-colors rounded-t-md cursor-pointer ${
                activeCode === key
                  ? "text-acid bg-acid/5 border-b-2 border-acid"
                  : "text-text-muted hover:code-dim"
              }`}
            >
              {CODE_EXAMPLES[key].title}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-auto p-5">
          <pre className="text-[13px] leading-7 font-[family-name:var(--font-mono)]">
            <code>{highlightCode(example.code)}</code>
          </pre>
        </div>

        <div className="px-5 py-4 border-t border-border-subtle flex items-center justify-between">
          <div className="text-[11px] text-text-muted flex items-center gap-2">
            <svg
              className="w-3.5 h-3.5 text-acid/50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            Compiled at build time — zero runtime cost
          </div>
          <span className="text-[10px] text-text-muted/60 font-[family-name:var(--font-mono)]">
            ESC to close
          </span>
        </div>
      </div>
    </>
  );
}
