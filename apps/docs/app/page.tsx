import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/landing/hero";

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

const FRAMEWORKS: {
  name: string;
  href: string;
  tagline: string;
  icon: React.ReactNode;
}[] = [
  {
    name: "React",
    href: "/docs/frameworks/react",
    tagline: "Vite & Next.js",
    icon: (
      <svg
        viewBox="-11.5 -10.23 23 20.46"
        width="20"
        height="20"
        aria-hidden="true"
      >
        <circle r="2" fill="currentColor" />
        <g stroke="currentColor" strokeWidth="1" fill="none">
          <ellipse rx="11" ry="4.2" />
          <ellipse rx="11" ry="4.2" transform="rotate(60)" />
          <ellipse rx="11" ry="4.2" transform="rotate(120)" />
        </g>
      </svg>
    ),
  },
  {
    name: "React Native",
    href: "/docs/frameworks/react-native",
    tagline: "Expo · Reanimated",
    icon: (
      <svg
        viewBox="-11.5 -10.23 23 20.46"
        width="20"
        height="20"
        aria-hidden="true"
      >
        <circle r="2" fill="currentColor" />
        <g stroke="currentColor" strokeWidth="1" fill="none" opacity="0.85">
          <ellipse rx="11" ry="4.2" />
          <ellipse rx="11" ry="4.2" transform="rotate(60)" />
          <ellipse rx="11" ry="4.2" transform="rotate(120)" />
        </g>
      </svg>
    ),
  },
  {
    name: "Vue 3",
    href: "/docs/frameworks/vue",
    tagline: "Build-time transform",
    icon: (
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          d="M2 3.5h4.2L12 13.2 17.8 3.5H22L12 20.5 2 3.5z"
          opacity="0.55"
        />
        <path d="M6.2 3.5h3.3L12 7.8l2.5-4.3h3.3L12 13.4 6.2 3.5z" />
      </svg>
    ),
  },
  {
    name: "Vanilla",
    href: "/docs/frameworks/vanilla",
    tagline: "DOM scan · no build",
    icon: (
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
];

const VALUES: {
  title: string;
  desc: string;
}[] = [
  {
    title: "Zero runtime",
    desc: "Static classes compiled away at build time. No parser, no overhead in production.",
  },
  {
    title: "Familiar syntax",
    desc: "If you know Tailwind, you already know motionwind. Same utility-first approach.",
  },
  {
    title: "Cross-framework",
    desc: "One animate-* language translated to React, Vue, React Native, and vanilla.",
  },
];

const SECTIONS: {
  href: string;
  title: string;
  desc: string;
  label: string;
}[] = [
  {
    href: "/docs/getting-started",
    title: "Getting Started",
    desc: "Install Motionwind and set up your first animation in minutes.",
    label: "install & setup",
  },
  {
    href: "/docs/frameworks",
    title: "Frameworks",
    desc: "React, Vue, vanilla JavaScript, and React Native adapters.",
    label: "adapters",
  },
  {
    href: "/docs/syntax",
    title: "Syntax Reference",
    desc: "Complete reference for all animation classes and properties.",
    label: "animate-* reference",
  },
  {
    href: "/docs/configuration",
    title: "Configuration",
    desc: "Tokens, presets, diagnostics, and reduced-motion policy.",
    label: "tokens & presets",
  },
];

export default function DocsHome() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Hero />

      {/* Framework strip */}
      <section
        className="mx-auto max-w-5xl px-6"
        aria-label="Supported frameworks"
      >
        <h2 className="text-center font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">
          One language · every framework
        </h2>
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {FRAMEWORKS.map((f) => (
            <li key={f.name}>
              <Link
                href={f.href}
                className="group flex flex-col items-center gap-2 rounded-xl border border-[var(--color-border)] p-5 text-center no-underline transition-colors hover:border-[var(--color-accent)]/40"
              >
                <span className="text-[var(--color-accent)] transition-transform duration-200 group-hover:scale-110">
                  {f.icon}
                </span>
                <span className="text-sm font-semibold text-[var(--color-fg)]">
                  {f.name}
                </span>
                <span className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-wider text-[var(--color-fg-muted)]">
                  {f.tagline}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Value props */}
      <section className="mx-auto max-w-5xl px-6" aria-label="Why motionwind">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {VALUES.map((v) => (
            <div
              key={v.title}
              className="rounded-xl border border-dashed border-[var(--color-border)] p-5"
            >
              <h3 className="text-sm font-semibold text-[var(--color-fg)]">
                {v.title}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-[var(--color-fg-muted)]">
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Quick links for SEO and GEO */}
      <section
        className="mx-auto max-w-5xl px-6 pb-24"
        aria-label="Docs sections"
      >
        <h2 className="text-center font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">
          Browse the docs
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {SECTIONS.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="group flex flex-col rounded-xl border border-[var(--color-border)] p-6 no-underline transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-[var(--color-accent)]/40"
            >
              <span className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.15em] text-[var(--color-accent)]">
                {s.label}
              </span>
              <h3 className="mt-2 text-base font-semibold text-[var(--color-fg)] transition-colors group-hover:text-[var(--color-accent)]">
                {s.title}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-[var(--color-fg-muted)]">
                {s.desc}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
