"use client";

import { Reveal } from "./reveal";

const CAPABILITIES = [
  {
    title: "Gesture states",
    body: "Hover, tap, focus, drag, enter, exit, and in-view states use one consistent prefix shape.",
    code: "animate-hover:scale-105",
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
          <div className="mb-14 max-w-2xl">
            <h2 className="text-balance text-3xl font-semibold tracking-[-0.035em] text-fg sm:text-4xl md:text-5xl">
              Enough vocabulary for real interfaces.
            </h2>
            <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-fg-muted sm:text-lg">
              Use the parts of Motion that matter every day, without wrapping
              everything in custom components.
            </p>
          </div>
        </Reveal>

        <div className="border-y border-border">
          {CAPABILITIES.map((cap, index) => (
            <Reveal key={cap.title} delay={(index % 3) * 0.04} y={16}>
              <article className="group flex flex-col gap-4 border-b border-border py-6 last:border-b-0 md:flex-row md:items-center md:justify-between">
                <div className="max-w-2xl">
                  <h3 className="text-lg font-semibold tracking-[-0.02em] text-fg">
                    {cap.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                    {cap.body}
                  </p>
                </div>
                <code className="w-full shrink-0 truncate rounded-md border border-border bg-code-bg px-3 py-2 font-[family-name:var(--font-mono)] text-[11px] text-accent/80 transition-colors group-hover:border-accent/25 md:w-72">
                  {cap.code}
                </code>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
