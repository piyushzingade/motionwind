import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Motionwind — Motion animations as Tailwind classes",
  description:
    "Write Motion animations as Tailwind-like utility classes. Build-time Babel transform, zero runtime overhead, no imports needed. Hover, tap, scroll, drag — all as class names.",
  alternates: {
    canonical: "https://www.motionwind.xyz",
  },
};

export default function DocsHome() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-[var(--color-bg)]">
      <div className="mb-8">
        <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">
          Documentation
        </span>
      </div>

      <h1 className="font-[family-name:var(--font-display)] text-5xl md:text-6xl italic tracking-tight mb-2">
        <span className="text-[var(--color-accent)]">motionwind</span>
      </h1>
      <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl italic text-[var(--color-fg-muted)] tracking-tight mb-6">
        docs
      </h2>
      <p className="text-[0.9375rem] text-[var(--color-fg-muted)] mb-10 max-w-md mx-auto leading-relaxed">
        Write Motion animations as Tailwind-like classes. Zero imports, zero
        boilerplate, zero runtime overhead.
      </p>

      {/* Dashed divider */}
      <div className="w-32 mb-10">
        <svg
          width="100%"
          height="1"
          preserveAspectRatio="none"
          className="block"
        >
          <line
            x1="0"
            y1="0.5"
            x2="100%"
            y2="0.5"
            stroke="var(--color-border)"
            strokeDasharray="6 4"
            strokeWidth="1"
          />
        </svg>
      </div>

      <div className="flex gap-3 justify-center">
        <Link
          href="/docs"
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-[var(--color-accent-fg)] no-underline transition-all hover:bg-[var(--color-accent-hover)]"
        >
          Get Started
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
        </Link>
        <Link
          href="/docs/animations/basic-properties"
          className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-3 text-sm font-medium text-[var(--color-fg)] no-underline transition-colors hover:bg-[var(--color-surface-elevated)]"
        >
          Examples
        </Link>
      </div>
    </div>
  );
}
