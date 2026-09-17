import Image from "next/image";
import Link from "next/link";
import {
  ArrowRightIcon,
  GithubLogoIcon,
  StarIcon,
} from "@phosphor-icons/react/dist/ssr";
import { ThemeToggle } from "@/components/theme-toggle";
import { LandingExperience } from "./landing-experience";

const formatStars = (count: number) =>
  count >= 1000
    ? `${(count / 1000).toFixed(1).replace(/\.0$/, "")}k`
    : String(count);

export function Hero({ starCount }: { starCount: number | null }) {
  return (
    <main className="w-full max-w-full overflow-x-hidden bg-[var(--color-bg)] text-[var(--color-fg)]">
      <section
        data-landing-section="hero"
        className="relative flex min-h-[100dvh] flex-col overflow-hidden px-5 sm:px-8 lg:px-12"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,var(--color-demo-glow),transparent_34%),radial-gradient(circle,var(--color-dot-grid)_1px,transparent_1px)] bg-[size:auto,24px_24px]"
        />

        <nav className="relative z-10 mx-auto flex h-20 w-full max-w-7xl items-center justify-between border-b border-dashed border-[var(--color-border)]">
          <Link
            href="/"
            className="flex cursor-pointer items-center gap-3 no-underline"
            aria-label="Motionwind home"
          >
            <Image src="/logo.svg" alt="" width={28} height={28} priority />
            <span className="font-[family-name:var(--font-display)] text-2xl italic tracking-tight text-[var(--color-fg)]">
              motionwind
            </span>
          </Link>
          <div className="flex items-center gap-1 sm:gap-3">
            <Link
              href="#components"
              className="hidden min-h-11 cursor-pointer items-center px-3 text-sm text-[var(--color-fg-muted)] no-underline transition-colors duration-150 ease-out hover:text-[var(--color-fg)] sm:inline-flex"
            >
              Components
            </Link>
            <Link
              href="/docs"
              className="hidden min-h-11 cursor-pointer items-center px-3 text-sm text-[var(--color-fg-muted)] no-underline transition-colors duration-150 ease-out hover:text-[var(--color-fg)] sm:inline-flex"
            >
              Docs
            </Link>
            <ThemeToggle />
          </div>
        </nav>

        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center py-24 text-center md:py-32">
          <h1 className="max-w-5xl text-[clamp(3rem,7vw,6.5rem)] font-semibold leading-[0.95] tracking-[-0.06em] text-[var(--color-fg)]">
            Motion, written where your styles live.
          </h1>
          <p className="mt-8 max-w-2xl text-base leading-7 text-[var(--color-fg-muted)] sm:text-lg sm:leading-8">
            Tailwind-like animation classes for React, Vue, JavaScript, and
            React Native—compiled into Motion before your app reaches users.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/docs"
              className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg bg-[var(--color-accent)] px-5 text-sm font-semibold text-[var(--color-accent-fg)] no-underline transition-[background-color,transform] duration-150 ease-out hover:bg-[var(--color-accent-hover)] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
            >
              Get started
              <ArrowRightIcon size={16} weight="bold" aria-hidden="true" />
            </Link>
            <a
              href="https://github.com/piyushzingade/motionwind"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-4 text-sm font-medium text-[var(--color-fg)] no-underline transition-[border-color,background-color,transform] duration-150 ease-out hover:border-[var(--color-fg-muted)] hover:bg-[var(--color-surface)] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
            >
              <GithubLogoIcon size={17} weight="fill" aria-hidden="true" />
              Star on GitHub
              <StarIcon
                size={14}
                weight="fill"
                className="text-[var(--color-accent)]"
                aria-hidden="true"
              />
              {starCount !== null ? (
                <span className="font-[family-name:var(--font-mono)] text-xs tabular-nums text-[var(--color-fg-muted)]">
                  {formatStars(starCount)}
                </span>
              ) : null}
            </a>
          </div>
        </div>
      </section>

      <LandingExperience />

      <section
        data-landing-section="action"
        className="px-5 py-24 sm:px-8 md:py-36 lg:px-12"
      >
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-12 rounded-3xl bg-[var(--color-accent)] px-7 py-12 text-[var(--color-accent-fg)] sm:px-12 md:flex-row md:items-end md:px-16 md:py-16">
          <div>
            <h2 className="max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-5xl md:text-6xl">
              Give your interface a motion vocabulary.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 opacity-75 sm:text-base">
              Start with the syntax, then take the same classes to every
              supported framework.
            </p>
          </div>
          <Link
            href="/docs/getting-started"
            className="inline-flex min-h-12 shrink-0 cursor-pointer items-center gap-2 rounded-lg bg-[var(--color-accent-fg)] px-5 text-sm font-semibold text-[var(--color-bg)] no-underline transition-transform duration-150 ease-out hover:scale-[1.03] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-fg)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-accent)]"
          >
            Read the guide
            <ArrowRightIcon size={16} weight="bold" aria-hidden="true" />
          </Link>
        </div>

        <footer className="mx-auto mt-12 flex max-w-7xl flex-col gap-5 border-t border-dashed border-[var(--color-border)] pt-8 text-sm text-[var(--color-fg-muted)] sm:flex-row sm:items-center sm:justify-between">
          <span>Motionwind. Motion as utility classes.</span>
          <div className="flex items-center gap-6">
            <Link
              href="/docs"
              className="cursor-pointer hover:text-[var(--color-fg)]"
            >
              Documentation
            </Link>
            <a
              href="https://github.com/piyushzingade/motionwind"
              target="_blank"
              rel="noreferrer"
              className="cursor-pointer hover:text-[var(--color-fg)]"
            >
              GitHub
            </a>
          </div>
        </footer>
      </section>
    </main>
  );
}
