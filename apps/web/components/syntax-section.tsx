"use client";

import { Reveal } from "./reveal";

const PARTS = [
  ["when", "hover", "tap, focus, inview, drag, enter, exit"],
  ["what", "scale", "opacity, x, y, rotate, path-length"],
  ["how much", "105", "numbers, percentages, bracket values"],
] as const;

const GESTURES = [
  ["animate-hover:", "whileHover"],
  ["animate-tap:", "whileTap"],
  ["animate-focus:", "whileFocus"],
  ["animate-inview:", "whileInView"],
  ["animate-drag:", "whileDrag"],
  ["animate-initial:", "initial"],
  ["animate-enter:", "animate"],
  ["animate-exit:", "exit"],
] as const;

export function SyntaxSection() {
  return (
    <section
      id="syntax"
      className="section-anchor relative px-4 py-16 sm:px-6 sm:py-22 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="mb-8 max-w-2xl sm:mb-10">
            <h2 className="text-balance text-3xl font-semibold tracking-[-0.035em] text-fg sm:text-4xl md:text-5xl">
              One grammar, many interactions.
            </h2>
            <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-fg-muted sm:text-lg">
              Every class names the trigger, the animated property, and the
              target value.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-4 lg:grid-cols-[0.82fr_1.18fr]">
          <Reveal y={22}>
            <div className="rounded-[1.4rem] border border-border bg-surface-elevated p-5 shadow-[0_24px_80px_-60px_var(--color-shadow)] sm:p-6">
              <code className="block rounded-xl border border-border-subtle bg-code-bg p-4 font-[family-name:var(--font-mono)] text-sm text-fg sm:text-base">
                <span className="text-code-muted">animate-</span>
                <span className="text-accent">hover</span>
                <span className="text-code-muted">:</span>
                <span className="text-accent">scale</span>
                <span className="text-code-muted">-</span>
                <span className="text-accent">105</span>
              </code>

              <div className="mt-5 grid gap-3">
                {PARTS.map(([label, value, examples]) => (
                  <div
                    key={label}
                    className="rounded-lg border border-border-subtle bg-surface px-4 py-3"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm font-semibold text-fg">
                        {label}
                      </span>
                      <code className="rounded bg-accent/10 px-2 py-1 font-[family-name:var(--font-mono)] text-[11px] text-accent">
                        {value}
                      </code>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-code-muted">
                      {examples}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal y={22} delay={0.08}>
            <div className="overflow-hidden rounded-[1.4rem] border border-border bg-surface-elevated shadow-[0_24px_80px_-60px_var(--color-shadow)]">
              <div className="border-b border-border-subtle px-5 py-4">
                <h3 className="text-sm font-semibold text-fg">
                  Prefixes map to Motion props
                </h3>
              </div>
              <div className="grid sm:grid-cols-2">
                {GESTURES.map(([prefix, prop]) => (
                  <div
                    key={prefix}
                    className="flex items-center justify-between gap-4 border-b border-border-subtle px-5 py-4 sm:odd:border-r"
                  >
                    <code className="font-[family-name:var(--font-mono)] text-[12px] text-accent">
                      {prefix}
                    </code>
                    <span className="text-xs text-code-muted">{prop}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
