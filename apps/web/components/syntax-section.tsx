"use client";

import { Reveal } from "./reveal";

const PARTS = [
  {
    label: "when",
    value: "hover",
    examples: "tap, focus, inview, drag, enter, exit",
  },
  {
    label: "what",
    value: "scale",
    examples: "opacity, x, y, rotate, path-length",
  },
  {
    label: "how much",
    value: "105",
    examples: "numbers, percentages, bracket values",
  },
];

const GESTURES = [
  { prefix: "animate-hover:", prop: "whileHover" },
  { prefix: "animate-tap:", prop: "whileTap" },
  { prefix: "animate-focus:", prop: "whileFocus" },
  { prefix: "animate-inview:", prop: "whileInView" },
  { prefix: "animate-drag:", prop: "whileDrag" },
  { prefix: "animate-initial:", prop: "initial" },
  { prefix: "animate-enter:", prop: "animate" },
  { prefix: "animate-exit:", prop: "exit" },
];

export function SyntaxSection() {
  return (
    <section
      id="syntax"
      className="section-anchor relative px-4 py-16 sm:px-6 sm:py-22 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="mb-14 max-w-2xl">
            <h2 className="text-balance text-3xl font-semibold tracking-[-0.035em] text-fg sm:text-4xl md:text-5xl">
              One grammar, many interactions.
            </h2>
            <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-fg-muted sm:text-lg">
              Every class names the trigger, the animated property, and the
              target value.
            </p>
          </div>
        </Reveal>

        <Reveal y={18}>
          <div className="overflow-hidden rounded-xl border border-border bg-surface-elevated">
            <div className="border-b border-border-subtle px-5 py-5 sm:px-6">
              <code className="block overflow-x-auto whitespace-nowrap font-[family-name:var(--font-mono)] text-base text-fg sm:text-lg">
                <span className="text-code-muted">animate-</span>
                <span className="text-accent">hover</span>
                <span className="text-code-muted">:</span>
                <span className="text-accent">scale</span>
                <span className="text-code-muted">-</span>
                <span className="text-accent">105</span>
              </code>
            </div>

            <div className="divide-y divide-border-subtle">
              {PARTS.map((part) => (
                <div
                  key={part.label}
                  className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                >
                  <div>
                    <h3 className="text-sm font-semibold text-fg">
                      {part.label}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-code-muted">
                      {part.examples}
                    </p>
                  </div>
                  <code className="w-fit rounded-md border border-border bg-code-bg px-2.5 py-1 font-[family-name:var(--font-mono)] text-[11px] text-accent">
                    {part.value}
                  </code>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal y={22} delay={0.06}>
          <div className="mt-6 rounded-xl border border-border bg-surface-elevated">
            <div className="border-b border-border-subtle px-6 py-4">
              <h3 className="text-sm font-semibold text-fg">
                Prefixes map to Motion props
              </h3>
            </div>
            <div className="divide-y divide-border-subtle">
              {GESTURES.map((g) => (
                <div
                  key={g.prefix}
                  className="flex items-center justify-between gap-3 px-5 py-3.5"
                >
                  <code className="font-[family-name:var(--font-mono)] text-[12px] text-accent">
                    {g.prefix}
                  </code>
                  <span className="text-xs text-code-muted">{g.prop}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
