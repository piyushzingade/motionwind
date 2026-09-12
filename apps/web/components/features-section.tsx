"use client";

import { Reveal } from "./reveal";

const CAPABILITIES = [
  {
    title: "Gesture states",
    body: "Hover, tap, focus, drag, enter, exit, and in-view states use one consistent prefix shape.",
    code: "animate-hover:scale-105",
    wide: true,
  },
  {
    title: "Spring tuning",
    body: "Tune stiffness and damping without leaving className.",
    code: "animate-spring animate-damping-24",
  },
  {
    title: "Layout motion",
    body: "Animate position, size, and shared layout IDs when UI state changes.",
    code: "animate-layout-position",
  },
  {
    title: "Scroll values",
    body: "Map scroll progress to transforms and progress indicators.",
    code: "animate-scroll:scaleX-[0,1]",
  },
  {
    title: "Adapter output",
    body: "Generate React, Vue, vanilla JavaScript, and native-friendly output from the same mental model.",
    code: "target: react | vue | vanilla",
    wide: true,
  },
  {
    title: "Readable fallbacks",
    body: "Motion is additive. The element remains semantic, styled, and accessible before animation runs.",
    code: "className stays static",
  },
];

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="section-anchor relative px-4 py-16 sm:px-6 sm:py-22 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="mb-8 max-w-2xl sm:mb-10">
            <h2 className="text-balance text-3xl font-semibold tracking-[-0.035em] text-fg sm:text-4xl md:text-5xl">
              Enough vocabulary for real interfaces.
            </h2>
            <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-fg-muted sm:text-lg">
              Use the parts of Motion that matter every day, without wrapping
              everything in custom components.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-4 md:grid-cols-[1.08fr_0.92fr] lg:grid-cols-[1.12fr_0.88fr_1fr]">
          {CAPABILITIES.map((capability, index) => (
            <Reveal
              key={capability.title}
              delay={(index % 3) * 0.04}
              y={20}
              className={capability.wide ? "md:col-span-2" : undefined}
            >
              <article className="flex h-full flex-col justify-between rounded-xl border border-border bg-surface-elevated p-5 shadow-[0_18px_60px_-52px_var(--color-shadow)]">
                <div>
                  <h3 className="text-base font-semibold text-fg">
                    {capability.title}
                  </h3>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-fg-muted">
                    {capability.body}
                  </p>
                </div>
                <code className="mt-6 block truncate rounded-md bg-code-bg px-3 py-2 font-[family-name:var(--font-mono)] text-[11px] text-accent/80">
                  {capability.code}
                </code>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
