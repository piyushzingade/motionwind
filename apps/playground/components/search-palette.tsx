"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { MOTIONWIND_RECIPES } from "motionwind-react";
import type { MotionwindRecipe } from "motionwind-react";
import type { StudioState } from "@/lib/types";
import { RECIPE_SCENE_ICONS } from "./playground/recipe-preview";
import { CATEGORY_ICONS } from "./playground-sidebar";

export function SearchPalette({
  editor,
  onApply,
}: {
  editor: StudioState;
  onApply: (recipe: MotionwindRecipe) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const optionRefs = useRef(new Map<number, HTMLLIElement>());

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const results = useMemo(
    () =>
      MOTIONWIND_RECIPES.filter((recipe) => {
        if (!deferredQuery) return true;
        return `${recipe.name} ${recipe.id} ${recipe.category} ${recipe.classes}`
          .toLowerCase()
          .includes(deferredQuery);
      }),
    [deferredQuery],
  );

  useEffect(() => {
    setActiveIndex(0);
  }, [deferredQuery]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
    }
  }, [open]);

  useEffect(() => {
    optionRefs.current.get(activeIndex)?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  function apply(recipe: MotionwindRecipe) {
    onApply(recipe);
    setOpen(false);
  }

  function onInputKeyDown(event: React.KeyboardEvent) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) =>
        results.length ? (index + 1) % results.length : 0,
      );
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) =>
        results.length ? (index - 1 + results.length) % results.length : 0,
      );
    } else if (event.key === "Enter") {
      const recipe = results[activeIndex];
      if (recipe) {
        event.preventDefault();
        apply(recipe);
      }
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search recipes (Command + K)"
        title="Search recipes (Command or Control + K)"
        className="control-press inline-flex h-8 shrink-0 items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 text-[var(--color-fg-muted)] transition-[border-color,color,background-color] duration-150 hover:border-[var(--color-accent)]/30 hover:text-[var(--color-fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/45"
      >
        <MagnifyingGlassIcon size={14} />
        <span className="hidden text-xs lg:inline">Search recipes</span>
        <kbd className="hidden items-center gap-0.5 rounded border border-[var(--color-border)] bg-[var(--color-bg)] px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[9px] text-[var(--color-fg-muted)] sm:inline-flex">
          ⌘K
        </kbd>
      </button>

      <Dialog.Portal>
        <Dialog.Overlay className="palette-overlay fixed inset-0 z-[100] bg-black/55" />
        <Dialog.Content
          aria-label="Search recipes"
          className="palette-content fixed left-1/2 top-[12dvh] z-[200] w-[min(92vw,560px)] -translate-x-1/2 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] shadow-[0_24px_80px_-24px_var(--color-shadow)] focus:outline-none"
        >
          <Dialog.Title className="sr-only">Search recipes</Dialog.Title>
          <div className="flex items-center gap-2.5 border-b border-dashed border-[var(--color-border)] px-4">
            <MagnifyingGlassIcon
              size={15}
              className="shrink-0 text-[var(--color-fg-muted)]"
            />
            <input
              autoFocus
              role="combobox"
              aria-expanded="true"
              aria-controls="recipe-search-list"
              aria-activedescendant={
                results[activeIndex]
                  ? `recipe-option-${results[activeIndex]!.id}`
                  : undefined
              }
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={onInputKeyDown}
              placeholder="Search recipes, categories, classes…"
              className="h-12 w-full bg-transparent text-sm text-[var(--color-fg)] outline-none placeholder:text-[var(--color-fg-muted)]/70"
            />
            <kbd className="shrink-0 rounded border border-[var(--color-border)] bg-[var(--color-bg)] px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[9px] text-[var(--color-fg-muted)]">
              ESC
            </kbd>
          </div>

          {results.length > 0 ? (
            <ul
              id="recipe-search-list"
              role="listbox"
              aria-label="Recipes"
              className="max-h-[min(46dvh,340px)] overflow-y-auto p-2"
            >
              {results.map((recipe, index) => {
                const RecipeIcon =
                  RECIPE_SCENE_ICONS[recipe.id] ??
                  CATEGORY_ICONS[recipe.category];
                const isActive = index === activeIndex;
                const isApplied = editor.classes.startsWith(recipe.classes);
                return (
                  <li
                    key={recipe.id}
                    id={`recipe-option-${recipe.id}`}
                    ref={(node) => {
                      if (node) optionRefs.current.set(index, node);
                      else optionRefs.current.delete(index);
                    }}
                    role="option"
                    aria-selected={isActive}
                    onClick={() => apply(recipe)}
                    onMouseMove={() => setActiveIndex(index)}
                    className={`flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] transition-[color,background-color] duration-100 ${
                      isActive
                        ? "bg-[var(--color-accent)]/[0.08] text-[var(--color-fg)]"
                        : "text-[var(--color-fg-muted)]"
                    }`}
                  >
                    <RecipeIcon
                      size={15}
                      weight={isActive || isApplied ? "fill" : "regular"}
                      className={`shrink-0 ${isApplied ? "text-[var(--color-accent)]" : ""}`}
                    />
                    <span className="min-w-0 flex-1 truncate">
                      {recipe.name}
                    </span>
                    <span className="shrink-0 font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.1em] text-[var(--color-code-muted)]">
                      {recipe.category}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="flex flex-col items-center px-5 py-8 text-center">
              <p className="text-xs font-medium text-[var(--color-fg)]">
                No recipes found
              </p>
              <p className="mt-1 max-w-[28ch] text-[11px] leading-relaxed text-[var(--color-fg-muted)]">
                Try another term — names, categories, and class names all match.
              </p>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-dashed border-[var(--color-border)] px-4 py-2.5 font-[family-name:var(--font-mono)] text-[9px] tabular-nums text-[var(--color-fg-muted)]">
            <span>
              {results.length} of {MOTIONWIND_RECIPES.length} recipes
            </span>
            <span className="hidden sm:inline">
              ↑↓ navigate · ↵ apply · esc close
            </span>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
