"use client";

import type { CodeKey } from "../lib/code-examples";
import { SectionHeader } from "./section-header";

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
    <section
      id="syntax"
      className="section-anchor relative py-20 sm:py-24 px-4 sm:px-6"
    >
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          index="04"
          eyebrow="Syntax"
          title={
            <>
              One pattern,{" "}
              <em className="font-display italic font-normal text-acid">
                infinite motion
              </em>
            </>
          }
          lede="Gesture, property, value — composed exactly like Tailwind."
          codeKey="syntax"
          openCode={openCode}
        />

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
