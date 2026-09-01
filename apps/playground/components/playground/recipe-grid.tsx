"use client";

import { MOTIONWIND_RECIPES } from "motionwind-react";
import type { StudioState } from "@/lib/types";
import type { MotionwindRecipe } from "motionwind-react";
import { RecipeButton } from "./recipe-button";

export function RecipeGrid({
  editor,
  onApply,
}: {
  editor: StudioState;
  onApply: (recipe: MotionwindRecipe) => void;
}) {
  return (
    <div className="border border-dashed border-[var(--color-border)] rounded-lg overflow-hidden mb-4">
      <div className="border-b border-[var(--color-border-subtle)] px-4 py-2 font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">
        Recipes
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 max-h-[240px] overflow-y-auto">
        {MOTIONWIND_RECIPES.map((recipe) => (
          <RecipeButton
            key={recipe.id}
            recipe={recipe}
            active={editor.classes.startsWith(recipe.classes)}
            onClick={() => onApply(recipe)}
          />
        ))}
      </div>
    </div>
  );
}
