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
      className="group w-full cursor-pointer border-b border-border-subtle px-4 py-3 text-left transition-colors hover:bg-surface-inset/60 aria-pressed:bg-acid-soft"
    >
      <span className="mb-1 flex items-center justify-between text-xs font-semibold text-foreground">
        {recipe.name}
        <span className="font-mono text-[9px] uppercase tracking-wider text-text-muted group-aria-pressed:text-acid">
          {recipe.category}
        </span>
      </span>
      <span className="block text-[11px] leading-relaxed text-text-muted">
        {recipe.description}
      </span>
    </button>
  );
}
