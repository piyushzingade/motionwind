"use client";

import { LazyMotion, domAnimation, m } from "motion/react";
import { useHeroGlow } from "../lib/use-hero-glow";
import { MintlifyLogo } from "./mintlify-logo";

const TICKER_CLASSES = [
  "animate-hover:scale-110",
  "animate-tap:scale-95",
  "animate-inview:y-0",
  "animate-spring",
  "animate-stiffness-300",
  "animate-duration-500",
  "animate-drag-both",
  "animate-once",
  "animate-repeat-infinite",
  "animate-exit:x-100pct",
];

export function HeroSection() {
  const { springX, springY, heroGlow, onMouseMove, onMouseLeave } =
    useHeroGlow();

  return (
    <LazyMotion features={domAnimation}>
      <section
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className="relative overflow-hidden glow-top"
      >
        <div className="hero-gradient" aria-hidden="true" />
        <div className="hero-grid absolute inset-0" aria-hidden="true" />
        <m.div
          ref={heroGlow}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden md:block"
          style={{ x: springX, y: springY }}
        >
          <div className="hero-glow" />
        </m.div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-20 pb-10">
          {/* ── Specimen meta row ─────────────────────────────────── */}
          <div className="animate-initial:opacity-0 animate-enter:opacity-100 animate-duration-700 animate-ease-out flex flex-wrap items-center gap-x-5 gap-y-2 mb-8 sm:mb-12">
            <span className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface-raised/70 px-3 sm:px-4 py-1.5 backdrop-blur-sm">
                <MintlifyLogo className="h-4 w-auto" />
                <span className="text-[10px] sm:text-xs font-medium tracking-wide text-text-dim">
                  Backed by ·{" "}
                  <span className="font-semibold text-text-strong">
                    Mintlify
                  </span>{" "}
                  · OSS program
                </span>
            </span>
            <span className="spec-label hidden sm:inline">Specimen № 001</span>
            <span className="spec-label hidden md:inline">Build-time</span>
            <span className="spec-label hidden md:inline">Zero runtime</span>
            <span className="spec-label hidden lg:inline">v2.0.0</span>
          </div>

          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-start">
            {/* ── Display type ────────────────────────────────────── */}
            <div>
              <h1 className="animate-initial:opacity-0 animate-initial:y-20 animate-enter:opacity-100 animate-enter:y-0 animate-duration-700 animate-ease-out max-w-xl">
                <span className="block text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[0.95]">
                  Motion in
                </span>
                <span className="font-display block text-5xl sm:text-6xl md:text-7xl leading-[0.95] mt-2 sm:mt-3 text-acid relative w-fit">
                  <em className="not-italic font-display italic">
                    class names.
                  </em>
                  <svg
                    className="absolute -bottom-2 left-0 w-full h-4 text-acid/50"
                    viewBox="0 0 400 16"
                    fill="none"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <m.path
                      d="M2 10C60 6 140 4 200 8C260 12 340 6 398 10"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      fill="none"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{
                        delay: 1.1,
                        duration: 0.9,
                        ease: "easeInOut",
                      }}
                    />
                  </svg>
                </span>
              </h1>

              <p className="animate-initial:opacity-0 animate-initial:y-20 animate-enter:opacity-100 animate-enter:y-0 animate-duration-700 animate-delay-200 animate-ease-out mt-6 sm:mt-8 text-base sm:text-lg text-text-dim max-w-md leading-relaxed">
                Write Motion animations as Tailwind-like utility classes.
                Transformed at build time. Zero runtime overhead. No imports
                needed.
              </p>

              {/* ── Live class chips: the docs are the demo ───────── */}
              <div className="animate-initial:opacity-0 animate-enter:opacity-100 animate-duration-700 animate-delay-300 animate-ease-out mt-6 flex flex-wrap gap-2">
                <span className="spec-label w-full mb-1">
                  Hover the specimens — they run on motionwind
                </span>
                <span className="live-chip animate-hover:scale-110 animate-tap:scale-95 animate-spring animate-stiffness-400 animate-damping-15">
                  <span className="chip-gesture">animate-hover:</span>
                  <span className="chip-rest">scale-110</span>
                </span>
                <span className="live-chip animate-hover:rotate-6 animate-tap:rotate-0 animate-spring animate-stiffness-200 animate-damping-10">
                  <span className="chip-gesture">animate-hover:</span>
                  <span className="chip-rest">rotate-6</span>
                </span>
                <span className="live-chip animate-hover:y--4 animate-tap:y-0 animate-spring animate-stiffness-300 animate-damping-20">
                  <span className="chip-gesture">animate-hover:</span>
                  <span className="chip-rest">y--4</span>
                </span>
              </div>

              <div className="animate-initial:opacity-0 animate-initial:y-20 animate-enter:opacity-100 animate-enter:y-0 animate-duration-700 animate-delay-400 animate-ease-out flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 sm:mt-10">
                <a
                  href="https://www.motionwind.xyz/docs"
                  className="animate-hover:scale-105 animate-tap:scale-95 animate-spring animate-stiffness-300 animate-damping-20 group inline-flex items-center gap-2 rounded-lg bg-acid px-5 sm:px-6 py-3 text-sm font-semibold text-background transition-shadow hover:shadow-[0_0_30px_var(--acid-glow)] cursor-pointer"
                >
                  Get Started
                  <svg
                    className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </a>
                <a
                  href="https://github.com/piyushzingade/motionwind"
                  className="animate-hover:scale-105 animate-tap:scale-95 animate-spring animate-stiffness-300 animate-damping-20 inline-flex items-center gap-2 rounded-lg border border-border-strong bg-surface-raised/60 px-5 sm:px-6 py-3 text-sm font-semibold text-text-strong backdrop-blur-sm transition-colors hover:bg-surface-overlay hover:text-foreground"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  GitHub
                </a>
              </div>
            </div>

            {/* ── Code specimen ───────────────────────────────────── */}
            <HeroCodeBlock />
          </div>

          {/* ── Class ticker ──────────────────────────────────────── */}
          <div
            className="animate-initial:opacity-0 animate-enter:opacity-100 animate-duration-800 animate-delay-500 animate-ease-out mt-12 sm:mt-16"
            aria-hidden="true"
          >
            <div className="marquee">
              <div className="marquee-track py-1">
                {[...TICKER_CLASSES, ...TICKER_CLASSES].map((cls, i) => (
                  <span
                    key={`${cls}-${i}`}
                    className="live-chip shrink-0 opacity-80"
                  >
                    {cls}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </LazyMotion>
  );
}

function HeroCodeBlock() {
  return (
    <div className="animate-initial:opacity-0 animate-initial:y-30 animate-enter:opacity-100 animate-enter:y-0 animate-duration-800 animate-delay-500 animate-ease-out w-full lg:pt-2">
      <div className="flex items-center gap-3 mb-3">
        <span className="spec-index">Fig. 01</span>
        <span className="spec-label">The whole API — one button</span>
        <span className="spec-rule flex-1" aria-hidden="true" />
      </div>
      <div className="rounded-xl border border-border-subtle bg-surface-raised/80 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border-subtle">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]/80" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]/80" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]/80" />
          </div>
          <span className="ml-3 text-xs text-text-muted font-[family-name:var(--font-mono)]">
            App.tsx
          </span>
          <span className="ml-auto text-[10px] text-acid/70 font-[family-name:var(--font-mono)]">
            0 imports
          </span>
        </div>
        <pre className="p-5 text-sm leading-7 font-[family-name:var(--font-mono)] overflow-x-auto">
          <code>
            <span className="code-comment">
              {"// Just add classes. That's it."}
            </span>
            {"\n"}
            <span className="code-dim">{"<"}</span>
            <span className="syntax-tag">{"button"}</span>
            {"\n"}
            {"  "}
            <span className="text-acid/80">{"className"}</span>
            <span className="code-dim">{"="}</span>
            <span className="syntax-string">{'"'}</span>
            {"\n"}
            {"    "}
            <span className="text-acid font-semibold">
              {"animate-hover:scale-110"}
            </span>
            {"\n"}
            {"    "}
            <span className="text-acid font-semibold">
              {"animate-tap:scale-95"}
            </span>
            {"\n"}
            {"    "}
            <span className="text-acid font-semibold">{"animate-spring"}</span>
            {"\n"}
            {"    "}
            <span className="code-dim">{"rounded-xl bg-white px-6 py-3"}</span>
            {"\n"}
            {"  "}
            <span className="syntax-string">{'"'}</span>
            {"\n"}
            <span className="code-dim">{">"}</span>
            {"\n"}
            {"  Click me"}
            {"\n"}
            <span className="code-dim">{"</"}</span>
            <span className="syntax-tag">{"button"}</span>
            <span className="code-dim">{">"}</span>
          </code>
        </pre>
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-border-subtle bg-surface-inset/40">
          <span className="text-[10px] font-[family-name:var(--font-mono)] text-text-muted">
            → compiles to motion.button
          </span>
          <span className="text-[10px] font-[family-name:var(--font-mono)] text-text-muted">
            0kb runtime
          </span>
        </div>
      </div>
      {/* Live proof: this button is powered by the classes above */}
      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          className="animate-hover:scale-110 animate-tap:scale-95 animate-spring animate-stiffness-300 animate-damping-20 rounded-xl bg-acid px-6 py-3 text-sm font-semibold text-background cursor-pointer"
        >
          Click me
        </button>
        <span className="text-[11px] text-text-muted">
          ← live. Hover it, tap it. No imports.
        </span>
      </div>
    </div>
  );
}
