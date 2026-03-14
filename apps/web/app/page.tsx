import { Typewriter } from "../components/typewriter";

export default function Home() {
  return (
    <div className="grain">
      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden glow-top">
        <div className="grid-bg absolute inset-0 pointer-events-none" />

        {/* Badge */}
        <div className="animate-initial:opacity-0 animate-initial:y-10 animate-enter:opacity-100 animate-enter:y-0 animate-duration-600 animate-ease-out relative z-10 mb-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-acid/20 bg-acid/5 px-4 py-1.5 text-xs font-medium tracking-wide text-acid uppercase">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-acid opacity-75 animate-pulse-glow" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-acid" />
            </span>
            v0.1 — Now in Public Beta
          </span>
        </div>

        {/* Headline */}
        <h1 className="animate-initial:opacity-0 animate-initial:y-20 animate-enter:opacity-100 animate-enter:y-0 animate-duration-700 animate-ease-out relative z-10 text-center max-w-4xl">
          <span className="block text-6xl sm:text-7xl md:text-8xl font-bold tracking-tight leading-[0.95]">
            Animations in
          </span>
          <span className="block text-6xl sm:text-7xl md:text-8xl font-bold tracking-tight leading-[0.95] text-acid mt-2">
            class names.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="animate-initial:opacity-0 animate-initial:y-20 animate-enter:opacity-100 animate-enter:y-0 animate-duration-700 animate-delay-200 animate-ease-out relative z-10 mt-8 text-lg sm:text-xl text-text-dim max-w-2xl text-center leading-relaxed">
          Write Motion animations as Tailwind-like utility classes.
          Transformed at build time. Zero runtime overhead. No imports needed.
        </p>

        {/* CTA Buttons */}
        <div className="animate-initial:opacity-0 animate-initial:y-20 animate-enter:opacity-100 animate-enter:y-0 animate-duration-700 animate-delay-400 animate-ease-out relative z-10 flex gap-4 mt-10">
          <a
            href="https://motionwind.dev/docs/getting-started"
            className="animate-hover:scale-105 animate-tap:scale-95 animate-spring animate-stiffness-300 animate-damping-20 group inline-flex items-center gap-2 rounded-lg bg-acid px-6 py-3 text-sm font-semibold text-gray-950 transition-shadow hover:shadow-[0_0_30px_#c8ff2e40]"
          >
            Get Started
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
          </a>
          <a
            href="https://github.com/piyush/motionwind"
            className="animate-hover:scale-105 animate-tap:scale-95 animate-spring animate-stiffness-300 animate-damping-20 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white/80 backdrop-blur-sm transition-colors hover:bg-white/10 hover:text-white"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
            GitHub
          </a>
        </div>

        {/* Hero Code Example */}
        <div className="animate-initial:opacity-0 animate-initial:y-30 animate-enter:opacity-100 animate-enter:y-0 animate-duration-800 animate-delay-500 animate-ease-out relative z-10 mt-16 w-full max-w-2xl">
          <div className="rounded-xl border border-white/[0.06] bg-surface-raised/80 backdrop-blur-xl shadow-2xl shadow-black/50 overflow-hidden">
            {/* Tab Bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-white/10" />
                <div className="w-3 h-3 rounded-full bg-white/10" />
                <div className="w-3 h-3 rounded-full bg-white/10" />
              </div>
              <span className="ml-3 text-xs text-text-muted font-[family-name:var(--font-geist-mono)]">App.tsx</span>
            </div>
            {/* Code */}
            <pre className="p-5 text-sm leading-7 font-[family-name:var(--font-geist-mono)] overflow-x-auto">
              <code>
                <span className="syntax-comment">{"// Just add classes. That's it."}</span>{"\n"}
                <span className="syntax-punct">{"<"}</span><span className="syntax-tag">{"button"}</span>{"\n"}
                {"  "}<span className="syntax-attr">{"className"}</span><span className="syntax-punct">{"="}</span><span className="syntax-string">{'"'}</span>{"\n"}
                {"    "}<span className="text-acid font-semibold">{"animate-hover:scale-110"}</span>{"\n"}
                {"    "}<span className="text-acid font-semibold">{"animate-tap:scale-95"}</span>{"\n"}
                {"    "}<span className="text-acid font-semibold">{"animate-spring"}</span>{"\n"}
                {"    "}<span className="text-white/40">{"rounded-xl bg-white px-6 py-3"}</span>{"\n"}
                {"  "}<span className="syntax-string">{'"'}</span>{"\n"}
                <span className="syntax-punct">{">"}</span>{"\n"}
                {"  Click me"}{"\n"}
                <span className="syntax-punct">{"</"}</span><span className="syntax-tag">{"button"}</span><span className="syntax-punct">{">"}</span>
              </code>
            </pre>
          </div>
          {/* Glow under code block */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-acid/10 blur-3xl rounded-full" />
        </div>

        {/* Scroll indicator */}
        <div className="animate-initial:opacity-0 animate-enter:opacity-100 animate-duration-1000 animate-delay-1000 absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.2em] text-text-muted">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-text-muted/50 to-transparent" />
        </div>
      </section>

      <div className="section-divider mx-auto max-w-4xl" />

      {/* ─── LIVE DEMO ─── */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="animate-initial:opacity-0 animate-initial:y-20 animate-inview:opacity-100 animate-inview:y-0 animate-duration-600 animate-ease-out animate-once text-center mb-16">
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-acid/70 mb-4 block">Interactive Demo</span>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Feel the difference
            </h2>
            <p className="mt-4 text-text-dim text-lg max-w-xl mx-auto">
              Every element below is animated using motionwind classes. Hover, tap, and scroll to see them in action.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Demo Card: Hover Scale */}
            <div className="animate-initial:opacity-0 animate-initial:y-20 animate-inview:opacity-100 animate-inview:y-0 animate-duration-500 animate-ease-out animate-once group relative rounded-2xl border border-white/[0.06] bg-surface-raised p-6 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-acid/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="flex items-center justify-center h-32 mb-5">
                  <div className="animate-hover:scale-110 animate-tap:scale-90 animate-spring animate-stiffness-400 animate-damping-15 w-20 h-20 rounded-2xl bg-gradient-to-br from-acid/30 to-acid/10 border border-acid/20 flex items-center justify-center cursor-pointer select-none">
                    <svg className="w-8 h-8 text-acid" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" /></svg>
                  </div>
                </div>
                <h3 className="text-sm font-semibold mb-1">Hover & Tap</h3>
                <p className="text-xs text-text-muted leading-relaxed">Scale up on hover, shrink on tap. Spring physics for natural feel.</p>
                <code className="mt-3 block text-[10px] text-acid/60 font-[family-name:var(--font-geist-mono)]">animate-hover:scale-110 animate-tap:scale-90</code>
              </div>
            </div>

            {/* Demo Card: Scroll Reveal */}
            <div className="animate-initial:opacity-0 animate-initial:y-20 animate-inview:opacity-100 animate-inview:y-0 animate-duration-500 animate-delay-100 animate-ease-out animate-once group relative rounded-2xl border border-white/[0.06] bg-surface-raised p-6 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-sky-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="flex items-center justify-center h-32 mb-5">
                  <div className="flex gap-2">
                    <div className="animate-initial:opacity-0 animate-initial:y-10 animate-inview:opacity-100 animate-inview:y-0 animate-duration-400 animate-once w-8 h-16 rounded-lg bg-sky-400/20 border border-sky-400/20" />
                    <div className="animate-initial:opacity-0 animate-initial:y-10 animate-inview:opacity-100 animate-inview:y-0 animate-duration-400 animate-delay-100 animate-once w-8 h-24 rounded-lg bg-sky-400/30 border border-sky-400/20" />
                    <div className="animate-initial:opacity-0 animate-initial:y-10 animate-inview:opacity-100 animate-inview:y-0 animate-duration-400 animate-delay-200 animate-once w-8 h-20 rounded-lg bg-sky-400/20 border border-sky-400/20" />
                    <div className="animate-initial:opacity-0 animate-initial:y-10 animate-inview:opacity-100 animate-inview:y-0 animate-duration-400 animate-delay-300 animate-once w-8 h-28 rounded-lg bg-sky-400/40 border border-sky-400/20" />
                  </div>
                </div>
                <h3 className="text-sm font-semibold mb-1">Scroll Reveal</h3>
                <p className="text-xs text-text-muted leading-relaxed">Elements animate into view with staggered delays when scrolled into viewport.</p>
                <code className="mt-3 block text-[10px] text-acid/60 font-[family-name:var(--font-geist-mono)]">animate-inview:opacity-100 animate-inview:y-0</code>
              </div>
            </div>

            {/* Demo Card: Spring Physics */}
            <div className="animate-initial:opacity-0 animate-initial:y-20 animate-inview:opacity-100 animate-inview:y-0 animate-duration-500 animate-delay-200 animate-ease-out animate-once group relative rounded-2xl border border-white/[0.06] bg-surface-raised p-6 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="flex items-center justify-center h-32 mb-5">
                  <div className="animate-hover:rotate-12 animate-hover:scale-110 animate-tap:rotate-0 animate-tap:scale-90 animate-spring animate-stiffness-200 animate-damping-10 w-20 h-20 rounded-2xl bg-gradient-to-br from-fuchsia-400/30 to-fuchsia-400/10 border border-fuchsia-400/20 flex items-center justify-center cursor-pointer select-none">
                    <svg className="w-8 h-8 text-fuchsia-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
                  </div>
                </div>
                <h3 className="text-sm font-semibold mb-1">Spring Physics</h3>
                <p className="text-xs text-text-muted leading-relaxed">Fine-tune stiffness, damping, and mass for physically accurate motion.</p>
                <code className="mt-3 block text-[10px] text-acid/60 font-[family-name:var(--font-geist-mono)]">animate-spring animate-stiffness-200</code>
              </div>
            </div>

            {/* Demo Card: Drag */}
            <div className="animate-initial:opacity-0 animate-initial:y-20 animate-inview:opacity-100 animate-inview:y-0 animate-duration-500 animate-delay-300 animate-ease-out animate-once group relative rounded-2xl border border-white/[0.06] bg-surface-raised p-6 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="flex items-center justify-center h-32 mb-5">
                  <div className="animate-drag-both animate-drag-elastic-30 animate-hover:scale-105 animate-spring w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400/30 to-amber-400/10 border border-amber-400/20 flex items-center justify-center cursor-grab active:cursor-grabbing select-none">
                    <svg className="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" /></svg>
                  </div>
                </div>
                <h3 className="text-sm font-semibold mb-1">Draggable</h3>
                <p className="text-xs text-text-muted leading-relaxed">Make any element draggable with elastic constraints. Try dragging the box above.</p>
                <code className="mt-3 block text-[10px] text-acid/60 font-[family-name:var(--font-geist-mono)]">animate-drag-both animate-drag-elastic-30</code>
              </div>
            </div>

            {/* Demo Card: Focus */}
            <div className="animate-initial:opacity-0 animate-initial:y-20 animate-inview:opacity-100 animate-inview:y-0 animate-duration-500 animate-delay-400 animate-ease-out animate-once group relative rounded-2xl border border-white/[0.06] bg-surface-raised p-6 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="flex items-center justify-center h-32 mb-5">
                  <input
                    type="text"
                    placeholder="Focus me..."
                    className="animate-focus:scale-105 animate-spring animate-stiffness-300 animate-damping-20 w-48 rounded-xl bg-surface/50 border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-text-muted outline-none focus:border-emerald-400/40 focus:ring-1 focus:ring-emerald-400/20 transition-colors"
                  />
                </div>
                <h3 className="text-sm font-semibold mb-1">Focus Animation</h3>
                <p className="text-xs text-text-muted leading-relaxed">Animate inputs on focus for polished form interactions.</p>
                <code className="mt-3 block text-[10px] text-acid/60 font-[family-name:var(--font-geist-mono)]">animate-focus:scale-105 animate-spring</code>
              </div>
            </div>

            {/* Demo Card: Continuous */}
            <div className="animate-initial:opacity-0 animate-initial:y-20 animate-inview:opacity-100 animate-inview:y-0 animate-duration-500 animate-delay-500 animate-ease-out animate-once group relative rounded-2xl border border-white/[0.06] bg-surface-raised p-6 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="flex items-center justify-center h-32 mb-5">
                  <div className="animate-initial:rotate-0 animate-enter:rotate-360 animate-duration-2000 animate-ease-linear animate-repeat-infinite w-20 h-20 rounded-2xl bg-gradient-to-br from-rose-400/30 to-rose-400/10 border border-rose-400/20 flex items-center justify-center">
                    <svg className="w-8 h-8 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M2.985 19.644l3.181-3.182" /></svg>
                  </div>
                </div>
                <h3 className="text-sm font-semibold mb-1">Infinite Loop</h3>
                <p className="text-xs text-text-muted leading-relaxed">Continuous rotation with repeat-infinite. Loaders, spinners, and beyond.</p>
                <code className="mt-3 block text-[10px] text-acid/60 font-[family-name:var(--font-geist-mono)]">animate-enter:rotate-360 animate-repeat-infinite</code>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider mx-auto max-w-4xl" />

      {/* ─── HOW IT WORKS ─── */}
      <section className="relative py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="animate-initial:opacity-0 animate-initial:y-20 animate-inview:opacity-100 animate-inview:y-0 animate-duration-600 animate-ease-out animate-once text-center mb-16">
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-acid/70 mb-4 block">How It Works</span>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Build time, not runtime
            </h2>
            <p className="mt-4 text-text-dim text-lg max-w-xl mx-auto">
              A Babel plugin reads your classes and emits optimized Motion components. Your users never pay for parsing.
            </p>
          </div>

          {/* Before / After Code */}
          <div className="animate-initial:opacity-0 animate-initial:y-20 animate-inview:opacity-100 animate-inview:y-0 animate-duration-600 animate-ease-out animate-once relative grid md:grid-cols-[1fr_auto_1fr] gap-0 md:gap-0 items-stretch">
            {/* BEFORE: What you write */}
            <div className="rounded-xl border border-white/[0.06] bg-surface-raised overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                <span className="text-xs font-medium text-acid">What you write</span>
                <span className="text-[10px] text-text-muted font-[family-name:var(--font-geist-mono)]">source.tsx</span>
              </div>
              <pre className="p-5 text-[13px] leading-7 font-[family-name:var(--font-geist-mono)] overflow-x-auto">
                <code>
                  <span className="syntax-comment">{"// No imports needed"}</span>{"\n"}
                  <span className="syntax-punct">{"<"}</span><span className="syntax-tag">{"div"}</span>{"\n"}
                  {"  "}<span className="syntax-attr">{"className"}</span><span className="syntax-punct">{"="}</span><span className="syntax-string">{'"'}</span>{"\n"}
                  {"    "}<span className="text-acid">{"animate-initial:opacity-0"}</span>{"\n"}
                  {"    "}<span className="text-acid">{"animate-initial:y-20"}</span>{"\n"}
                  {"    "}<span className="text-acid">{"animate-inview:opacity-100"}</span>{"\n"}
                  {"    "}<span className="text-acid">{"animate-inview:y-0"}</span>{"\n"}
                  {"    "}<span className="text-acid">{"animate-duration-500"}</span>{"\n"}
                  {"    "}<span className="text-acid">{"animate-once"}</span>{"\n"}
                  {"    "}<span className="text-white/40">{"p-4 rounded-lg"}</span>{"\n"}
                  {"  "}<span className="syntax-string">{'"'}</span>{"\n"}
                  <span className="syntax-punct">{">"}</span>{"\n"}
                  {"  Hello world"}{"\n"}
                  <span className="syntax-punct">{"</"}</span><span className="syntax-tag">{"div"}</span><span className="syntax-punct">{">"}</span>
                </code>
              </pre>
            </div>

            {/* Arrow connector */}
            <div className="hidden md:flex items-center justify-center px-4">
              <div className="flex flex-col items-center gap-2">
                <div className="w-px h-8 bg-gradient-to-b from-transparent to-acid/30" />
                <div className="w-8 h-8 rounded-full border border-acid/20 bg-acid/5 flex items-center justify-center">
                  <svg className="w-4 h-4 text-acid" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                </div>
                <div className="w-px h-8 bg-gradient-to-b from-acid/30 to-transparent" />
              </div>
            </div>
            {/* Mobile arrow */}
            <div className="flex md:hidden items-center justify-center py-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-px bg-gradient-to-r from-transparent to-acid/30" />
                <div className="w-8 h-8 rounded-full border border-acid/20 bg-acid/5 flex items-center justify-center">
                  <svg className="w-4 h-4 text-acid rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                </div>
                <div className="w-8 h-px bg-gradient-to-r from-acid/30 to-transparent" />
              </div>
            </div>

            {/* AFTER: What gets compiled */}
            <div className="rounded-xl border border-white/[0.06] bg-surface-raised overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                <span className="text-xs font-medium text-text-dim">What gets compiled</span>
                <span className="text-[10px] text-text-muted font-[family-name:var(--font-geist-mono)]">output.js</span>
              </div>
              <pre className="p-5 text-[13px] leading-7 font-[family-name:var(--font-geist-mono)] overflow-x-auto">
                <code>
                  <span className="syntax-comment">{"// Auto-injected by Babel"}</span>{"\n"}
                  <span className="syntax-keyword">{"import"}</span>{" { "}<span className="text-white">{"motion"}</span>{" } "}<span className="syntax-keyword">{"from"}</span>{" "}<span className="syntax-string">{'"motion/react"'}</span>{"\n\n"}
                  <span className="syntax-punct">{"<"}</span><span className="syntax-component">{"motion.div"}</span>{"\n"}
                  {"  "}<span className="syntax-attr">{"className"}</span><span className="syntax-punct">{"="}</span><span className="syntax-string">{'"p-4 rounded-lg"'}</span>{"\n"}
                  {"  "}<span className="syntax-attr">{"initial"}</span><span className="syntax-punct">{"={"}</span>{"{ "}<span className="text-white">{"opacity: 0, y: 20"}</span>{" }"}<span className="syntax-punct">{"}"}</span>{"\n"}
                  {"  "}<span className="syntax-attr">{"whileInView"}</span><span className="syntax-punct">{"={"}</span>{"{ "}<span className="text-white">{"opacity: 1, y: 0"}</span>{" }"}<span className="syntax-punct">{"}"}</span>{"\n"}
                  {"  "}<span className="syntax-attr">{"transition"}</span><span className="syntax-punct">{"={"}</span>{"{ "}<span className="text-white">{"duration: 0.5"}</span>{" }"}<span className="syntax-punct">{"}"}</span>{"\n"}
                  {"  "}<span className="syntax-attr">{"viewport"}</span><span className="syntax-punct">{"={"}</span>{"{ "}<span className="text-white">{"once: true"}</span>{" }"}<span className="syntax-punct">{"}"}</span>{"\n"}
                  <span className="syntax-punct">{">"}</span>{"\n"}
                  {"  Hello world"}{"\n"}
                  <span className="syntax-punct">{"</"}</span><span className="syntax-component">{"motion.div"}</span><span className="syntax-punct">{">"}</span>
                </code>
              </pre>
            </div>
          </div>

          {/* Process steps */}
          <div className="mt-16 grid sm:grid-cols-3 gap-0">
            <div className="animate-initial:opacity-0 animate-initial:y-15 animate-inview:opacity-100 animate-inview:y-0 animate-duration-500 animate-ease-out animate-once relative text-center px-6">
              <div className="w-10 h-10 rounded-full border border-acid/20 bg-acid/5 flex items-center justify-center mx-auto mb-4 text-acid text-sm font-bold font-[family-name:var(--font-geist-mono)]">1</div>
              {/* Connector line */}
              <div className="hidden sm:block absolute top-5 left-[calc(50%+28px)] right-0 h-px bg-gradient-to-r from-acid/20 to-transparent" />
              <h3 className="text-sm font-semibold mb-2">Write classes</h3>
              <p className="text-xs text-text-muted leading-relaxed">Add motionwind classes to any HTML element. No imports, no wrappers.</p>
            </div>
            <div className="animate-initial:opacity-0 animate-initial:y-15 animate-inview:opacity-100 animate-inview:y-0 animate-duration-500 animate-delay-150 animate-ease-out animate-once relative text-center px-6">
              <div className="w-10 h-10 rounded-full border border-acid/20 bg-acid/5 flex items-center justify-center mx-auto mb-4 text-acid text-sm font-bold font-[family-name:var(--font-geist-mono)]">2</div>
              {/* Connector lines */}
              <div className="hidden sm:block absolute top-5 left-0 right-0 h-px bg-acid/10" />
              <h3 className="text-sm font-semibold mb-2">Babel transforms</h3>
              <p className="text-xs text-text-muted leading-relaxed">At build time, classes are parsed and converted to Motion component props.</p>
            </div>
            <div className="animate-initial:opacity-0 animate-initial:y-15 animate-inview:opacity-100 animate-inview:y-0 animate-duration-500 animate-delay-300 animate-ease-out animate-once relative text-center px-6">
              <div className="w-10 h-10 rounded-full border border-acid/20 bg-acid/5 flex items-center justify-center mx-auto mb-4 text-acid text-sm font-bold font-[family-name:var(--font-geist-mono)]">3</div>
              {/* Connector line */}
              <div className="hidden sm:block absolute top-5 left-0 right-[calc(50%-28px)] h-px bg-gradient-to-l from-acid/20 to-transparent" />
              <h3 className="text-sm font-semibold mb-2">Ship zero overhead</h3>
              <p className="text-xs text-text-muted leading-relaxed">Your production bundle contains only optimized Motion components. No parser shipped.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider mx-auto max-w-4xl" />

      {/* ─── FEATURES ─── */}
      <section className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-initial:opacity-0 animate-initial:y-20 animate-inview:opacity-100 animate-inview:y-0 animate-duration-600 animate-ease-out animate-once text-center mb-16">
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-acid/70 mb-4 block">Features</span>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Everything you need
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Feature 1 */}
            <div className="animate-initial:opacity-0 animate-initial:y-15 animate-inview:opacity-100 animate-inview:y-0 animate-duration-500 animate-ease-out animate-once animate-hover:y--2 group rounded-2xl border border-white/[0.06] bg-surface-raised p-6 transition-colors hover:border-acid/10">
              <div className="w-10 h-10 rounded-xl bg-acid/10 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-acid" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>
              </div>
              <h3 className="text-sm font-semibold mb-2">Zero Runtime</h3>
              <p className="text-xs text-text-muted leading-relaxed">Static classes are compiled away at build time. No parser, no overhead in production.</p>
            </div>

            {/* Feature 2 */}
            <div className="animate-initial:opacity-0 animate-initial:y-15 animate-inview:opacity-100 animate-inview:y-0 animate-duration-500 animate-delay-100 animate-ease-out animate-once animate-hover:y--2 group rounded-2xl border border-white/[0.06] bg-surface-raised p-6 transition-colors hover:border-acid/10">
              <div className="w-10 h-10 rounded-xl bg-acid/10 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-acid" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" /></svg>
              </div>
              <h3 className="text-sm font-semibold mb-2">Familiar Syntax</h3>
              <p className="text-xs text-text-muted leading-relaxed">If you know Tailwind, you already know motionwind. Same utility-first, class-based approach.</p>
            </div>

            {/* Feature 3 */}
            <div className="animate-initial:opacity-0 animate-initial:y-15 animate-inview:opacity-100 animate-inview:y-0 animate-duration-500 animate-delay-200 animate-ease-out animate-once animate-hover:y--2 group rounded-2xl border border-white/[0.06] bg-surface-raised p-6 transition-colors hover:border-acid/10">
              <div className="w-10 h-10 rounded-xl bg-acid/10 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-acid" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.385-5.383a1.855 1.855 0 010-2.627l.603-.606a1.855 1.855 0 012.627 0l2.252 2.251 5.146-5.147a1.855 1.855 0 012.627 0l.603.607a1.855 1.855 0 010 2.626L11.42 15.17z" /></svg>
              </div>
              <h3 className="text-sm font-semibold mb-2">8 Gesture Types</h3>
              <p className="text-xs text-text-muted leading-relaxed">Hover, tap, focus, in-view, drag, initial, enter, and exit. All as class prefixes.</p>
            </div>

            {/* Feature 4 */}
            <div className="animate-initial:opacity-0 animate-initial:y-15 animate-inview:opacity-100 animate-inview:y-0 animate-duration-500 animate-delay-300 animate-ease-out animate-once animate-hover:y--2 group rounded-2xl border border-white/[0.06] bg-surface-raised p-6 transition-colors hover:border-acid/10">
              <div className="w-10 h-10 rounded-xl bg-acid/10 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-acid" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <h3 className="text-sm font-semibold mb-2">Framework Ready</h3>
              <p className="text-xs text-text-muted leading-relaxed">First-class integrations for Next.js and Vite. One line to configure.</p>
            </div>

            {/* Feature 5 */}
            <div className="animate-initial:opacity-0 animate-initial:y-15 animate-inview:opacity-100 animate-inview:y-0 animate-duration-500 animate-delay-100 animate-ease-out animate-once animate-hover:y--2 group rounded-2xl border border-white/[0.06] bg-surface-raised p-6 transition-colors hover:border-acid/10">
              <div className="w-10 h-10 rounded-xl bg-acid/10 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-acid" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.58-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /></svg>
              </div>
              <h3 className="text-sm font-semibold mb-2">Spring Physics</h3>
              <p className="text-xs text-text-muted leading-relaxed">Stiffness, damping, mass, and bounce — all controllable through class utilities.</p>
            </div>

            {/* Feature 6 */}
            <div className="animate-initial:opacity-0 animate-initial:y-15 animate-inview:opacity-100 animate-inview:y-0 animate-duration-500 animate-delay-200 animate-ease-out animate-once animate-hover:y--2 group rounded-2xl border border-white/[0.06] bg-surface-raised p-6 transition-colors hover:border-acid/10">
              <div className="w-10 h-10 rounded-xl bg-acid/10 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-acid" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" /></svg>
              </div>
              <h3 className="text-sm font-semibold mb-2">Drag Support</h3>
              <p className="text-xs text-text-muted leading-relaxed">Enable dragging on any axis with elastic constraints. One class is all it takes.</p>
            </div>

            {/* Feature 7 */}
            <div className="animate-initial:opacity-0 animate-initial:y-15 animate-inview:opacity-100 animate-inview:y-0 animate-duration-500 animate-delay-300 animate-ease-out animate-once animate-hover:y--2 group rounded-2xl border border-white/[0.06] bg-surface-raised p-6 transition-colors hover:border-acid/10">
              <div className="w-10 h-10 rounded-xl bg-acid/10 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-acid" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" /></svg>
              </div>
              <h3 className="text-sm font-semibold mb-2">Infinite Loops</h3>
              <p className="text-xs text-text-muted leading-relaxed">Repeat animations infinitely or a set number of times for loading states and effects.</p>
            </div>

            {/* Feature 8 */}
            <div className="animate-initial:opacity-0 animate-initial:y-15 animate-inview:opacity-100 animate-inview:y-0 animate-duration-500 animate-delay-400 animate-ease-out animate-once animate-hover:y--2 group rounded-2xl border border-white/[0.06] bg-surface-raised p-6 transition-colors hover:border-acid/10">
              <div className="w-10 h-10 rounded-xl bg-acid/10 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-acid" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>
              </div>
              <h3 className="text-sm font-semibold mb-2">Arbitrary Values</h3>
              <p className="text-xs text-text-muted leading-relaxed">Need custom CSS properties? Use bracket syntax for any value: [key=value].</p>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider mx-auto max-w-4xl" />

      {/* ─── SYNTAX REFERENCE ─── */}
      <section className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-initial:opacity-0 animate-initial:y-20 animate-inview:opacity-100 animate-inview:y-0 animate-duration-600 animate-ease-out animate-once text-center mb-16">
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-acid/70 mb-4 block">Syntax</span>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
              One pattern, infinite motion
            </h2>
            <p className="mt-4 text-text-dim text-lg max-w-xl mx-auto">
              A single, composable syntax for every type of animation.
            </p>
          </div>

          <div className="animate-initial:opacity-0 animate-initial:y-20 animate-inview:opacity-100 animate-inview:y-0 animate-duration-600 animate-ease-out animate-once rounded-2xl border border-white/[0.06] bg-surface-raised overflow-hidden">
            {/* Syntax breakdown */}
            <div className="p-8 border-b border-white/[0.06]">
              <div className="flex items-center justify-center">
                <code className="text-lg sm:text-2xl font-[family-name:var(--font-geist-mono)] flex flex-wrap items-center gap-1 justify-center">
                  <span className="text-text-muted">animate-</span>
                  <span className="text-acid bg-acid/10 px-2 py-0.5 rounded">{"{"}<span className="text-[10px] align-top">gesture</span>{"}"}</span>
                  <span className="text-text-muted">:</span>
                  <span className="text-sky-400 bg-sky-400/10 px-2 py-0.5 rounded">{"{"}<span className="text-[10px] align-top">property</span>{"}"}</span>
                  <span className="text-text-muted">-</span>
                  <span className="text-fuchsia-400 bg-fuchsia-400/10 px-2 py-0.5 rounded">{"{"}<span className="text-[10px] align-top">value</span>{"}"}</span>
                </code>
              </div>
            </div>

            {/* Gesture types table */}
            <div className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-lg bg-surface/50 border border-white/[0.04] p-3 text-center">
                  <code className="text-xs font-[family-name:var(--font-geist-mono)] text-acid">hover:</code>
                  <p className="text-[10px] text-text-muted mt-1">whileHover</p>
                </div>
                <div className="rounded-lg bg-surface/50 border border-white/[0.04] p-3 text-center">
                  <code className="text-xs font-[family-name:var(--font-geist-mono)] text-acid">tap:</code>
                  <p className="text-[10px] text-text-muted mt-1">whileTap</p>
                </div>
                <div className="rounded-lg bg-surface/50 border border-white/[0.04] p-3 text-center">
                  <code className="text-xs font-[family-name:var(--font-geist-mono)] text-acid">focus:</code>
                  <p className="text-[10px] text-text-muted mt-1">whileFocus</p>
                </div>
                <div className="rounded-lg bg-surface/50 border border-white/[0.04] p-3 text-center">
                  <code className="text-xs font-[family-name:var(--font-geist-mono)] text-acid">inview:</code>
                  <p className="text-[10px] text-text-muted mt-1">whileInView</p>
                </div>
                <div className="rounded-lg bg-surface/50 border border-white/[0.04] p-3 text-center">
                  <code className="text-xs font-[family-name:var(--font-geist-mono)] text-acid">drag:</code>
                  <p className="text-[10px] text-text-muted mt-1">whileDrag</p>
                </div>
                <div className="rounded-lg bg-surface/50 border border-white/[0.04] p-3 text-center">
                  <code className="text-xs font-[family-name:var(--font-geist-mono)] text-acid">initial:</code>
                  <p className="text-[10px] text-text-muted mt-1">initial</p>
                </div>
                <div className="rounded-lg bg-surface/50 border border-white/[0.04] p-3 text-center">
                  <code className="text-xs font-[family-name:var(--font-geist-mono)] text-acid">enter:</code>
                  <p className="text-[10px] text-text-muted mt-1">animate</p>
                </div>
                <div className="rounded-lg bg-surface/50 border border-white/[0.04] p-3 text-center">
                  <code className="text-xs font-[family-name:var(--font-geist-mono)] text-acid">exit:</code>
                  <p className="text-[10px] text-text-muted mt-1">exit</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider mx-auto max-w-4xl" />

      {/* ─── GET STARTED ─── */}
      <section className="relative py-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="animate-initial:opacity-0 animate-initial:y-20 animate-inview:opacity-100 animate-inview:y-0 animate-duration-600 animate-ease-out animate-once">
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-acid/70 mb-4 block">Get Started</span>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Up and running in
              <span className="text-acid"> 30 seconds</span>
            </h2>
            <p className="mt-4 text-text-dim text-lg max-w-xl mx-auto">
              One command to install. One line to configure. Start animating immediately.
            </p>
          </div>

          {/* Install command */}
          <div className="animate-initial:opacity-0 animate-initial:y-15 animate-inview:opacity-100 animate-inview:y-0 animate-duration-500 animate-delay-200 animate-ease-out animate-once mt-12">
            <div className="inline-flex items-center gap-4 rounded-xl border border-white/[0.08] bg-surface-raised/80 backdrop-blur-sm px-8 py-4 shadow-lg shadow-black/20">
              <span className="text-acid/80 font-[family-name:var(--font-geist-mono)] text-sm select-none">$</span>
              <code className="text-[15px] font-[family-name:var(--font-geist-mono)] text-white/90 tracking-tight"><Typewriter text="npx create-motionwind" /></code>
            </div>
          </div>

          {/* Framework configs */}
          <div className="animate-initial:opacity-0 animate-initial:y-15 animate-inview:opacity-100 animate-inview:y-0 animate-duration-500 animate-delay-300 animate-ease-out animate-once mt-10 grid sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
            <div className="rounded-xl border border-white/[0.08] bg-surface-raised overflow-hidden text-left">
              <div className="flex items-center gap-2.5 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
                <svg className="w-4 h-4 text-white/70" viewBox="0 0 24 24" fill="currentColor"><path d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 1-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 0 0-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 0 1-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 0 1-.157-.171l-.05-.106.006-4.703.007-4.705.072-.092a.645.645 0 0 1 .174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 0 0 4.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 0 0 2.466-2.163 11.944 11.944 0 0 0 2.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.86-8.292-8.208-9.695a12.597 12.597 0 0 0-2.499-.523A33.119 33.119 0 0 0 11.572 0zm4.069 7.217c.347 0 .408.005.486.047a.473.473 0 0 1 .237.277c.018.06.023 1.365.018 4.304l-.006 4.218-.744-1.14-.746-1.14v-3.066c0-1.982.01-3.097.023-3.15a.478.478 0 0 1 .233-.296c.096-.05.13-.054.5-.054z" /></svg>
                <span className="text-xs font-semibold text-white/90">Next.js</span>
                <span className="ml-auto text-[10px] text-text-muted font-[family-name:var(--font-geist-mono)]">next.config.js</span>
              </div>
              <pre className="px-4 py-4 text-[12px] leading-6 font-[family-name:var(--font-geist-mono)] text-white/60"><code><span className="text-acid/70">import</span> <span className="text-white/80">withMotionwind</span> <span className="text-acid/70">from</span> <span className="text-sky-400/70">{'"motionwind/next"'}</span>{"\n"}<span className="text-acid/70">export default</span> <span className="text-white/80">withMotionwind</span>(config)</code></pre>
            </div>
            <div className="rounded-xl border border-white/[0.08] bg-surface-raised overflow-hidden text-left">
              <div className="flex items-center gap-2.5 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
                <svg className="w-4 h-4 text-white/70" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0L1.608 6v12L12 24l10.392-6V6L12 0zm-1.073 1.445h.001a1.8 1.8 0 0 1 2.138 0l7.534 4.35a1.794 1.794 0 0 1 .9 1.554v8.706c0 .641-.34 1.234-.9 1.554l-7.534 4.35a1.8 1.8 0 0 1-2.139 0l-7.534-4.35a1.794 1.794 0 0 1-.9-1.554V7.35c0-.642.34-1.234.9-1.554l7.534-4.35z" /></svg>
                <span className="text-xs font-semibold text-white/90">Vite</span>
                <span className="ml-auto text-[10px] text-text-muted font-[family-name:var(--font-geist-mono)]">vite.config.ts</span>
              </div>
              <pre className="px-4 py-4 text-[12px] leading-6 font-[family-name:var(--font-geist-mono)] text-white/60"><code><span className="text-acid/70">import</span> <span className="text-white/80">motionwind</span> <span className="text-acid/70">from</span> <span className="text-sky-400/70">{'"motionwind/vite"'}</span>{"\n"}<span className="text-acid/70">plugins:</span> [<span className="text-white/80">motionwind</span>(), <span className="text-white/80">react</span>()]</code></pre>
            </div>
          </div>

          {/* Final CTA */}
          <div className="animate-initial:opacity-0 animate-initial:y-15 animate-inview:opacity-100 animate-inview:y-0 animate-duration-500 animate-delay-400 animate-ease-out animate-once mt-14 flex gap-4 justify-center">
            <a
              href="https://motionwind.dev/docs/getting-started"
              className="animate-hover:scale-105 animate-tap:scale-95 animate-spring group inline-flex items-center gap-2.5 rounded-xl bg-acid px-8 py-3.5 text-sm font-semibold text-gray-950 transition-shadow hover:shadow-[0_0_30px_#c8ff2e40]"
            >
              Read the Docs
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
            </a>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-white/[0.06] py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold tracking-tight">motionwind</span>
            <span className="text-xs text-text-muted">v0.1.0</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-text-muted">
            <a href="https://motionwind.dev/docs/getting-started" className="hover:text-white transition-colors">Docs</a>
            <a href="https://github.com/piyush/motionwind" className="hover:text-white transition-colors">GitHub</a>
            <a href="https://www.npmjs.com/package/motionwind" className="hover:text-white transition-colors">npm</a>
          </div>
          <p className="text-xs text-text-muted">
            Built with Motion & Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
}
