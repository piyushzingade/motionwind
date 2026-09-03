"use client";

import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { MotionwindLogo } from "./motionwind-logo";

const NAV_ITEMS = [
  { label: "Features", href: "/" },
  { label: "Studio", href: "https://play.motionwind.xyz" },
  { label: "Docs", href: "https://www.motionwind.xyz/docs" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-200 h-14 flex items-center justify-between border-b border-border-strong bg-background/85 backdrop-blur-xl px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 group"
          aria-label="Motionwind home"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-acid text-background transition-transform group-hover:scale-105">
            <MotionwindLogo className="h-4 w-4" />
          </span>
          <span className="text-[15px] font-bold tracking-[-0.03em] text-text-strong">
            motionwind
          </span>
        </Link>
        <nav
          className="hidden md:flex items-center gap-1"
          aria-label="Main navigation"
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              {...(item.href.startsWith("http")
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="rounded-md px-3 py-1.5 text-sm font-medium text-text-dim hover:text-text-strong hover:bg-surface-overlay transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Link
          href="https://play.motionwind.xyz"
          className="hidden sm:inline-flex items-center gap-2 rounded-md bg-acid px-4 py-1.5 text-sm font-semibold text-background transition-colors hover:bg-acid-dim"
        >
          Try Studio
        </Link>
      </div>
    </header>
  );
}
