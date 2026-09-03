"use client";

import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { MotionwindLogo } from "./motionwind-logo";

const NAV_ITEMS = [
  { label: "Demos", href: "#demos" },
  { label: "How", href: "#how" },
  { label: "Features", href: "#features" },
  { label: "Syntax", href: "#syntax" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-200 bg-background/85 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
      <div className="mx-auto max-w-7xl flex items-center justify-between h-14 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 group"
          aria-label="Motionwind home"
        >
          <span className="animate-hover:scale-110 animate-tap:scale-95 animate-spring flex h-7 w-7 items-center justify-center rounded-md bg-acid text-background">
            <MotionwindLogo className="h-4 w-4" />
          </span>
          <span className="text-[15px] font-bold tracking-[-0.03em] text-text-strong">
            motionwind
          </span>
          <span className="spec-index hidden sm:inline">v2.0.0</span>
        </Link>
        <nav
          className="hidden md:flex items-center gap-1"
          aria-label="Main navigation"
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-md px-3 py-1.5 font-[family-name:var(--font-mono)] text-xs tracking-wide text-text-dim hover:text-text-strong hover:bg-surface-overlay transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="https://www.motionwind.xyz/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md px-3 py-1.5 font-[family-name:var(--font-mono)] text-xs tracking-wide text-text-dim hover:text-text-strong hover:bg-surface-overlay transition-colors"
          >
            Docs
          </Link>
        </nav>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="https://play.motionwind.xyz"
            className="animate-hover:scale-105 animate-tap:scale-95 animate-spring hidden sm:inline-flex items-center gap-2 rounded-md bg-acid px-4 py-1.5 text-sm font-semibold text-background transition-colors hover:bg-acid-dim"
          >
            Try Studio
          </Link>
        </div>
      </div>
    </header>
  );
}
