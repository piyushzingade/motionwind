"use client";

import { Reveal } from "./reveal";

const CAPABILITIES = [
  {
    title: "Gesture states",
    body: "Hover, tap, focus, drag, enter, exit, and in-view states use one consistent prefix shape.",
    code: "animate-hover:scale-105",
    span: "wide",
  },
  {
    title: "Spring tuning",
    body: "Tune stiffness and damping without leaving className.",
    code: "animate-spring animate-damping-24",
    span: "normal",
  },
  {
    title: "Layout motion",
    body: "Animate position, size, and shared layout IDs when UI state changes.",
    code: "animate-layout-position",
    span: "normal",
  },
  {
    title: "Scroll values",
    body: "Map scroll progress to transforms and progress indicators.",
    code: "animate-scroll:scaleX-[0,1]",
    span: "normal",
  },
  {
    title: "Adapter output",
    body: "Generate React, Vue, vanilla JavaScript, and native-friendly output from the same mental model.",
    code: "target: react | vue | vanilla",
    span: "wide",
  },
  {
    title: "Readable fallbacks",
    body: "Motion is additive. The element remains semantic, styled, and accessible before animation runs.",
    code: "className stays static",
    span: "normal",
  },
];

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="section-anchor relative px-4 py-20 sm:px-6 sm:py-28 lg:py-32"
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

        {/* Bento grid — alternating wide/normal */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {CAPABILITIES.map((cap, index) => (
            <Reveal
              key={cap.title}
              delay={(index % 3) * 0.04}
              y={20}
              className={cap.span === "wide" ? "md:col-span-2" : undefined}
            >
              <article className="group flex h-full flex-col rounded-2xl border border-border bg-surface-elevated p-6 transition-colors hover:border-accent/25">
                <div className="mb-5 flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent/10 font-[family-name:var(--font-mono)] text-sm font-semibold text-accent transition-colors group-hover:bg-accent/15">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-[15px] font-semibold text-fg">
                    {cap.title}
                  </h3>
                </div>
                <p className="flex-1 text-sm leading-relaxed text-fg-muted">
                  {cap.body}
                </p>
                <code className="mt-5 block truncate rounded-xl border border-border-subtle bg-code-bg px-3.5 py-2.5 font-[family-name:var(--font-mono)] text-[11px] text-accent/80">
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
