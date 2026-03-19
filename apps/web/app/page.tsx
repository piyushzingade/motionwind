"use client";

import { useState, useEffect, useCallback } from "react";
import { Typewriter } from "../components/typewriter";

/* ────────────────────────────────────────────────────────────────────
 *  CODE SNIPPETS — shown inside the sliding code panel
 * ──────────────────────────────────────────────────────────────────── */
const CODE_EXAMPLES = {
  hover: {
    title: "Hover & Tap",
    file: "Button.tsx",
    code: `// Spring-powered button
<button
  className="
    animate-hover:scale-110
    animate-tap:scale-95
    animate-spring
    rounded-xl bg-white px-6 py-3
  "
>
  Click me
</button>`,
  },
  scroll: {
    title: "Scroll Reveal",
    file: "Section.tsx",
    code: `// Fades in when scrolled into view
<div
  className="
    animate-initial:opacity-0
    animate-initial:y-20
    animate-inview:opacity-100
    animate-inview:y-0
    animate-duration-500
    animate-once
    p-6 rounded-xl
  "
>
  Hello world
</div>`,
  },
  spring: {
    title: "Spring Physics",
    file: "Card.tsx",
    code: `// Fine-tune physical motion
<Card
  className="
    animate-hover:rotate-6
    animate-hover:scale-110
    animate-spring
    animate-stiffness-200
    animate-damping-10
  "
>
  Bouncy card
</Card>`,
  },
  drag: {
    title: "Draggable",
    file: "DragBox.tsx",
    code: `// Drag with elastic snap-back
<div
  className="
    animate-drag-both
    animate-drag-elastic-30
    animate-drag-snap
    animate-hover:scale-105
    w-24 h-24 rounded-2xl
  "
>
  Drag me
</div>`,
  },
  loop: {
    title: "Infinite Loop",
    file: "Loader.tsx",
    code: `// Continuous spinning loader
<div
  className="
    animate-initial:rotate-0
    animate-enter:rotate-360
    animate-duration-2000
    animate-ease-linear
    animate-repeat-infinite
    w-10 h-10
  "
/>`,
  },
  component: {
    title: "Custom Component",
    file: "App.tsx",
    code: `// Works on any component — no mw.* needed
import { Card } from "@/ui/card"

<Card
  className="
    animate-hover:scale-105
    animate-tap:scale-95
    animate-spring
    p-6 rounded-2xl
  "
>
  shadcn, custom, anything.
</Card>`,
  },
  template: {
    title: "Template Literals",
    file: "List.tsx",
    code: `// Dynamic + static classes in one string
<div
  className={\`
    animate-initial:opacity-0
    animate-enter:opacity-100
    animate-duration-500
    \${isActive ? "bg-amber-500" : "bg-gray-800"}
    p-4 rounded-lg
  \`}
>
  {item.name}
</div>`,
  },
  compiled: {
    title: "Compiled Output",
    file: "output.js",
    code: `// What ships to production — zero parsing
import { motion } from "motion/react"

<motion.div
  className="p-4 rounded-lg"
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  viewport={{ once: true }}
>
  Hello world
</motion.div>`,
  },
  nextjs: {
    title: "Next.js Setup",
    file: "next.config.js",
    code: `// One line to configure
import withMotionwind from "motionwind-react/next"

export default withMotionwind({
  // your existing Next.js config
})

// Works with both Turbopack and webpack
// No --webpack flag needed`,
  },
  vite: {
    title: "Vite Setup",
    file: "vite.config.ts",
    code: `// Add before react() in plugins
import motionwind from "motionwind-react/vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [
    motionwind(),
    react()
  ]
})`,
  },
  syntax: {
    title: "Syntax Pattern",
    file: "examples.tsx",
    code: `// The universal pattern
// animate-{gesture}:{property}-{value}

// Gestures: hover, tap, focus, inview,
//           drag, initial, enter, exit

// Hover effect
<div className="animate-hover:scale-110" />

// Scroll reveal
<div className="
  animate-initial:opacity-0
  animate-inview:opacity-100
  animate-once
" />

// Exit animation
<div className="animate-exit:x-100pct" />`,
  },
  features: {
    title: "All Features",
    file: "features.tsx",
    code: `// Spring physics
<div className="
  animate-spring
  animate-stiffness-400
  animate-damping-15
  animate-bounce-20
" />

// Drag with constraints
<div className="
  animate-drag-both
  animate-drag-elastic-30
  animate-drag-snap
" />

// Keyframe arrays
<div className="
  animate-enter:scale-[100,120,100]
  animate-repeat-infinite
" />

// Arbitrary values
<div className="
  animate-hover:[backgroundColor=#4f46e5]
" />`,
  },
};

type CodeKey = keyof typeof CODE_EXAMPLES;

/* ────────────────────────────────────────────────────────────────────
 *  SYNTAX HIGHLIGHTING — simple regex-based highlighter
 * ──────────────────────────────────────────────────────────────────── */
function highlightCode(code: string) {
  const lines = code.split("\n");
  return lines.map((line, i) => {
    // Comments
    if (line.trimStart().startsWith("//")) {
      return (
        <span key={i}>
          <span className="text-white/25">{line}</span>
          {"\n"}
        </span>
      );
    }

    // Process the line character by character for proper highlighting
    let result: React.ReactNode[] = [];
    let remaining = line;
    let keyIdx = 0;

    while (remaining.length > 0) {
      // animate-* classes (acid green, bold)
      const animateMatch = remaining.match(/^(animate-[\w:.\-\[\],]+)/);
      if (animateMatch) {
        result.push(
          <span key={`${i}-${keyIdx++}`} className="text-acid font-semibold">
            {animateMatch[1]}
          </span>
        );
        remaining = remaining.slice(animateMatch[1]!.length);
        continue;
      }

      // JSX tags: <tag or </tag or <Tag
      const tagMatch = remaining.match(/^(<\/?)([\w.]+)/);
      if (tagMatch) {
        result.push(
          <span key={`${i}-${keyIdx++}`} className="text-white/30">
            {tagMatch[1]}
          </span>
        );
        result.push(
          <span key={`${i}-${keyIdx++}`} className="text-pink-400">
            {tagMatch[2]}
          </span>
        );
        remaining = remaining.slice(tagMatch[0].length);
        continue;
      }

      // Closing >
      const closeMatch = remaining.match(/^(\/?>)/);
      if (closeMatch) {
        result.push(
          <span key={`${i}-${keyIdx++}`} className="text-white/30">
            {closeMatch[1]}
          </span>
        );
        remaining = remaining.slice(closeMatch[1]!.length);
        continue;
      }

      // Strings (double-quoted)
      const strMatch = remaining.match(/^"([^"]*)"/);
      if (strMatch) {
        result.push(
          <span key={`${i}-${keyIdx++}`} className="text-amber-300">
            {`"${strMatch[1]}"`}
          </span>
        );
        remaining = remaining.slice(strMatch[0].length);
        continue;
      }

      // Template literal markers
      const tmplMatch = remaining.match(/^(`|\$\{|\})/);
      if (tmplMatch) {
        result.push(
          <span key={`${i}-${keyIdx++}`} className="text-amber-300">
            {tmplMatch[1]}
          </span>
        );
        remaining = remaining.slice(tmplMatch[1]!.length);
        continue;
      }

      // Keywords
      const kwMatch = remaining.match(
        /^(import|from|export|default|const|let|function|return|className)\b/
      );
      if (kwMatch) {
        result.push(
          <span key={`${i}-${keyIdx++}`} className="text-acid/80">
            {kwMatch[1]}
          </span>
        );
        remaining = remaining.slice(kwMatch[1]!.length);
        continue;
      }

      // Braces / parens / operators
      const punctMatch = remaining.match(/^([{}()=:;,?])/);
      if (punctMatch) {
        result.push(
          <span key={`${i}-${keyIdx++}`} className="text-white/30">
            {punctMatch[1]}
          </span>
        );
        remaining = remaining.slice(1);
        continue;
      }

      // Tailwind / plain classes inside className (dimmed)
      const twMatch = remaining.match(
        /^(rounded-[\w-]+|bg-[\w/.-]+|px-\d+|py-\d+|p-\d+|w-[\w-]+|h-[\w-]+|text-[\w-]+)/
      );
      if (twMatch) {
        result.push(
          <span key={`${i}-${keyIdx++}`} className="text-white/30">
            {twMatch[1]}
          </span>
        );
        remaining = remaining.slice(twMatch[1]!.length);
        continue;
      }

      // Default character
      result.push(
        <span key={`${i}-${keyIdx++}`} className="text-white/60">
          {remaining[0]}
        </span>
      );
      remaining = remaining.slice(1);
    }

    return (
      <span key={i}>
        {result}
        {"\n"}
      </span>
    );
  });
}

/* ────────────────────────────────────────────────────────────────────
 *  PAGE COMPONENT
 * ──────────────────────────────────────────────────────────────────── */
export default function Home() {
  const [codeOpen, setCodeOpen] = useState(false);
  const [activeCode, setActiveCode] = useState<CodeKey>("hover");

  const openCode = useCallback((key: CodeKey) => {
    setActiveCode(key);
    setCodeOpen(true);
  }, []);

  // Close drawer on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCodeOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="grain">
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       *  INTERACTIVE HINT BANNER — tells users to click for code
       * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="animate-initial:opacity-0 animate-enter:opacity-100 animate-duration-800 animate-delay-1200 animate-ease-out sticky top-0 z-30 w-full">
        <div className="relative overflow-hidden border-b border-white/[0.06] bg-surface/80 backdrop-blur-xl">
          {/* Animated shimmer line */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 animate-glow-line bg-gradient-to-r from-transparent via-acid/[0.07] to-transparent" />
          </div>
          <div className="relative flex items-center justify-center gap-3 px-4 py-2.5">
            {/* Pulse dot */}
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full rounded-full bg-acid opacity-60 animate-pulse-glow" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-acid" />
            </span>
            <p className="text-[11px] sm:text-xs text-text-dim tracking-wide">
              <span className="text-white/70 font-medium">Hover & click</span> any component or section to see its motionwind code
              <span className="hidden sm:inline text-text-muted"> — the code panel slides in from the right</span>
            </p>
            {/* Animated arrow icon */}
            <svg className="w-4 h-4 text-acid/50 hidden sm:block animate-bounce-x" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
            </svg>
          </div>
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       *  HERO
       * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 overflow-hidden glow-top">
        <div className="grid-bg absolute inset-0 pointer-events-none" />

        <div className="relative z-10 w-full max-w-4xl mx-auto">
              <div className="flex flex-col items-center justify-center px-6 sm:px-10 py-12 sm:py-16 relative">
                {/* Badge */}
                <div className="animate-initial:opacity-0 animate-initial:y-12 animate-enter:opacity-100 animate-enter:y-0 animate-duration-600 animate-ease-out mb-6 sm:mb-8">
                  <span className="inline-flex items-center gap-2 rounded-full border border-acid/20 bg-acid/5 px-3 sm:px-4 py-1.5 text-[10px] sm:text-xs font-medium tracking-wide text-acid uppercase">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-acid opacity-75 animate-pulse-glow" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-acid" />
                    </span>
                    v0.3 — Now in Public Beta
                  </span>
                </div>

                {/* Headline */}
                <h1 className="animate-initial:opacity-0 animate-initial:y-20 animate-enter:opacity-100 animate-enter:y-0 animate-duration-700 animate-ease-out text-center max-w-3xl">
                  <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.92]">
                    Animations in
                  </span>
                  <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.92] text-acid mt-2 sm:mt-3 relative">
                    class names.
                    {/* Hand-drawn underline */}
                    <svg
                      className="absolute -bottom-2 left-0 w-full h-4 text-acid/40"
                      viewBox="0 0 400 16"
                      fill="none"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M2 10C60 6 140 4 200 8C260 12 340 6 398 10"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        fill="none"
                      />
                    </svg>
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="animate-initial:opacity-0 animate-initial:y-20 animate-enter:opacity-100 animate-enter:y-0 animate-duration-700 animate-delay-200 animate-ease-out mt-6 sm:mt-8 text-base sm:text-lg text-text-dim max-w-lg text-center leading-relaxed">
                  Write Motion animations as Tailwind-like utility classes.
                  Transformed at build time. Zero runtime overhead. No imports
                  needed.
                </p>

                {/* CTA Buttons */}
                <div className="animate-initial:opacity-0 animate-initial:y-20 animate-enter:opacity-100 animate-enter:y-0 animate-duration-700 animate-delay-400 animate-ease-out flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 sm:mt-10">
                  <button
                    onClick={() => openCode("compiled")}
                    onMouseEnter={() => {
                      setActiveCode("compiled");
                      setCodeOpen(true);
                    }}
                    className="animate-hover:scale-105 animate-tap:scale-95 animate-spring animate-stiffness-300 animate-damping-20 group inline-flex items-center gap-2 rounded-lg bg-acid px-5 sm:px-6 py-3 text-sm font-semibold text-gray-950 transition-shadow hover:shadow-[0_0_30px_#c8ff2e40] cursor-pointer"
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
                  </button>
                  <a
                    href="https://github.com/piyushzingade/motionwind"
                    className="animate-hover:scale-105 animate-tap:scale-95 animate-spring animate-stiffness-300 animate-damping-20 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-5 sm:px-6 py-3 text-sm font-medium text-white/80 backdrop-blur-sm transition-colors hover:bg-white/10 hover:text-white"
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

                  {/* Hero Code Block */}
                <div className="animate-initial:opacity-0 animate-initial:y-30 animate-enter:opacity-100 animate-enter:y-0 animate-duration-800 animate-delay-500 animate-ease-out mt-10 sm:mt-14 w-full max-w-xl">
                  <div className="rounded-xl border border-white/[0.06] bg-surface-raised/80 backdrop-blur-xl shadow-2xl shadow-black/50 overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-white/10" />
                        <div className="w-3 h-3 rounded-full bg-white/10" />
                        <div className="w-3 h-3 rounded-full bg-white/10" />
                      </div>
                      <span className="ml-3 text-xs text-text-muted font-[family-name:var(--font-geist-mono)]">
                        App.tsx
                      </span>
                    </div>
                    <pre className="p-5 text-sm leading-7 font-[family-name:var(--font-geist-mono)] overflow-x-auto">
                      <code>
                        <span className="text-white/25">
                          {"// Just add classes. That's it."}
                        </span>
                        {"\n"}
                        <span className="text-white/30">{"<"}</span>
                        <span className="text-pink-400">{"button"}</span>
                        {"\n"}
                        {"  "}
                        <span className="text-acid/80">{"className"}</span>
                        <span className="text-white/30">{"="}</span>
                        <span className="text-amber-300">{'"'}</span>
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
                        <span className="text-acid font-semibold">
                          {"animate-spring"}
                        </span>
                        {"\n"}
                        {"    "}
                        <span className="text-white/30">
                          {"rounded-xl bg-white px-6 py-3"}
                        </span>
                        {"\n"}
                        {"  "}
                        <span className="text-amber-300">{'"'}</span>
                        {"\n"}
                        <span className="text-white/30">{">"}</span>
                        {"\n"}
                        {"  Click me"}
                        {"\n"}
                        <span className="text-white/30">{"</"}</span>
                        <span className="text-pink-400">{"button"}</span>
                        <span className="text-white/30">{">"}</span>
                      </code>
                    </pre>
                  </div>
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-acid/10 blur-3xl rounded-full" />
                </div>
              </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       *  LIVE DEMOS — full-width browser-preview cards
       * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="section-divider mx-auto max-w-4xl" />

      <section className="relative py-20 sm:py-24 px-4 sm:px-6 overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <div className="animate-initial:opacity-0 animate-initial:y-20 animate-inview:opacity-100 animate-inview:y-0 animate-duration-600 animate-ease-out animate-once text-center mb-12 sm:mb-16">
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-acid/70 mb-4 block">
              Interactive Playground
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              Feel the difference
            </h2>
            <p className="mt-4 text-text-dim text-base sm:text-lg max-w-xl mx-auto">
              Every preview below is powered by motionwind classes. Interact to feel them live.
            </p>
          </div>

          <div className="flex flex-col gap-8">
            {/* ── SEARCH BAR FOCUS ── */}
            <div
              onClick={() => openCode("scroll")}
              className="animate-initial:opacity-0 animate-initial:y-20 animate-inview:opacity-100 animate-inview:y-0 animate-duration-500 animate-ease-out animate-once preview-card cursor-pointer"
            >
              <div className="preview-titlebar">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-acid opacity-60 animate-pulse-glow" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-acid" />
                  </span>
                  <span className="text-[11px] font-medium tracking-[0.15em] uppercase text-text-dim">Search Bar Focus</span>
                </div>
                <svg className="w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M2.985 19.644l3.181-3.182" /></svg>
              </div>
              <div className="preview-stage">
                <input
                  type="text"
                  placeholder="Search..."
                  onClick={(e) => e.stopPropagation()}
                  className="animate-focus:scale-105 animate-focus:y--2 animate-spring animate-stiffness-300 animate-damping-20 w-full max-w-md rounded-xl bg-white/[0.06] border border-white/[0.1] px-5 py-3 text-sm text-white/90 placeholder:text-white/30 outline-none focus:border-acid/40 focus:ring-2 focus:ring-acid/20 focus:shadow-[0_0_20px_rgba(199,255,45,0.1)] transition-[border-color,box-shadow]"
                />
              </div>
              <div className="preview-code">
                <code className="text-[11px] font-[family-name:var(--font-geist-mono)]">
                  <span className="text-acid">animate-focus:scale-105</span>
                  <span className="text-text-muted mx-2">·</span>
                  <span className="text-acid">animate-focus:y--2</span>
                  <span className="text-text-muted mx-2">·</span>
                  <span className="text-acid">animate-spring</span>
                  <span className="text-text-muted mx-2">·</span>
                  <span className="text-acid">animate-stiffness-300</span>
                </code>
              </div>
            </div>

            {/* ── ALL GESTURE STATES ── */}
            <div
              onClick={() => openCode("hover")}
              className="animate-initial:opacity-0 animate-initial:y-20 animate-inview:opacity-100 animate-inview:y-0 animate-duration-500 animate-delay-100 animate-ease-out animate-once preview-card cursor-pointer"
            >
              <div className="preview-titlebar">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-acid opacity-60 animate-pulse-glow" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-acid" />
                  </span>
                  <span className="text-[11px] font-medium tracking-[0.15em] uppercase text-text-dim">All Gesture States</span>
                </div>
                <svg className="w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M2.985 19.644l3.181-3.182" /></svg>
              </div>
              <div className="preview-stage">
                <div className="animate-hover:scale-110 animate-tap:scale-90 animate-spring animate-stiffness-400 animate-damping-15 px-8 py-4 rounded-xl bg-acid/15 border border-acid/25 text-sm text-acid font-semibold select-none cursor-pointer shadow-[0_0_24px_rgba(200,255,46,0.06)]">
                  Hover me, or tap me
                </div>
              </div>
              <div className="preview-code">
                <code className="text-[11px] font-[family-name:var(--font-geist-mono)]">
                  <span className="text-acid">animate-hover:scale-110</span>
                  <span className="text-text-muted mx-2">·</span>
                  <span className="text-acid">animate-tap:scale-90</span>
                  <span className="text-text-muted mx-2">·</span>
                  <span className="text-acid">animate-spring</span>
                </code>
              </div>
            </div>

            {/* ── GESTURE REFERENCE TABLE ── */}
            <div
              onClick={() => openCode("syntax")}
              className="animate-initial:opacity-0 animate-initial:y-20 animate-inview:opacity-100 animate-inview:y-0 animate-duration-500 animate-delay-200 animate-ease-out animate-once preview-card cursor-pointer"
            >
              <div className="preview-titlebar">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-acid opacity-60 animate-pulse-glow" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-acid" />
                  </span>
                  <span className="text-[11px] font-medium tracking-[0.15em] uppercase text-text-dim">All Gesture Prefixes</span>
                </div>
                <svg className="w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M2.985 19.644l3.181-3.182" /></svg>
              </div>
              <div className="px-5 sm:px-6 py-4 bg-surface/50 rounded-b-2xl">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/[0.08]">
                      <th className="pb-3 text-[10px] font-semibold tracking-[0.15em] uppercase text-text-muted w-24">Gesture</th>
                      <th className="pb-3 text-[10px] font-semibold tracking-[0.15em] uppercase text-text-muted w-44">Prefix</th>
                      <th className="pb-3 text-[10px] font-semibold tracking-[0.15em] uppercase text-text-muted">Use Case</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {[
                      ["Hover", "animate-hover:", "Buttons, cards, links, any pointer interaction"],
                      ["Tap", "animate-tap:", "Button press feedback, click effects"],
                      ["Focus", "animate-focus:", "Form inputs, accessibility focus indicators"],
                      ["Drag", "animate-drag:", "Draggable elements, sliders, sortable items"],
                      ["InView", "animate-inview:", "Scroll-triggered reveals, lazy animations"],
                      ["Initial", "animate-initial:", "Starting state for enter/inview animations"],
                      ["Enter", "animate-enter:", "Target state on mount"],
                      ["Exit", "animate-exit:", "Target state on unmount (requires AnimatePresence)"],
                    ].map(([gesture, prefix, useCase], i) => (
                      <tr key={gesture} className={`border-b border-white/[0.04] ${i % 2 === 0 ? "bg-white/[0.02]" : ""}`}>
                        <td className="py-3 text-white/80 font-medium text-xs">{gesture}</td>
                        <td className="py-3">
                          <code className="text-[11px] font-[family-name:var(--font-geist-mono)] text-acid bg-acid/10 px-2 py-1 rounded">{prefix}</code>
                        </td>
                        <td className="py-3 text-xs text-text-muted">{useCase}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── SCROLL REVEAL (FADE UP) ── */}
            <div
              onClick={() => openCode("scroll")}
              className="animate-initial:opacity-0 animate-initial:y-20 animate-inview:opacity-100 animate-inview:y-0 animate-duration-500 animate-delay-300 animate-ease-out animate-once preview-card cursor-pointer"
            >
              <div className="preview-titlebar">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-acid opacity-60 animate-pulse-glow" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-acid" />
                  </span>
                  <span className="text-[11px] font-medium tracking-[0.15em] uppercase text-text-dim">Scroll Reveal (Fade Up)</span>
                </div>
                <svg className="w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M2.985 19.644l3.181-3.182" /></svg>
              </div>
              <div className="preview-stage">
                <div className="animate-initial:opacity-0 animate-initial:y-20 animate-inview:opacity-100 animate-inview:y-0 animate-duration-500 animate-once px-10 py-5 rounded-xl bg-acid/15 border border-acid/25 text-sm text-acid font-semibold shadow-[0_0_24px_rgba(200,255,46,0.06)]">
                  I appear on scroll
                </div>
              </div>
              <div className="preview-code">
                <code className="text-[11px] font-[family-name:var(--font-geist-mono)]">
                  <span className="text-acid">animate-initial:opacity-0</span>
                  <span className="text-text-muted mx-2">·</span>
                  <span className="text-acid">animate-initial:y-20</span>
                  <span className="text-text-muted mx-2">·</span>
                  <span className="text-acid">animate-inview:opacity-100</span>
                  <span className="text-text-muted mx-2">·</span>
                  <span className="text-acid">animate-inview:y-0</span>
                  <span className="text-text-muted mx-2">·</span>
                  <span className="text-acid">animate-once</span>
                </code>
              </div>
            </div>

            {/* ── DRAG INTERACTION ── */}
            <div
              onClick={() => openCode("drag")}
              className="animate-initial:opacity-0 animate-initial:y-20 animate-inview:opacity-100 animate-inview:y-0 animate-duration-500 animate-delay-100 animate-ease-out animate-once preview-card cursor-pointer"
            >
              <div className="preview-titlebar">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-acid opacity-60 animate-pulse-glow" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-acid" />
                  </span>
                  <span className="text-[11px] font-medium tracking-[0.15em] uppercase text-text-dim">Drag Interaction</span>
                </div>
                <svg className="w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M2.985 19.644l3.181-3.182" /></svg>
              </div>
              <div className="preview-stage">
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="animate-drag-both animate-drag-elastic-30 animate-drag-snap animate-hover:scale-105 animate-spring px-8 py-4 rounded-xl bg-acid/15 border border-acid/25 text-sm text-acid font-semibold cursor-grab active:cursor-grabbing select-none shadow-[0_0_24px_rgba(200,255,46,0.06)]"
                >
                  Drag me around
                </div>
              </div>
              <div className="preview-code">
                <code className="text-[11px] font-[family-name:var(--font-geist-mono)]">
                  <span className="text-acid">animate-drag-both</span>
                  <span className="text-text-muted mx-2">·</span>
                  <span className="text-acid">animate-drag-elastic-30</span>
                  <span className="text-text-muted mx-2">·</span>
                  <span className="text-acid">animate-drag-snap</span>
                </code>
              </div>
            </div>

            {/* ── INFINITE ROTATION ── */}
            <div
              onClick={() => openCode("loop")}
              className="animate-initial:opacity-0 animate-initial:y-20 animate-inview:opacity-100 animate-inview:y-0 animate-duration-500 animate-delay-200 animate-ease-out animate-once preview-card cursor-pointer"
            >
              <div className="preview-titlebar">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-acid opacity-60 animate-pulse-glow" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-acid" />
                  </span>
                  <span className="text-[11px] font-medium tracking-[0.15em] uppercase text-text-dim">Infinite Rotation</span>
                </div>
                <svg className="w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M2.985 19.644l3.181-3.182" /></svg>
              </div>
              <div className="preview-stage">
                <div className="animate-initial:rotate-0 animate-enter:rotate-360 animate-duration-2000 animate-ease-linear animate-repeat-infinite w-16 h-16 rounded-xl bg-acid/15 border border-acid/25 flex items-center justify-center shadow-[0_0_24px_rgba(200,255,46,0.06)]">
                  <svg className="w-6 h-6 text-acid" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M2.985 19.644l3.181-3.182" /></svg>
                </div>
              </div>
              <div className="preview-code">
                <code className="text-[11px] font-[family-name:var(--font-geist-mono)]">
                  <span className="text-acid">animate-enter:rotate-360</span>
                  <span className="text-text-muted mx-2">·</span>
                  <span className="text-acid">animate-repeat-infinite</span>
                  <span className="text-text-muted mx-2">·</span>
                  <span className="text-acid">animate-ease-linear</span>
                </code>
              </div>
            </div>

            {/* ── SPRING PHYSICS ── */}
            <div
              onClick={() => openCode("spring")}
              className="animate-initial:opacity-0 animate-initial:y-20 animate-inview:opacity-100 animate-inview:y-0 animate-duration-500 animate-delay-300 animate-ease-out animate-once preview-card cursor-pointer"
            >
              <div className="preview-titlebar">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-acid opacity-60 animate-pulse-glow" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-acid" />
                  </span>
                  <span className="text-[11px] font-medium tracking-[0.15em] uppercase text-text-dim">Spring Physics</span>
                </div>
                <svg className="w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M2.985 19.644l3.181-3.182" /></svg>
              </div>
              <div className="preview-stage">
                <div className="animate-hover:rotate-12 animate-hover:scale-115 animate-tap:rotate-0 animate-tap:scale-85 animate-spring animate-stiffness-200 animate-damping-8 px-8 py-4 rounded-xl bg-acid/15 border border-acid/25 text-sm text-acid font-semibold cursor-pointer select-none shadow-[0_0_24px_rgba(200,255,46,0.06)]">
                  Hover for springy bounce
                </div>
              </div>
              <div className="preview-code">
                <code className="text-[11px] font-[family-name:var(--font-geist-mono)]">
                  <span className="text-acid">animate-spring</span>
                  <span className="text-text-muted mx-2">·</span>
                  <span className="text-acid">animate-stiffness-200</span>
                  <span className="text-text-muted mx-2">·</span>
                  <span className="text-acid">animate-damping-8</span>
                  <span className="text-text-muted mx-2">·</span>
                  <span className="text-acid">animate-hover:scale-115</span>
                </code>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider mx-auto max-w-4xl" />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       *  HOW IT WORKS
       * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="relative py-20 sm:py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="animate-initial:opacity-0 animate-initial:y-20 animate-inview:opacity-100 animate-inview:y-0 animate-duration-600 animate-ease-out animate-once text-center mb-12 sm:mb-16">
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-acid/70 mb-4 block">
              How It Works
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              Build time, not runtime
            </h2>
            <p className="mt-4 text-text-dim text-base sm:text-lg max-w-xl mx-auto">
              A Babel plugin reads your classes and emits optimized Motion
              components. Your users never pay for parsing.
            </p>
          </div>

          {/* Before / After Code */}
          <div
            onClick={() => openCode("compiled")}
            className="animate-initial:opacity-0 animate-initial:y-20 animate-inview:opacity-100 animate-inview:y-0 animate-duration-600 animate-ease-out animate-once relative grid md:grid-cols-[1fr_auto_1fr] gap-0 items-stretch cursor-pointer group/code"
          >
            {/* Click hint */}
            <div className="absolute -top-8 right-0 text-[10px] text-text-muted opacity-0 group-hover/code:opacity-100 transition-opacity flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>
              Click to see compiled output
            </div>
            {/* BEFORE */}
            <div className="rounded-xl border border-white/[0.06] bg-surface-raised overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                <span className="text-xs font-medium text-acid">
                  What you write
                </span>
                <span className="text-[10px] text-text-muted font-[family-name:var(--font-geist-mono)]">
                  source.tsx
                </span>
              </div>
              <pre className="p-4 sm:p-5 text-[12px] sm:text-[13px] leading-7 font-[family-name:var(--font-geist-mono)] overflow-x-auto">
                <code>
                  <span className="text-white/25">
                    {"// No imports needed"}
                  </span>
                  {"\n"}
                  <span className="text-white/30">{"<"}</span>
                  <span className="text-pink-400">{"div"}</span>
                  {"\n"}
                  {"  "}
                  <span className="text-acid/80">{"className"}</span>
                  <span className="text-white/30">{"="}</span>
                  <span className="text-amber-300">{'"'}</span>
                  {"\n"}
                  {"    "}
                  <span className="text-acid">
                    {"animate-initial:opacity-0"}
                  </span>
                  {"\n"}
                  {"    "}
                  <span className="text-acid">{"animate-initial:y-20"}</span>
                  {"\n"}
                  {"    "}
                  <span className="text-acid">
                    {"animate-inview:opacity-100"}
                  </span>
                  {"\n"}
                  {"    "}
                  <span className="text-acid">{"animate-inview:y-0"}</span>
                  {"\n"}
                  {"    "}
                  <span className="text-acid">{"animate-duration-500"}</span>
                  {"\n"}
                  {"    "}
                  <span className="text-acid">{"animate-once"}</span>
                  {"\n"}
                  {"    "}
                  <span className="text-white/30">{"p-4 rounded-lg"}</span>
                  {"\n"}
                  {"  "}
                  <span className="text-amber-300">{'"'}</span>
                  {"\n"}
                  <span className="text-white/30">{">"}</span>
                  {"\n"}
                  {"  Hello world"}
                  {"\n"}
                  <span className="text-white/30">{"</"}</span>
                  <span className="text-pink-400">{"div"}</span>
                  <span className="text-white/30">{">"}</span>
                </code>
              </pre>
            </div>

            {/* Arrow connector (desktop) */}
            <div className="hidden md:flex items-center justify-center px-4">
              <div className="flex flex-col items-center gap-2">
                <div className="w-px h-8 bg-gradient-to-b from-transparent to-acid/30" />
                <div className="w-8 h-8 rounded-full border border-acid/20 bg-acid/5 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-acid"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </div>
                <div className="w-px h-8 bg-gradient-to-b from-acid/30 to-transparent" />
              </div>
            </div>
            {/* Arrow (mobile) */}
            <div className="flex md:hidden items-center justify-center py-3">
              <div className="w-8 h-8 rounded-full border border-acid/20 bg-acid/5 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-acid rotate-90"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </div>
            </div>

            {/* AFTER */}
            <div className="rounded-xl border border-white/[0.06] bg-surface-raised overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                <span className="text-xs font-medium text-text-dim">
                  What gets compiled
                </span>
                <span className="text-[10px] text-text-muted font-[family-name:var(--font-geist-mono)]">
                  output.js
                </span>
              </div>
              <pre className="p-4 sm:p-5 text-[12px] sm:text-[13px] leading-7 font-[family-name:var(--font-geist-mono)] overflow-x-auto">
                <code>
                  <span className="text-white/25">
                    {"// Auto-injected by Babel"}
                  </span>
                  {"\n"}
                  <span className="text-acid/80">{"import"}</span>
                  {" { "}
                  <span className="text-white">{"motion"}</span>
                  {" } "}
                  <span className="text-acid/80">{"from"}</span>{" "}
                  <span className="text-amber-300">{'"motion/react"'}</span>
                  {"\n\n"}
                  <span className="text-white/30">{"<"}</span>
                  <span className="text-purple-400">{"motion.div"}</span>
                  {"\n"}
                  {"  "}
                  <span className="text-acid/80">{"className"}</span>
                  <span className="text-white/30">{"="}</span>
                  <span className="text-amber-300">{'"p-4 rounded-lg"'}</span>
                  {"\n"}
                  {"  "}
                  <span className="text-acid/80">{"initial"}</span>
                  <span className="text-white/30">{"={"}</span>
                  {"{ "}
                  <span className="text-white">{"opacity: 0, y: 20"}</span>
                  {" }"}
                  <span className="text-white/30">{"}"}</span>
                  {"\n"}
                  {"  "}
                  <span className="text-acid/80">{"whileInView"}</span>
                  <span className="text-white/30">{"={"}</span>
                  {"{ "}
                  <span className="text-white">{"opacity: 1, y: 0"}</span>
                  {" }"}
                  <span className="text-white/30">{"}"}</span>
                  {"\n"}
                  {"  "}
                  <span className="text-acid/80">{"transition"}</span>
                  <span className="text-white/30">{"={"}</span>
                  {"{ "}
                  <span className="text-white">{"duration: 0.5"}</span>
                  {" }"}
                  <span className="text-white/30">{"}"}</span>
                  {"\n"}
                  {"  "}
                  <span className="text-acid/80">{"viewport"}</span>
                  <span className="text-white/30">{"={"}</span>
                  {"{ "}
                  <span className="text-white">{"once: true"}</span>
                  {" }"}
                  <span className="text-white/30">{"}"}</span>
                  {"\n"}
                  <span className="text-white/30">{">"}</span>
                  {"\n"}
                  {"  Hello world"}
                  {"\n"}
                  <span className="text-white/30">{"</"}</span>
                  <span className="text-purple-400">{"motion.div"}</span>
                  <span className="text-white/30">{">"}</span>
                </code>
              </pre>
            </div>
          </div>

          {/* Process steps */}
          <div className="mt-12 sm:mt-16 grid sm:grid-cols-3 gap-6 sm:gap-4">
            {[
              {
                num: "1",
                title: "Write classes",
                desc: "Add motionwind classes to any element or component. No imports, no wrappers.",
                code: "animate-hover:scale-110",
                delay: "",
              },
              {
                num: "2",
                title: "Babel transforms",
                desc: "At build time, classes are parsed and converted to Motion component props.",
                code: "whileHover={{ scale: 1.1 }}",
                delay: "animate-delay-150",
              },
              {
                num: "3",
                title: "Ship zero overhead",
                desc: "Production bundle contains only optimized Motion components. No parser shipped.",
                code: "0kb runtime added",
                delay: "animate-delay-300",
              },
            ].map((step, i) => (
              <div
                key={step.num}
                className={`animate-initial:opacity-0 animate-initial:y-15 animate-inview:opacity-100 animate-inview:y-0 animate-duration-500 ${step.delay} animate-ease-out animate-once relative rounded-xl border border-white/[0.06] bg-surface-raised p-5 sm:p-6`}
              >
                {/* Connector line between cards (desktop only) */}
                {i < 2 && (
                  <div className="hidden sm:block absolute top-1/2 -right-2 sm:-right-2 w-4 h-px bg-gradient-to-r from-acid/20 to-transparent z-10" />
                )}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg border border-acid/20 bg-acid/5 flex items-center justify-center text-acid text-xs font-bold font-[family-name:var(--font-geist-mono)] shrink-0">
                    {step.num}
                  </div>
                  <h3 className="text-sm font-semibold">{step.title}</h3>
                </div>
                <p className="text-xs text-text-muted leading-relaxed mb-3">
                  {step.desc}
                </p>
                <div className="rounded-md bg-white/[0.03] border border-white/[0.04] px-3 py-2">
                  <code className="text-[10px] font-[family-name:var(--font-geist-mono)] text-acid/70">
                    {step.code}
                  </code>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider mx-auto max-w-4xl" />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       *  FEATURES
       * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="relative py-20 sm:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div
            onClick={() => openCode("features")}
            className="animate-initial:opacity-0 animate-initial:y-20 animate-inview:opacity-100 animate-inview:y-0 animate-duration-600 animate-ease-out animate-once text-center mb-12 sm:mb-16 cursor-pointer group/feat"
          >
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-acid/70 mb-4 block">
              Features
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight group-hover/feat:text-acid/90 transition-colors">
              Everything you need
            </h2>
            <p className="mt-2 text-[11px] text-text-muted opacity-0 group-hover/feat:opacity-100 transition-opacity flex items-center gap-1 justify-center">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>
              Click to see code
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {[
              {
                icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z",
                title: "Zero Runtime",
                desc: "Static classes compiled away at build time. No parser, no overhead in production.",
              },
              {
                icon: "M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z",
                title: "Familiar Syntax",
                desc: "If you know Tailwind, you already know motionwind. Same utility-first approach.",
              },
              {
                icon: "M11.42 15.17l-5.385-5.383a1.855 1.855 0 010-2.627l.603-.606a1.855 1.855 0 012.627 0l2.252 2.251 5.146-5.147a1.855 1.855 0 012.627 0l.603.607a1.855 1.855 0 010 2.626L11.42 15.17z",
                title: "8 Gesture Types",
                desc: "Hover, tap, focus, in-view, drag, initial, enter, and exit gestures.",
              },
              {
                icon: "M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z",
                title: "Framework Ready",
                desc: "First-class integrations for Next.js and Vite. One line to configure.",
                icon2:
                  "M15 12a3 3 0 11-6 0 3 3 0 016 0z",
              },
              {
                icon: "M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.58-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z",
                title: "Spring Physics",
                desc: "Stiffness, damping, mass, and bounce — all controllable through classes.",
              },
              {
                icon: "M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5",
                title: "Drag Support",
                desc: "Enable dragging on any axis with elastic constraints.",
              },
              {
                icon: "M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5",
                title: "Custom Components",
                desc: "Works on <Card>, <Button>, any component. No mw.* wrappers needed.",
              },
              {
                icon: "M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3",
                title: "Template Literals",
                desc: "Static animate classes extracted from template literals at build time.",
              },
            ].map((f, i) => (
              <div
                key={f.title}
                className={`animate-initial:opacity-0 animate-initial:y-15 animate-inview:opacity-100 animate-inview:y-0 animate-duration-500 ${i > 0 ? `animate-delay-${Math.min(i, 4) * 100}` : ""} animate-ease-out animate-once animate-hover:y--2 group rounded-2xl border border-white/[0.06] bg-surface-raised p-5 sm:p-6 transition-colors hover:border-acid/10`}
              >
                <div className="w-10 h-10 rounded-xl bg-acid/10 flex items-center justify-center mb-4">
                  <svg
                    className="w-5 h-5 text-acid"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d={f.icon}
                    />
                    {(f as Record<string, string>).icon2 && (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d={(f as Record<string, string>).icon2}
                      />
                    )}
                  </svg>
                </div>
                <h3 className="text-sm font-semibold mb-2">{f.title}</h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider mx-auto max-w-4xl" />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       *  SYNTAX REFERENCE
       * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="relative py-20 sm:py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div
            onClick={() => openCode("syntax")}
            className="animate-initial:opacity-0 animate-initial:y-20 animate-inview:opacity-100 animate-inview:y-0 animate-duration-600 animate-ease-out animate-once text-center mb-12 sm:mb-16 cursor-pointer group/syn"
          >
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-acid/70 mb-4 block">
              Syntax
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight group-hover/syn:text-acid/90 transition-colors">
              One pattern, infinite motion
            </h2>
            <p className="mt-2 text-[11px] text-text-muted opacity-0 group-hover/syn:opacity-100 transition-opacity flex items-center gap-1 justify-center">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>
              Click to see examples
            </p>
          </div>

          <div className="animate-initial:opacity-0 animate-initial:y-20 animate-inview:opacity-100 animate-inview:y-0 animate-duration-600 animate-ease-out animate-once rounded-2xl border border-white/[0.06] bg-surface-raised overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-white/[0.06]">
              <div className="flex items-center justify-center">
                <code className="text-base sm:text-lg md:text-2xl font-[family-name:var(--font-geist-mono)] flex flex-wrap items-center gap-1 justify-center">
                  <span className="text-text-muted">animate-</span>
                  <span className="text-acid bg-acid/10 px-2 py-0.5 rounded">
                    {"{"}<span className="text-[10px] align-top">gesture</span>
                    {"}"}
                  </span>
                  <span className="text-text-muted">:</span>
                  <span className="text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                    {"{"}<span className="text-[10px] align-top">property</span>
                    {"}"}
                  </span>
                  <span className="text-text-muted">-</span>
                  <span className="text-fuchsia-400 bg-fuchsia-400/10 px-2 py-0.5 rounded">
                    {"{"}<span className="text-[10px] align-top">value</span>
                    {"}"}
                  </span>
                </code>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                {[
                  ["hover:", "whileHover"],
                  ["tap:", "whileTap"],
                  ["focus:", "whileFocus"],
                  ["inview:", "whileInView"],
                  ["drag:", "whileDrag"],
                  ["initial:", "initial"],
                  ["enter:", "animate"],
                  ["exit:", "exit"],
                ].map(([prefix, prop]) => (
                  <div
                    key={prefix}
                    className="rounded-lg bg-surface/50 border border-white/[0.04] p-3 text-center"
                  >
                    <code className="text-xs font-[family-name:var(--font-geist-mono)] text-acid">
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

      <div className="section-divider mx-auto max-w-4xl" />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       *  GET STARTED
       * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="relative py-20 sm:py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="animate-initial:opacity-0 animate-initial:y-20 animate-inview:opacity-100 animate-inview:y-0 animate-duration-600 animate-ease-out animate-once">
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-acid/70 mb-4 block">
              Get Started
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              Up and running in
              <span className="text-acid"> 30 seconds</span>
            </h2>
            <p className="mt-4 text-text-dim text-base sm:text-lg max-w-xl mx-auto">
              One command to install. One line to configure. Start animating
              immediately.
            </p>
          </div>

          <div className="animate-initial:opacity-0 animate-initial:y-15 animate-inview:opacity-100 animate-inview:y-0 animate-duration-500 animate-delay-200 animate-ease-out animate-once mt-10 sm:mt-12">
            <div className="inline-flex items-center gap-4 rounded-xl border border-white/[0.08] bg-surface-raised/80 backdrop-blur-sm px-6 sm:px-8 py-4 shadow-lg shadow-black/20">
              <span className="text-acid/80 font-[family-name:var(--font-geist-mono)] text-sm select-none">
                $
              </span>
              <code className="text-sm sm:text-[15px] font-[family-name:var(--font-geist-mono)] text-white/90 tracking-tight">
                <Typewriter text="npm i motionwind-react" />
              </code>
            </div>
          </div>

          {/* Framework configs */}
          <div className="animate-initial:opacity-0 animate-initial:y-15 animate-inview:opacity-100 animate-inview:y-0 animate-duration-500 animate-delay-300 animate-ease-out animate-once mt-8 sm:mt-10 grid sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
            <div onClick={() => openCode("nextjs")} className="rounded-xl border border-white/[0.08] bg-surface-raised overflow-hidden text-left cursor-pointer hover:border-acid/20 transition-colors">
              <div className="flex items-center gap-2.5 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
                <svg
                  className="w-4 h-4 text-white/70"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 1-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 0 0-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 0 1-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 0 1-.157-.171l-.05-.106.006-4.703.007-4.705.072-.092a.645.645 0 0 1 .174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 0 0 4.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 0 0 2.466-2.163 11.944 11.944 0 0 0 2.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.86-8.292-8.208-9.695a12.597 12.597 0 0 0-2.499-.523A33.119 33.119 0 0 0 11.572 0zm4.069 7.217c.347 0 .408.005.486.047a.473.473 0 0 1 .237.277c.018.06.023 1.365.018 4.304l-.006 4.218-.744-1.14-.746-1.14v-3.066c0-1.982.01-3.097.023-3.15a.478.478 0 0 1 .233-.296c.096-.05.13-.054.5-.054z" />
                </svg>
                <span className="text-xs font-semibold text-white/90">
                  Next.js
                </span>
                <span className="ml-auto text-[10px] text-text-muted font-[family-name:var(--font-geist-mono)]">
                  next.config.js
                </span>
              </div>
              <pre className="px-4 py-4 text-[12px] leading-6 font-[family-name:var(--font-geist-mono)] text-white/60">
                <code>
                  <span className="text-acid/70">import</span>{" "}
                  <span className="text-white/80">withMotionwind</span>{" "}
                  <span className="text-acid/70">from</span>{" "}
                  <span className="text-amber-400/70">
                    {'"motionwind/next"'}
                  </span>
                  {"\n"}
                  <span className="text-acid/70">export default</span>{" "}
                  <span className="text-white/80">withMotionwind</span>(config)
                </code>
              </pre>
            </div>
            <div onClick={() => openCode("vite")} className="rounded-xl border border-white/[0.08] bg-surface-raised overflow-hidden text-left cursor-pointer hover:border-acid/20 transition-colors">
              <div className="flex items-center gap-2.5 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
                <svg
                  className="w-4 h-4 text-white/70"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0L1.608 6v12L12 24l10.392-6V6L12 0zm-1.073 1.445h.001a1.8 1.8 0 0 1 2.138 0l7.534 4.35a1.794 1.794 0 0 1 .9 1.554v8.706c0 .641-.34 1.234-.9 1.554l-7.534 4.35a1.8 1.8 0 0 1-2.139 0l-7.534-4.35a1.794 1.794 0 0 1-.9-1.554V7.35c0-.642.34-1.234.9-1.554l7.534-4.35z" />
                </svg>
                <span className="text-xs font-semibold text-white/90">
                  Vite
                </span>
                <span className="ml-auto text-[10px] text-text-muted font-[family-name:var(--font-geist-mono)]">
                  vite.config.ts
                </span>
              </div>
              <pre className="px-4 py-4 text-[12px] leading-6 font-[family-name:var(--font-geist-mono)] text-white/60">
                <code>
                  <span className="text-acid/70">import</span>{" "}
                  <span className="text-white/80">motionwind</span>{" "}
                  <span className="text-acid/70">from</span>{" "}
                  <span className="text-amber-400/70">
                    {'"motionwind/vite"'}
                  </span>
                  {"\n"}
                  <span className="text-acid/70">plugins:</span> [
                  <span className="text-white/80">motionwind</span>(),{" "}
                  <span className="text-white/80">react</span>()]
                </code>
              </pre>
            </div>
          </div>

          {/* Final CTA */}
          <div className="animate-initial:opacity-0 animate-initial:y-15 animate-inview:opacity-100 animate-inview:y-0 animate-duration-500 animate-delay-400 animate-ease-out animate-once mt-12 sm:mt-14 flex gap-4 justify-center">
            <a
              href="https://motionwind.xyz/docs/getting-started"
              className="animate-hover:scale-105 animate-tap:scale-95 animate-spring group inline-flex items-center gap-2.5 rounded-xl bg-acid px-6 sm:px-8 py-3.5 text-sm font-semibold text-gray-950 transition-shadow hover:shadow-[0_0_30px_#c8ff2e40]"
            >
              Read the Docs
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
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       *  FOOTER
       * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <footer className="border-t border-white/[0.06] py-10 sm:py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold tracking-tight">motionwind</span>
            <span className="text-xs text-text-muted">v0.3.0</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-text-muted">
            <a
              href="https://motionwind.xyz/docs/getting-started"
              className="hover:text-white transition-colors"
            >
              Docs
            </a>
            <a
              href="https://github.com/piyushzingade/motionwind"
              className="hover:text-white transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://www.npmjs.com/package/motionwind-react"
              className="hover:text-white transition-colors"
            >
              npm
            </a>
          </div>
          <p className="text-xs text-text-muted">
            Built with Motion & Tailwind CSS
          </p>
        </div>
      </footer>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       *  FIXED CODE DRAWER — slides in from the right edge of screen
       * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}

      {/* Backdrop overlay */}
      {codeOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setCodeOpen(false)}
        />
      )}

      {/* Code drawer */}
      <div
        className={`
          fixed top-0 right-0 z-50 h-full
          w-full sm:w-[480px] md:w-[520px]
          bg-[#0a0a12] border-l border-white/[0.08]
          shadow-[-20px_0_60px_rgba(0,0,0,0.5)]
          transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
          ${codeOpen ? "translate-x-0" : "translate-x-full"}
          flex flex-col
        `}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
            </div>
            <span className="text-[11px] text-text-muted font-[family-name:var(--font-geist-mono)]">
              {CODE_EXAMPLES[activeCode].file}
            </span>
          </div>
          <button
            onClick={() => setCodeOpen(false)}
            className="w-7 h-7 rounded-md flex items-center justify-center text-text-muted hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Code tabs — scrollable horizontally */}
        <div className="flex gap-0 px-3 pt-2 border-b border-white/[0.04] overflow-x-auto scrollbar-none">
          {(Object.keys(CODE_EXAMPLES) as CodeKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setActiveCode(key)}
              className={`px-3 py-2.5 text-[10px] font-medium tracking-wide uppercase whitespace-nowrap transition-colors rounded-t-md cursor-pointer ${
                activeCode === key
                  ? "text-acid bg-acid/5 border-b-2 border-acid"
                  : "text-text-muted hover:text-white/60"
              }`}
            >
              {CODE_EXAMPLES[key].title}
            </button>
          ))}
        </div>

        {/* Code content */}
        <div className="flex-1 overflow-auto p-5">
          <pre className="text-[13px] leading-7 font-[family-name:var(--font-geist-mono)]">
            <code>{highlightCode(CODE_EXAMPLES[activeCode].code)}</code>
          </pre>
        </div>

        {/* Drawer footer */}
        <div className="px-5 py-4 border-t border-white/[0.04] flex items-center justify-between">
          <div className="text-[11px] text-text-muted flex items-center gap-2">
            <svg
              className="w-3.5 h-3.5 text-acid/50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            Compiled at build time — zero runtime cost
          </div>
          <span className="text-[10px] text-text-muted/60 font-[family-name:var(--font-geist-mono)]">
            ESC to close
          </span>
        </div>
      </div>
    </div>
  );
}
