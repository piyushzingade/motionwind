"use client";

import type { CodeKey } from "../lib/code-examples";
import { onActivateKey } from "../lib/on-activate-key";

/**
 * Editorial specimen header shared by every landing section:
 * numbered mono index + eyebrow, display title, lede, hairline rule.
 * Optionally opens the code drawer on click (previous behavior).
 */
export function SectionHeader({
  index,
  eyebrow,
  title,
  lede,
  codeKey,
  openCode,
}: {
  index: string;
  eyebrow: string;
  title: React.ReactNode;
  lede?: string;
  codeKey?: CodeKey;
  openCode?: (key: CodeKey) => void;
}) {
  const interactive = codeKey && openCode;

  return (
    <div
      {...(interactive
        ? {
            role: "button",
            tabIndex: 0,
            "aria-label": `View code for the ${eyebrow.toLowerCase()} section`,
            onClick: () => openCode(codeKey),
            onKeyDown: onActivateKey(() => openCode(codeKey)),
          }
        : {})}
      className={`animate-initial:opacity-0 animate-initial:y-20 animate-inview:opacity-100 animate-inview:y-0 animate-duration-600 animate-ease-out animate-once mb-12 sm:mb-16 ${
        interactive ? "cursor-pointer group/sechead" : ""
      }`}
    >
      <div className="flex items-center gap-3 mb-5">
        <span className="spec-index">{index}</span>
        <span className="spec-label">{eyebrow}</span>
        <span className="spec-rule flex-1" aria-hidden="true" />
        {interactive && (
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-text-muted opacity-0 group-hover/sechead:opacity-100 transition-opacity">
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
            View code
          </span>
        )}
      </div>
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-balance max-w-2xl">
        {title}
      </h2>
      {lede && (
        <p className="mt-4 text-text-dim text-base sm:text-lg max-w-xl leading-relaxed">
          {lede}
        </p>
      )}
    </div>
  );
}
