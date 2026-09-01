import type { MotionwindRecipe } from "motionwind-react";

export function RecipeButton({
  recipe,
  active,
  onClick,
}: {
  recipe: MotionwindRecipe;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className="group w-full cursor-pointer border-b border-[var(--color-border-subtle)] px-4 py-3 text-left transition-colors hover:bg-[var(--color-surface)] aria-pressed:bg-[var(--color-accent)]/[0.06]"
    >
      <span className="mb-1 flex items-center justify-between text-xs font-semibold text-[var(--color-fg)]">
        {recipe.name}
        <span className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-wider text-[var(--color-fg-muted)] group-aria-pressed:text-[var(--color-accent)]">
          {recipe.category}
        </span>
      </span>
      <span className="block text-[11px] leading-relaxed text-[var(--color-fg-muted)]">
        {recipe.description}
      </span>
    </button>
  );
}
