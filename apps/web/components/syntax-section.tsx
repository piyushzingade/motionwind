"use client";

import { SectionHeader } from "./section-header";
import { Reveal } from "./reveal";

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

export function SyntaxSection() {
  return (
    <section
      id="syntax"
      className="section-anchor relative py-20 sm:py-28 px-4 sm:px-6"
    >
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <SectionHeader
            label="One readable pattern"
            title="Describe the interaction, then the motion."
            lede="Each class follows the same shape: when it happens, what changes, and by how much."
          />
        </Reveal>

        <Reveal y={28}>
          <div className="overflow-hidden rounded-lg border border-border-strong bg-surface-raised">
          <div className="p-6 sm:p-8 border-b border-border-subtle">
            <div className="flex items-center justify-center">
              <code className="text-sm sm:text-base md:text-xl font-[family-name:var(--font-mono)] flex flex-wrap items-center gap-1 justify-center">
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
        </Reveal>
      </div>
    </section>
  );
}
