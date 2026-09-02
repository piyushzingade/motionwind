"use client";

import { LazyMotion, domAnimation, m } from "motion/react";
import { MOTIONWIND_RECIPES } from "motionwind-react";
import type { MotionwindRecipe } from "motionwind-react";
import type { StudioState } from "@/lib/types";

const CATEGORIES: { id: MotionwindRecipe["category"]; label: string }[] = [
  { id: "interaction", label: "Interaction" },
  { id: "entrance", label: "Entrance" },
  { id: "scroll", label: "Scroll" },
  { id: "layout", label: "Layout" },
  { id: "loading", label: "Loading" },
];

export function RecipeSidebar({
  editor,
  onApply,
}: {
  editor: StudioState;
  onApply: (recipe: MotionwindRecipe) => void;
}) {
  return (
    <LazyMotion features={domAnimation}>
      <div className="mb-4 overflow-hidden rounded-lg border border-dashed border-[var(--color-border)]">
        <div className="border-b border-[var(--color-border-subtle)] px-4 py-2 font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">
          Recipes
        </div>
        <nav className="max-h-[260px] overflow-y-auto p-2 no-scrollbar">
          {CATEGORIES.map(({ id, label }) => {
            const items = MOTIONWIND_RECIPES.filter(
              (recipe) => recipe.category === id,
            );
            if (items.length === 0) return null;
            return (
              <div key={id} className="mb-5 last:mb-0">
                <p className="mb-2 px-3 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.15em] text-[var(--color-fg-muted)]">
                  {label}
                </p>
                <ul className="space-y-0.5">
                  {items.map((recipe) => {
                    const isActive = editor.classes.startsWith(recipe.classes);
                    return (
                      <li key={recipe.id}>
                        <button
                          type="button"
                          onClick={() => onApply(recipe)}
                          aria-pressed={isActive}
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
          })}
        </nav>
      </div>
    </LazyMotion>
  );
}
