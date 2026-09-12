"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import {
  ArrowsDownUpIcon,
  ArrowUpRightIcon,
  ChatCircleDotsIcon,
  CursorClickIcon,
  LayoutIcon,
  SpinnerGapIcon,
  SquaresFourIcon,
  XIcon,
} from "@phosphor-icons/react";
import { MOTIONWIND_RECIPES } from "motionwind-react";
import type { MotionwindRecipe } from "motionwind-react";
import type { StudioState } from "@/lib/types";
import { FeedbackDialog } from "./feedback-dialog";
import { RECIPE_SCENE_ICONS } from "./playground/recipe-preview";

type Category = MotionwindRecipe["category"];

const CATEGORIES: { id: Category; label: string }[] = [
  { id: "interaction", label: "Interaction" },
  { id: "entrance", label: "Entrance" },
  { id: "scroll", label: "Scroll" },
  { id: "layout", label: "Layout" },
  { id: "loading", label: "Loading" },
];

export const CATEGORY_ICONS: Record<Category, typeof CursorClickIcon> = {
  interaction: CursorClickIcon,
  entrance: ArrowUpRightIcon,
  scroll: ArrowsDownUpIcon,
  layout: LayoutIcon,
  loading: SpinnerGapIcon,
};

export const SIDEBAR_ALL_ICON = SquaresFourIcon;

const ADAPTER_LABELS: Record<string, string> = {
  react: "React",
  vue: "Vue",
  vanilla: "JS",
  "react-native": "Native",
};

function RecipeList({
  editor,
  onApply,
}: {
  editor: StudioState;
  onApply: (recipe: MotionwindRecipe) => void;
}) {
  const groupedRecipes = useMemo(() => {
    const groups = new Map<Category, MotionwindRecipe[]>();
    for (const recipe of MOTIONWIND_RECIPES) {
      const group = groups.get(recipe.category) ?? [];
      group.push(recipe);
      groups.set(recipe.category, group);
    }
    return groups;
  }, []);

  return (
    <>
      {CATEGORIES.map(({ id, label }) => {
        const items = groupedRecipes.get(id);
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
                const RecipeIcon =
                  RECIPE_SCENE_ICONS[recipe.id] ??
                  CATEGORY_ICONS[recipe.category];
                return (
                  <li key={recipe.id}>
                    <button
                      type="button"
                      aria-pressed={isActive}
                      title={recipe.description}
                      onClick={() => onApply(recipe)}
                      className="group relative flex w-full items-start gap-2.5 rounded-lg px-3 py-1.5 text-left text-[13px] text-[var(--color-fg-muted)] transition-[color,background-color] duration-150 hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-accent)]/45 aria-pressed:bg-[var(--color-accent)]/[0.06] aria-pressed:text-[var(--color-accent)]"
                    >
                      {isActive ? (
                        <span
                          className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-[var(--color-accent)]"
                          aria-hidden="true"
                        />
                      ) : null}
                      <RecipeIcon
                        size={15}
                        weight={isActive ? "fill" : "regular"}
                        className="mt-0.5 shrink-0"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate">{recipe.name}</span>
                        {isActive ? (
                          <span className="mt-1.5 flex flex-wrap gap-1">
                            {recipe.adapters.map((adapter) => (
                              <span
                                key={adapter}
                                className="rounded border border-[var(--color-border)] px-1 py-px font-[family-name:var(--font-mono)] text-[8px] uppercase tracking-[0.08em] text-[var(--color-fg-muted)]"
                              >
                                {ADAPTER_LABELS[adapter] ?? adapter}
                              </span>
                            ))}
                          </span>
                        ) : null}
                      </span>
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
  editor,
  onApply,
  onOpenFeedback,
  onClose,
  mobile,
}: {
  editor: StudioState;
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

      <div className="flex shrink-0 items-center justify-between border-b border-dashed border-[var(--color-border)] px-4 py-2.5">
        <p className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.15em] text-[var(--color-fg-muted)]">
          Recipes
        </p>
        <p className="font-[family-name:var(--font-mono)] text-[9px] tabular-nums text-[var(--color-code-muted)]">
          {MOTIONWIND_RECIPES.length}
        </p>
      </div>

      <nav
        className="min-h-0 flex-1 overflow-y-auto px-2 py-3 no-scrollbar"
        aria-label="Animation recipes"
      >
        <RecipeList editor={editor} onApply={onApply} />
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
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const feedbackTrigger = useRef<HTMLElement | null>(null);

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
    editor,
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
