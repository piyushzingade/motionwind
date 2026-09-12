"use client";

import { useDeferredValue, useMemo, useRef, useState } from "react";
import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import {
  ArrowsClockwiseIcon,
  ChatCircleDotsIcon,
  CursorClickIcon,
  LayoutIcon,
  MagnifyingGlassIcon,
  SpinnerGapIcon,
  TrendUpIcon,
  XIcon,
} from "@phosphor-icons/react";
import { MOTIONWIND_RECIPES } from "motionwind-react";
import type { MotionwindRecipe } from "motionwind-react";
import type { StudioState } from "@/lib/types";
import { FeedbackDialog } from "./feedback-dialog";

type Category = MotionwindRecipe["category"];
type CategoryFilter = "all" | Category;

const CATEGORIES: {
  id: CategoryFilter;
  label: string;
  icon: typeof CursorClickIcon;
}[] = [
  { id: "all", label: "All", icon: ArrowsClockwiseIcon },
  { id: "interaction", label: "Interaction", icon: CursorClickIcon },
  { id: "entrance", label: "Entrance", icon: TrendUpIcon },
  { id: "scroll", label: "Scroll", icon: TrendUpIcon },
  { id: "layout", label: "Layout", icon: LayoutIcon },
  { id: "loading", label: "Loading", icon: SpinnerGapIcon },
];

function RecipeList({
  recipes,
  editor,
  onApply,
}: {
  recipes: MotionwindRecipe[];
  editor: StudioState;
  onApply: (recipe: MotionwindRecipe) => void;
}) {
  const groupedRecipes = useMemo(() => {
    const groups = new Map<Category, MotionwindRecipe[]>();
    for (const recipe of recipes) {
      const group = groups.get(recipe.category) ?? [];
      group.push(recipe);
      groups.set(recipe.category, group);
    }
    return groups;
  }, [recipes]);

  if (recipes.length === 0) return null;

  return (
    <>
      {CATEGORIES.slice(1).map(({ id, label }) => {
        const items = groupedRecipes.get(id as Category);
        if (!items?.length) return null;

        return (
          <div key={id} className="mb-6 last:mb-0">
            <div className="mb-2 flex items-center justify-between px-3">
              <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.15em] text-[var(--color-fg-muted)]">
                {label}
              </p>
              <span className="font-[family-name:var(--font-mono)] text-[9px] tabular-nums text-[var(--color-code-muted)]">
                {items.length}
              </span>
            </div>
            <ul className="space-y-0.5">
              {items.map((recipe) => {
                const isActive = editor.classes.startsWith(recipe.classes);
                return (
                  <li key={recipe.id}>
                    <button
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => onApply(recipe)}
                      className="group relative flex w-full items-center gap-2.5 rounded-lg px-3 py-1.5 text-left text-[13px] text-[var(--color-fg-muted)] transition-[color,background-color] duration-150 hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-accent)]/45 aria-pressed:bg-[var(--color-accent)]/[0.06] aria-pressed:text-[var(--color-accent)]"
                    >
                      {isActive ? (
                        <span
                          className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-[var(--color-accent)]"
                          aria-hidden="true"
                        />
                      ) : null}
                      <span className="truncate">{recipe.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </>
  );
}

function SidebarContent({
  query,
  category,
  filteredRecipes,
  editor,
  onQueryChange,
  onCategoryChange,
  onClear,
  onApply,
  onOpenFeedback,
  onClose,
  mobile,
}: {
  query: string;
  category: CategoryFilter;
  filteredRecipes: MotionwindRecipe[];
  editor: StudioState;
  onQueryChange: (query: string) => void;
  onCategoryChange: (category: CategoryFilter) => void;
  onClear: () => void;
  onApply: (recipe: MotionwindRecipe) => void;
  onOpenFeedback: () => void;
  onClose?: () => void;
  mobile?: boolean;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-dashed border-[var(--color-border)] px-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <Image
            src="/logo.svg"
            alt="motionwind"
            width={22}
            height={22}
            className="shrink-0"
          />
          <span className="truncate text-xl font-medium italic tracking-tight text-[var(--color-fg)]">
            motionwind
          </span>
          <span className="ml-0.5 font-[family-name:var(--font-mono)] text-[9px] text-[var(--color-fg-muted)]/50">
            play
          </span>
        </div>
        {mobile ? (
          <Dialog.Close asChild>
            <button
              type="button"
              aria-label="Close recipe sidebar"
              className="control-press inline-flex h-9 w-9 items-center justify-center rounded-md text-[var(--color-fg-muted)] transition-[color,background-color] duration-150 hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/45"
            >
              <XIcon size={16} />
            </button>
          </Dialog.Close>
        ) : null}
      </div>

      <div className="shrink-0 space-y-3 border-b border-dashed border-[var(--color-border)] p-3">
        <label className="relative block">
          <span className="sr-only">Search recipes</span>
          <MagnifyingGlassIcon
            size={14}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-fg-muted)]"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search recipes"
            className="h-10 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] pl-9 pr-3 text-xs text-[var(--color-fg)] outline-none transition-[border-color,box-shadow,background-color] duration-150 placeholder:text-[var(--color-fg-muted)]/70 focus:border-[var(--color-accent)]/35 focus:bg-[var(--color-surface-elevated)] focus:ring-2 focus:ring-[var(--color-accent)]/10"
          />
        </label>
        <div className="grid grid-cols-2 gap-1" aria-label="Recipe category">
          {CATEGORIES.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              aria-pressed={category === id}
              onClick={() => onCategoryChange(id)}
              className="control-press relative inline-flex h-8 min-w-0 items-center justify-center gap-1.5 rounded-lg px-2 text-[10px] text-[var(--color-fg-muted)] transition-[color,background-color] duration-150 hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/45 aria-pressed:bg-[var(--color-accent)]/[0.06] aria-pressed:text-[var(--color-accent)]"
            >
              {category === id ? (
                <span
                  className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-[var(--color-accent)]"
                  aria-hidden="true"
                />
              ) : null}
              <Icon size={12} weight={category === id ? "fill" : "regular"} />
              {label}
            </button>
          ))}
        </div>
        <p className="font-[family-name:var(--font-mono)] text-[9px] tabular-nums text-[var(--color-fg-muted)]">
          {filteredRecipes.length} of {MOTIONWIND_RECIPES.length} recipes
        </p>
      </div>

      <nav
        className="min-h-0 flex-1 overflow-y-auto px-2 py-3 no-scrollbar"
        aria-label="Animation recipes"
      >
        {filteredRecipes.length > 0 ? (
          <RecipeList
            recipes={filteredRecipes}
            editor={editor}
            onApply={onApply}
          />
        ) : (
          <div className="flex h-full min-h-40 flex-col items-center justify-center px-5 text-center">
            <MagnifyingGlassIcon
              size={20}
              className="mb-3 text-[var(--color-code-muted)]"
            />
            <p className="text-xs font-medium text-[var(--color-fg)]">
              No recipes found
            </p>
            <p className="mt-1 max-w-[22ch] text-[11px] leading-relaxed text-[var(--color-fg-muted)]">
              Try another term or clear the current filters.
            </p>
            <button
              type="button"
              onClick={onClear}
              className="control-press mt-3 h-9 rounded-md border border-[var(--color-border)] px-3 text-[11px] font-medium text-[var(--color-fg-muted)] transition-[border-color,color] duration-150 hover:border-[var(--color-accent)]/30 hover:text-[var(--color-fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/45"
            >
              Clear filters
            </button>
          </div>
        )}
      </nav>

      <div className="shrink-0 border-t border-dashed border-[var(--color-border)] p-3">
        <button
          type="button"
          onClick={() => {
            onClose?.();
            onOpenFeedback();
          }}
          className="control-press flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[var(--color-border)] px-3 py-2 text-xs text-[var(--color-fg-muted)] transition-[border-color,color] duration-150 hover:border-[var(--color-accent)]/30 hover:text-[var(--color-fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/45"
        >
          <ChatCircleDotsIcon size={15} />
          Send Feedback
        </button>
      </div>
    </div>
  );
}

export function PlaygroundSidebar({
  mobileOpen,
  desktopCollapsed,
  onCloseMobile,
  editor,
  onApply,
}: {
  mobileOpen: boolean;
  desktopCollapsed: boolean;
  onCloseMobile: () => void;
  editor: StudioState;
  onApply: (recipe: MotionwindRecipe) => void;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const feedbackTrigger = useRef<HTMLElement | null>(null);

  const filteredRecipes = useMemo(
    () =>
      MOTIONWIND_RECIPES.filter((recipe) => {
        const categoryMatches =
          category === "all" || recipe.category === category;
        if (!categoryMatches) return false;
        if (!deferredQuery) return true;
        return `${recipe.name} ${recipe.id} ${recipe.category} ${recipe.classes}`
          .toLowerCase()
          .includes(deferredQuery);
      }),
    [category, deferredQuery],
  );

  function clearFilters() {
    setQuery("");
    setCategory("all");
  }

  function openFeedback() {
    feedbackTrigger.current = document.activeElement as HTMLElement | null;
    setFeedbackOpen(true);
  }

  function handleFeedbackOpenChange(open: boolean) {
    setFeedbackOpen(open);
    if (!open) {
      requestAnimationFrame(() => {
        const trigger = feedbackTrigger.current;
        if (trigger?.isConnected) {
          trigger.focus();
          return;
        }
        document.getElementById("playground-sidebar-toggle")?.focus();
      });
    }
  }

  const sharedProps = {
    query,
    category,
    filteredRecipes,
    editor,
    onQueryChange: setQuery,
    onCategoryChange: setCategory,
    onClear: clearFilters,
    onApply,
    onOpenFeedback: openFeedback,
  };

  return (
    <>
      <aside
        className={`${desktopCollapsed ? "hidden" : "hidden md:flex"} h-[100dvh] w-[260px] shrink-0 flex-col border-r border-dashed border-[var(--color-border)] bg-[var(--color-bg)]`}
      >
        <SidebarContent {...sharedProps} />
      </aside>

      <Dialog.Root
        open={mobileOpen}
        onOpenChange={(open) => !open && onCloseMobile()}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="mobile-drawer-overlay fixed inset-0 z-[100] bg-black/55 md:hidden" />
          <Dialog.Content className="mobile-drawer-content fixed inset-y-0 left-0 z-[200] h-[100dvh] w-[min(88vw,280px)] border-r border-[var(--color-border)] bg-[var(--color-bg)] focus:outline-none md:hidden">
            <Dialog.Title className="sr-only">Animation recipes</Dialog.Title>
            <SidebarContent {...sharedProps} mobile onClose={onCloseMobile} />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <FeedbackDialog
        open={feedbackOpen}
        onOpenChange={handleFeedbackOpenChange}
      />
    </>
  );
}
