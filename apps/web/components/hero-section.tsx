"use client";

import { LazyMotion, domAnimation, m } from "motion/react";
import { useHeroGlow } from "../lib/use-hero-glow";

export function HeroSection() {
  const { springX, springY, heroGlow, onMouseMove, onMouseLeave } =
    useHeroGlow();

  return (
    <LazyMotion features={domAnimation}>
      <section
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 overflow-hidden glow-top"
      >
        <div className="grid-bg absolute inset-0 pointer-events-none" />
        <div className="hero-gradient" aria-hidden="true" />
        <m.div
          ref={heroGlow}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden md:block"
          style={{ x: springX, y: springY }}
        >
          <div className="hero-glow" />
        </m.div>

        <div className="relative z-10 w-full max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center px-6 sm:px-10 py-12 sm:py-16 relative">
            <div className="animate-initial:opacity-0 animate-initial:y-12 animate-enter:opacity-100 animate-enter:y-0 animate-duration-600 animate-ease-out mb-6 sm:mb-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-acid/25 bg-acid-soft px-3 sm:px-4 py-1.5 text-[10px] sm:text-xs font-medium tracking-wide text-acid uppercase">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-acid opacity-75 animate-pulse-glow" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-acid" />
                </span>
                v0.3 — Now in Public Beta
              </span>
            </div>

            <h1 className="animate-initial:opacity-0 animate-initial:y-20 animate-enter:opacity-100 animate-enter:y-0 animate-duration-700 animate-ease-out text-center max-w-3xl">
              <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.92]">
                Animations in
              </span>
              <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.92] text-acid mt-2 sm:mt-3 relative">
                class names.
                <svg
                  className="absolute -bottom-2 left-0 w-full h-4 text-acid/50"
                  viewBox="0 0 400 16"
                  fill="none"
                  preserveAspectRatio="none"
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

            <p className="animate-initial:opacity-0 animate-initial:y-20 animate-enter:opacity-100 animate-enter:y-0 animate-duration-700 animate-delay-200 animate-ease-out mt-6 sm:mt-8 text-base sm:text-lg text-text-dim max-w-lg text-center leading-relaxed">
              Write Motion animations as Tailwind-like utility classes.
              Transformed at build time. Zero runtime overhead. No imports
              needed.
            </p>

            <div className="animate-initial:opacity-0 animate-initial:y-20 animate-enter:opacity-100 animate-enter:y-0 animate-duration-700 animate-delay-400 animate-ease-out flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 sm:mt-10">
              <a
                href="https://www.motionwind.xyz/docs"
                className="animate-hover:scale-105 animate-tap:scale-95 animate-spring animate-stiffness-300 animate-damping-20 group inline-flex items-center gap-2 rounded-lg bg-acid px-5 sm:px-6 py-3 text-sm font-semibold text-gray-950 transition-shadow hover:shadow-[0_0_30px_var(--acid-glow)] cursor-pointer"
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
                className="animate-hover:scale-105 animate-tap:scale-95 animate-spring animate-stiffness-300 animate-damping-20 inline-flex items-center gap-2 rounded-lg border border-border-strong bg-surface-raised/60 px-5 sm:px-6 py-3 text-sm font-medium text-text-dim backdrop-blur-sm transition-colors hover:bg-surface-overlay hover:text-foreground"
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

            <HeroCodeBlock />
          </div>
        </div>
      </section>
    </LazyMotion>
  );
}

function HeroCodeBlock() {
  return (
    <div className="animate-initial:opacity-0 animate-initial:y-30 animate-enter:opacity-100 animate-enter:y-0 animate-duration-800 animate-delay-500 animate-ease-out mt-10 sm:mt-14 w-full max-w-xl">
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
      </div>
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-acid/10 blur-3xl rounded-full" />
    </div>
  );
}
