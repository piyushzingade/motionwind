import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Framework hub grid. Accessible, responsive cards (one per supported
 * framework) that link to each framework's guide. Built on the docs design
 * tokens (--color-*), with focus-visible rings and hover affordances.
 */

interface Framework {
  name: string;
  tagline: string;
  href: string;
  install: string;
  icon: ReactNode;
  /** Highlight the recommended starting point (React + Vite). */
  featured?: boolean;
}

const ArrowIcon = (
  <svg
    aria-hidden="true"
    className="ml-auto h-4 w-4 shrink-0 text-[var(--color-fg-muted)] transition-[transform,color] duration-200 ease-out group-hover:translate-x-0.5 group-hover:text-[var(--color-accent)] motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const FRAMEWORKS: Framework[] = [
  {
    name: "React",
    tagline: "Vite & Next.js — compile static tokens with no runtime parser.",
    href: "/docs/frameworks/react",
    install: "npm i motionwind-react@2 motion motionwind-core@2",
    featured: true,
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
    tagline: "Expo beta — runtime mw.* components powered by Reanimated.",
    href: "/docs/frameworks/react-native",
    install: "npm i motionwind-react-native@2 motionwind-core@2",
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
    tagline: "A build-time template transform → Motion for Vue.",
    href: "/docs/frameworks/vue",
    install: "npm i motionwind-vue@2 motion-v motionwind-core@2",
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
    name: "Vanilla / CDN",
    tagline: "A runtime DOM scan → Motion. No build step, drop in a script.",
    href: "/docs/frameworks/vanilla",
    install: "npm i motionwind-vanilla@2 motion motionwind-core@2",
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

export function FrameworkGrid() {
  return (
    <div className="not-prose my-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
      {FRAMEWORKS.map((f) => (
        <Link
          key={f.href}
          href={f.href}
          className={`group flex flex-col gap-3 rounded-xl border bg-[var(--color-surface)] p-5 no-underline transition-[transform,border-color,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:border-[var(--color-accent)]/50 hover:shadow-[0_8px_24px_-12px_var(--color-shadow)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
            f.featured
              ? "border-[var(--color-accent)]/40"
              : "border-[var(--color-border)]"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] text-[var(--color-accent)]">
              {f.icon}
            </span>
            <span className="text-[15px] font-semibold text-[var(--color-fg)]">
              {f.name}
            </span>
            {f.featured ? (
              <span className="rounded-full border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[var(--color-accent)]">
                Recommended
              </span>
            ) : null}
            {ArrowIcon}
          </div>
          <p className="text-[13px] leading-relaxed text-[var(--color-fg-muted)]">
            {f.tagline}
          </p>
          <code className="mt-auto self-start rounded-md border border-[var(--color-code-border)] bg-[var(--color-code-bg)] px-2.5 py-1.5 font-[family-name:var(--font-mono)] text-[11px] text-[var(--color-accent)]">
            {f.install}
          </code>
        </Link>
      ))}
    </div>
  );
}
