"use client";

import Link from "next/link";
import { GithubIcon } from "@repo/ui/github-icon";
import { MotionwindLogo } from "@repo/ui/motionwind-logo";
import { ThemeToggle } from "@repo/ui/theme-toggle";

const NAV_ITEMS = [
  { label: "Demos", href: "#demos" },
  { label: "Playground", href: "https://play.motionwind.xyz" },
];

type HeaderShellProps = {
  starCount: number | null;
};

export function HeaderShell({ starCount }: HeaderShellProps) {
  return (
    <header className="sticky top-4 z-200 px-4 sm:px-6 lg:px-8">
      <div className="relative mx-auto flex h-14 w-full max-w-[1120px] items-center justify-between gap-3">
        <div className="flex min-w-0 items-center">
          <Link
            href="/"
            aria-label="Motionwind home"
            className="group flex h-12 cursor-pointer items-center rounded-full border border-border bg-surface-elevated px-5 shadow-[0_16px_40px_-24px_var(--color-shadow)] transition-opacity duration-200 hover:opacity-70"
          >
            <MotionwindLogo className="h-6 w-8 text-accent" />
            <span className="ml-2 text-sm font-semibold tracking-tight text-fg">
              Motionwind
            </span>
          </Link>
          <nav
            className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full border border-border bg-surface-elevated px-3 py-2 shadow-[0_16px_40px_-24px_var(--color-shadow)] md:flex"
            aria-label="Main navigation"
          >
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  item.href.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                className="cursor-pointer rounded-full px-4 py-2 font-sans text-xs tracking-wide text-fg transition-colors duration-200 hover:bg-surface hover:text-fg"
              >
                {item.label}
              </a>
            ))}
            <a
              href="https://www.motionwind.xyz/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer rounded-full px-4 py-2 font-sans text-xs tracking-wide text-fg transition-colors duration-200 hover:bg-surface hover:text-fg"
            >
              Docs
            </a>
          </nav>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <Link
            href="https://github.com/piyushzingade/motionwind"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open Motionwind on GitHub"
            title="Open Motionwind on GitHub"
            className="inline-flex h-12 min-w-12 cursor-pointer items-center justify-center gap-2 rounded-full border border-border bg-surface-elevated px-3 text-fg-muted shadow-[0_16px_40px_-24px_var(--color-shadow)] transition-colors duration-200 hover:border-accent/20 hover:text-fg"
          >
            <GithubIcon className="size-5 text-fg" />
            {starCount !== null && (
              <>
                <span aria-hidden="true" className="h-5 w-px bg-border" />
                <span className="font-sans text-xs tabular-nums text-fg-muted">
                  {starCount}
                </span>
              </>
            )}
          </Link>
          <div className="flex size-12 items-center justify-center rounded-full border border-border bg-surface-elevated shadow-[0_16px_40px_-24px_var(--color-shadow)]">
            <ThemeToggle className="size-8 rounded-full border-0 bg-transparent shadow-none" />
          </div>
        </div>
      </div>
    </header>
  );
}
