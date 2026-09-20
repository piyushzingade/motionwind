"use client";

import Link from "next/link";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { GithubIcon } from "@repo/ui/github-icon";
<<<<<<< HEAD
import { ThemeToggle } from "@repo/ui/theme-toggle";
=======
import { ThemeToggle } from "./theme-toggle";
>>>>>>> origin/codex/playground-ui-reliability

export function DocsHeader({
  onToggleSidebar,
  starCount = null,
}: {
  onToggleSidebar: () => void;
  /** Star count fetched server-side in the docs layout (avoids a client fetch). */
  starCount?: number | null;
}) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-dashed border-[var(--color-border)] px-4 sticky top-0 bg-[var(--color-bg)]/80 backdrop-blur-md z-40">
      {/* Sidebar toggle — icon only, works on all screen sizes */}
      <button
        type="button"
        onClick={onToggleSidebar}
        className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)] hover:bg-[var(--color-surface-elevated)]"
        aria-label="Toggle sidebar"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M9 3v18" />
        </svg>
      </button>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Search trigger */}
        <button
          type="button"
          onClick={() => {
            window.dispatchEvent(
              new KeyboardEvent("keydown", { key: "k", ctrlKey: true }),
            );
          }}
          className="inline-flex h-8 items-center gap-2 rounded-lg px-2.5 text-xs text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)] hover:bg-[var(--color-surface-elevated)] cursor-pointer"
        >
          <MagnifyingGlassIcon size={15} />
          <span className="hidden sm:inline">Search</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1 py-0.5 text-[10px] font-mono text-[var(--color-fg-muted)]/60 bg-[var(--color-bg)] border border-[var(--color-border)] rounded">
            <span className="text-[9px]">⌘</span>K
          </kbd>
        </button>
        <ThemeToggle />
        <Link
          href="https://github.com/piyushzingade/motionwind"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-10 items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-4 text-sm text-[var(--color-fg-muted)] no-underline transition-colors hover:border-[var(--color-accent)]/20 hover:text-[var(--color-fg)]"
        >
          <GithubIcon className="size-5 text-[var(--color-fg)]" />
          {/* legacy icon removed */}
          <svg
            aria-hidden="true"
            className="hidden"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          <svg viewBox="0 0 24 24" fill="#FFD700" className="w-3.5 h-3.5">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span>Star</span>
          {starCount !== null && (
            <>
              <span className="h-3 w-px bg-[var(--color-border)]" />
              <span>{starCount}</span>
            </>
          )}
        </Link>
      </div>
    </header>
  );
}
