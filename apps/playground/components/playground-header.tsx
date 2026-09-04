"use client";

import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { MintlifyLogo } from "./mintlify-logo";

export function PlaygroundHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-2 bg-[var(--color-bg)]/80 backdrop-blur-md z-40 shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
      <div className="flex items-center gap-4 px-4">
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <span className="font-[family-name:var(--font-display)] text-xl italic tracking-tight text-[var(--color-fg)]">
            motionwind
          </span>
          <span className="font-[family-name:var(--font-mono)] text-[9px] text-[var(--color-fg-muted)]/50 ml-0.5">
            studio
          </span>
        </Link>
        <span className="oss-badge group relative hidden sm:inline-flex items-center gap-2 rounded-full bg-[var(--color-surface-elevated)]/70 px-3 py-1 backdrop-blur-sm">
          <span className="oss-badge-glow" aria-hidden="true" />
          <MintlifyLogo className="relative h-3 w-auto" />
          <span className="relative font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.15em] text-[var(--color-fg-muted)]">
            Backed by · OSS program
          </span>
        </span>
      </div>

      <div className="flex items-center gap-2 px-4">
        <ThemeToggle />
        <Link
          href="https://github.com/piyushzingade/motionwind"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-7 items-center gap-1.5 rounded-md bg-[var(--color-surface-elevated)] px-2.5 text-xs text-[var(--color-fg-muted)] no-underline transition-colors hover:text-[var(--color-fg)] hover:bg-[var(--color-surface-overlay)]"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          <span>GitHub</span>
        </Link>
      </div>
    </header>
  );
}
