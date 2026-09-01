"use client";

import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-200 h-14 flex items-center justify-between border-b border-border-subtle bg-surface/80 backdrop-blur-xl px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-mono text-xs font-bold tracking-[-0.03em] text-accent hover:text-accent-dim transition-colors"
          aria-label="Motionwind home"
        >
          <span>motionwind</span>
          <span className="hidden sm:inline text-text-muted">v2</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          <Link
            href="/"
            className="rounded-md px-3 py-1.5 text-sm font-medium text-text-dim hover:text-foreground hover:bg-surface-overlay transition-colors"
          >
            Features
          </Link>
          <Link
            href="/play"
            className="rounded-md px-3 py-1.5 text-sm font-medium text-text-dim hover:text-foreground hover:bg-surface-overlay transition-colors"
          >
            Studio
          </Link>
          <Link
            href="https://www.motionwind.xyz/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md px-3 py-1.5 text-sm font-medium text-text-dim hover:text-foreground hover:bg-surface-overlay transition-colors"
          >
            Docs
          </Link>
        </nav>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Link
          href="/play"
          className="hidden sm:inline-flex items-center gap-2 rounded-md bg-accent px-4 py-1.5 text-sm font-semibold text-black transition-colors hover:bg-accent-dim"
        >
          Try Studio
        </Link>
      </div>
    </header>
  );
}