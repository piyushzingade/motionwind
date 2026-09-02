import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Motionwind — Motion animations as utility classes",
  description:
    "Motionwind is a shared Motion utility language for React, Vue, JavaScript, and React Native. Write animate-* classes that compile to Motion at build time with zero runtime overhead.",
  alternates: {
    canonical: "https://www.motionwind.xyz",
  },
  openGraph: {
    title: "Motionwind — Motion animations as utility classes",
    description:
      "Write Motion animations as Tailwind-like utility classes. Transformed at build time. Zero runtime overhead.",
    url: "https://www.motionwind.xyz",
    type: "website",
    images: [
      {
        url: "https://www.motionwind.xyz/og-docs.png",
        width: 1200,
        height: 630,
        alt: "Motionwind — Motion animations as utility classes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Motionwind — Motion animations as utility classes",
    description:
      "Write Motion animations as Tailwind-like utility classes. Transformed at build time. Zero runtime overhead.",
    images: ["https://www.motionwind.xyz/og-docs.png"],
  },
};

export default function DocsHome() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-[var(--color-bg)]">
      <div className="mb-8">
        <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">
          Documentation · v2.0.0
        </span>
      </div>

      <h1 className="font-[family-name:var(--font-display)] text-5xl md:text-6xl italic tracking-tight mb-2">
        <span className="text-[var(--color-accent)]">motionwind</span>
      </h1>
      <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl italic text-[var(--color-fg-muted)] tracking-tight mb-6">
        docs
      </h2>
      <p className="text-[0.9375rem] text-[var(--color-fg-muted)] mb-10 max-w-md mx-auto leading-relaxed">
        One tested animate-* language for React, Vue, JavaScript, and React
        Native, with compile-time transforms and explicit runtime adapters.
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

      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          href="/docs"
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-[var(--color-accent-fg)] no-underline transition-colors hover:bg-[var(--color-accent-hover)]"
        >
          Get Started
          <svg
            className="w-4 h-4"
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
        </Link>
        <a
          href="https://web.motionwind.xyz/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-accent)] bg-[var(--color-accent)]/[0.06] px-6 py-3 text-sm font-semibold text-[var(--color-accent)] no-underline transition-colors hover:bg-[var(--color-accent)]/[0.12]"
        >
          Live Example
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
            />
          </svg>
        </a>
      </div>

      {/* Quick links for SEO and GEO */}
      <nav
        className="mt-16 max-w-2xl w-full"
        aria-label="Documentation sections"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          <Link
            href="/docs/getting-started"
            className="group rounded-lg border border-[var(--color-border)] p-5 transition-colors hover:border-[var(--color-accent)]/40"
          >
            <h3 className="text-sm font-semibold text-[var(--color-fg)] mb-1 group-hover:text-[var(--color-accent)]">
              Getting Started
            </h3>
            <p className="text-xs text-[var(--color-fg-muted)]">
              Install Motionwind and set up your first animation in minutes.
            </p>
          </Link>
          <Link
            href="/docs/frameworks"
            className="group rounded-lg border border-[var(--color-border)] p-5 transition-colors hover:border-[var(--color-accent)]/40"
          >
            <h3 className="text-sm font-semibold text-[var(--color-fg)] mb-1 group-hover:text-[var(--color-accent)]">
              Frameworks
            </h3>
            <p className="text-xs text-[var(--color-fg-muted)]">
              React, Vue, vanilla JavaScript, and React Native adapters.
            </p>
          </Link>
          <Link
            href="/docs/syntax"
            className="group rounded-lg border border-[var(--color-border)] p-5 transition-colors hover:border-[var(--color-accent)]/40"
          >
            <h3 className="text-sm font-semibold text-[var(--color-fg)] mb-1 group-hover:text-[var(--color-accent)]">
              Syntax Reference
            </h3>
            <p className="text-xs text-[var(--color-fg-muted)]">
              Complete reference for all animation classes and properties.
            </p>
          </Link>
          <Link
            href="/docs/configuration"
            className="group rounded-lg border border-[var(--color-border)] p-5 transition-colors hover:border-[var(--color-accent)]/40"
          >
            <h3 className="text-sm font-semibold text-[var(--color-fg)] mb-1 group-hover:text-[var(--color-accent)]">
              Configuration
            </h3>
            <p className="text-xs text-[var(--color-fg-muted)]">
              Tokens, presets, diagnostics, and reduced-motion policy.
            </p>
          </Link>
        </div>
      </nav>
    </div>
  );
}
