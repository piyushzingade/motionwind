"use client";

import Link from "next/link";
import { SidebarSimpleIcon, StarIcon } from "@phosphor-icons/react";
import { GithubIcon } from "@repo/ui/github-icon";
import { ThemeToggle } from "@repo/ui/theme-toggle";
import type { MotionwindRecipe } from "motionwind-react";
import type { StudioState } from "@/lib/types";
import { SearchPalette } from "./search-palette";

export function PlaygroundHeader({
  sidebarCollapsed,
  onToggleSidebar,
  starCount,
  editor,
  onApply,
}: {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  starCount: number | null;
  editor: StudioState;
  onApply: (recipe: MotionwindRecipe) => void;
}) {
  return (
    <header className="z-40 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-dashed border-[var(--color-border)] bg-[var(--color-bg)]/90 px-3 backdrop-blur-md sm:px-4">
      <div className="flex min-w-0 items-center gap-3">
        <button
          id="playground-sidebar-toggle"
          type="button"
          onClick={onToggleSidebar}
          aria-label="Toggle recipe sidebar"
          title="Toggle sidebar (Command or Control + B)"
          className="control-press inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[var(--color-fg-muted)] transition-[color,background-color] duration-150 hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/45"
        >
          <SidebarSimpleIcon
            size={16}
            weight={sidebarCollapsed ? "regular" : "fill"}
          />
        </button>
        <div className="min-w-0">
          <h1 className="truncate text-sm font-semibold tracking-[-0.02em] text-[var(--color-fg)]">
            Animation playground
          </h1>
          <p className="hidden truncate font-[family-name:var(--font-mono)] text-[8px] uppercase tracking-[0.08em] text-[var(--color-fg-muted)] sm:block">
            Classes in, production code out
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <SearchPalette editor={editor} onApply={onApply} />
        <ThemeToggle />
        <Link
          href="https://github.com/piyushzingade/motionwind"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={
            starCount === null
              ? "Star Motionwind on GitHub"
              : `Star Motionwind on GitHub, ${starCount} stars`
          }
          className="control-press inline-flex h-10 items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-4 text-[13px] text-[var(--color-fg-muted)] no-underline transition-[border-color,color] duration-150 hover:border-[var(--color-accent)]/20 hover:text-[var(--color-fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/45"
        >
          <GithubIcon className="size-5 text-[var(--color-fg)]" />
          <StarIcon size={15} weight="fill" className="text-[#ffd700]" />
          <span>Star</span>
          {starCount !== null ? (
            <>
              <span
                className="h-4 w-px bg-[var(--color-border)]"
                aria-hidden="true"
              />
              <span className="tabular-nums">{starCount}</span>
            </>
          ) : null}
        </Link>
      </div>
    </header>
  );
}
