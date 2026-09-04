"use client";

import { LazyMotion, domAnimation, m, AnimatePresence } from "motion/react";
import { MOTIONWIND_RECIPES } from "motionwind-react";
import type { MotionwindRecipe } from "motionwind-react";
import type { StudioState } from "@/lib/types";

const easeOutQuint: [number, number, number, number] = [0.23, 1, 0.32, 1];

const CATEGORIES: { id: MotionwindRecipe["category"]; label: string }[] = [
  { id: "interaction", label: "Interaction" },
  { id: "entrance", label: "Entrance" },
  { id: "scroll", label: "Scroll" },
  { id: "layout", label: "Layout" },
  { id: "loading", label: "Loading" },
];

function RecipeGroup({
  title,
  recipes,
  editor,
  onApply,
}: {
  title: string;
  recipes: MotionwindRecipe[];
  editor: StudioState;
  onApply: (recipe: MotionwindRecipe) => void;
}) {
  return (
    <div className="mb-6">
      <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.15em] text-[var(--color-fg-muted)] mb-2 px-3">
        {title}
      </p>
      <ul className="space-y-0.5">
        {recipes.map((recipe) => {
          const isActive = editor.classes.startsWith(recipe.classes);
          return (
            <li key={recipe.id}>
              <button
                type="button"
                onClick={() => onApply(recipe)}
                className={`
                  group relative flex w-full items-center gap-2.5 rounded-lg px-3 py-1.5
                  text-left text-[13px] transition-all duration-150
                  ${
                    isActive
                      ? "bg-[var(--color-accent)]/[0.06] text-[var(--color-accent)]"
                      : "text-[var(--color-fg-muted)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-fg)]"
                  }
                `}
              >
                {isActive && (
                  <m.span
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-full bg-[var(--color-accent)]"
                    transition={{
                      type: "spring",
                      stiffness: 350,
                      damping: 30,
                    }}
                  />
                )}
                <span className="truncate">{recipe.name}</span>
              </button>
            </li>
          );
        })}
      </ul>
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
  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex h-14 items-center border-b border-dashed border-[var(--color-border)] px-4">
        <span className="font-[family-name:var(--font-display)] text-xl italic tracking-tight text-[var(--color-fg)]">
          Studio
        </span>
        <span className="font-[family-name:var(--font-mono)] text-[9px] text-[var(--color-fg-muted)]/50 ml-2">
          playground
        </span>
      </div>

      {/* Recipes navigation */}
      <nav className="flex-1 overflow-y-auto py-2 px-2 no-scrollbar">
        {CATEGORIES.map(({ id, label }) => {
          const items = MOTIONWIND_RECIPES.filter(
            (recipe) => recipe.category === id,
          );
          if (items.length === 0) return null;
          return (
            <RecipeGroup
              key={id}
              title={label}
              recipes={items}
              editor={editor}
              onApply={onApply}
            />
          );
        })}
      </nav>

      {/* Footer hint */}
      <div className="border-t border-dashed border-[var(--color-border)] p-3">
        <p className="text-[11px] text-[var(--color-fg-muted)] text-center">
          Pick a recipe to get started
        </p>
      </div>
    </div>
  );

  return (
    <LazyMotion features={domAnimation}>
      {/* Desktop sidebar — collapsible */}
      <m.aside
        initial={false}
        animate={{ width: desktopCollapsed ? 0 : 260 }}
        transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="hidden md:flex h-screen flex-shrink-0 flex-col border-r border-dashed border-[var(--color-border)] bg-[var(--color-bg)] sticky top-0 overflow-hidden"
      >
        <div className="w-[260px] h-full">{sidebarContent}</div>
      </m.aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <m.div
              role="button"
              tabIndex={0}
              aria-label="Close navigation sidebar"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden"
              onClick={onCloseMobile}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onCloseMobile();
                }
              }}
            />
            <m.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.3, ease: easeOutQuint }}
              className="fixed left-0 top-0 z-50 h-screen w-[280px] bg-[var(--color-bg)] border-r border-[var(--color-border)] md:hidden"
            >
              {sidebarContent}
            </m.aside>
          </>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}
