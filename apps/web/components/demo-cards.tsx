"use client";

import { useMemo, useState } from "react";
import {
  MOTIONWIND_RECIPES,
  mw,
  type MotionwindRecipe,
} from "motionwind-react";
import { Reveal } from "./reveal";

const TOP_EXAMPLE_IDS = [
  "button-press",
  "dialog-enter",
  "loading-orbit",
  "menu-pop",
  "accordion-reveal",
  "tab-indicator",
  "toast-enter",
  "svg-line-loader",
  "card-hover",
] as const;

const TAG_BY_RECIPE: Record<string, string> = {
  "button-press": "button",
  "magnetic-button": "button",
  "card-hover": "article",
  "sortable-item": "li",
  "drag-reorder": "li",
  "svg-line-loader": "path",
  "scroll-progress": "div",
  "parallax-scroll": "div",
};

export function DemoCards() {
  const recipes = useMemo(
    () =>
      TOP_EXAMPLE_IDS.map((id) =>
        MOTIONWIND_RECIPES.find((recipe) => recipe.id === id),
      ).filter(Boolean) as MotionwindRecipe[],
    [],
  );

  return (
    <section
      id="demos"
      className="section-anchor relative overflow-hidden px-4 py-16 sm:px-6 sm:py-22 lg:py-24"
    >
      <div className="mx-auto max-w-[1120px]">
        <Reveal>
          <div className="mb-12 max-w-2xl sm:mb-14">
            <h2 className="text-balance text-3xl font-semibold tracking-[-0.035em] text-fg sm:text-4xl md:text-5xl">
              The examples are the API.
            </h2>
            <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-fg-muted sm:text-lg">
              A wall of real previews first, then the exact class string and
              generated Motion output when you want to inspect the details.
            </p>
          </div>
        </Reveal>

        <Reveal y={18}>
          <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe, index) => (
              <article
                key={recipe.id}
                className="group relative flex h-[308.5px] flex-col overflow-hidden rounded-2xl border border-border bg-surface-elevated p-6 text-left transition-[border-color,background-color,transform] duration-200 hover:border-accent/25"
              >
                <div className="studio-checker flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-xl">
                  <div
                    className="web-component-loop"
                    style={{ animationDelay: `${(index % 3) * 180}ms` }}
                  >
                    <MiniRecipePreview recipe={recipe} />
                  </div>
                </div>

                <div className="mt-5 border-t border-border-subtle pt-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-[13px] font-medium text-fg">
                      {recipe.name}
                    </span>
                    <span className="shrink-0 rounded-md bg-surface px-2 py-0.5 font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-wider text-code-muted">
                      {recipe.category}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function _RecipePreview({ recipe }: { recipe: MotionwindRecipe }) {
  switch (recipe.id) {
    case "button-press":
    case "magnetic-button":
      return (
        <mw.button className={`${recipe.classes} ${buttonSkin()}`}>
          {_getRecipeText(recipe)}
        </mw.button>
      );
    case "dialog-enter":
      return (
        <mw.div className={`${recipe.classes} ${panelSkin()} w-full max-w-sm`}>
          <div className="text-sm font-semibold text-fg">Command palette</div>
          <p className="mt-2 text-xs leading-relaxed text-fg-muted">
            Opens with a short lift, then gets out of the way.
          </p>
        </mw.div>
      );
    case "page-reveal":
      return (
        <mw.section className={`${recipe.classes} ${panelSkin()} max-w-md`}>
          <div className="text-sm font-semibold text-fg">Section reveal</div>
          <p className="mt-2 text-xs leading-relaxed text-fg-muted">
            Scroll-triggered, one time, and still readable before motion runs.
          </p>
        </mw.section>
      );
    case "loading-orbit":
      return (
        <mw.div
          aria-label="Loading"
          className={`${recipe.classes} flex h-16 w-16 items-center justify-center rounded-2xl border border-accent/30 bg-accent/10`}
        >
          <span className="h-5 w-5 rounded-full border-2 border-accent border-t-transparent" />
        </mw.div>
      );
    case "menu-pop":
      return (
        <mw.div
          className={`${recipe.classes} w-64 rounded-xl border border-border bg-surface-elevated p-2`}
        >
          {["Copy classes", "Open in playground", "View docs"].map((item) => (
            <div
              key={item}
              className="rounded-lg px-3 py-2 text-sm text-fg hover:bg-surface"
            >
              {item}
            </div>
          ))}
        </mw.div>
      );
    case "accordion-reveal":
      return (
        <div className="w-full max-w-md rounded-xl border border-border bg-surface-elevated">
          <div className="border-b border-border-subtle px-4 py-3 text-sm font-semibold">
            Runtime output
          </div>
          <mw.div
            className={`${recipe.classes} px-4 py-4 text-sm leading-relaxed text-fg-muted`}
          >
            Motionwind emits Motion props and leaves your static Tailwind
            classes intact.
          </mw.div>
        </div>
      );
    case "tab-indicator":
      return <TabIndicatorPreview recipe={recipe} />;
    case "toast-enter":
      return (
        <mw.div className={`${recipe.classes} ${panelSkin()} w-full max-w-sm`}>
          <div className="text-sm font-semibold">Recipe copied</div>
          <p className="mt-1 text-xs text-fg-muted">
            Paste it into any supported adapter.
          </p>
        </mw.div>
      );
    case "sortable-item":
    case "drag-reorder":
      return (
        <ul className="grid w-full max-w-sm gap-2">
          {["Compile classes", "Generate props", "Ship interaction"].map(
            (item, index) => (
              <mw.li
                key={item}
                className={`${index === 1 ? recipe.classes : ""} cursor-grab rounded-xl border border-border bg-surface-elevated px-4 py-3 text-sm text-fg active:cursor-grabbing`}
              >
                {item}
              </mw.li>
            ),
          )}
        </ul>
      );
    case "svg-line-loader":
      return (
        <svg
          viewBox="0 0 160 80"
          className="h-28 w-56 text-accent"
          role="img"
          aria-label="Animated line loader"
        >
          <mw.path
            className={recipe.classes}
            d="M16 48 C42 8 68 8 80 48 S118 88 144 48"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
          />
        </svg>
      );
    case "scroll-progress":
      return (
        <div className="w-full max-w-md">
          <div className="mb-3 text-xs text-fg-muted">
            Bound to page scroll progress
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-border-subtle">
            <mw.div
              className={`${recipe.classes} h-full origin-left rounded-full bg-accent`}
            />
          </div>
        </div>
      );
    case "flip-card":
      return (
        <div className="perspective-[900px]">
          <mw.div
            className={`${recipe.classes} flex h-40 w-56 items-center justify-center rounded-2xl border border-border bg-surface-elevated text-sm font-semibold text-fg`}
            style={{ transformStyle: "preserve-3d" }}
          >
            Hover to flip
          </mw.div>
        </div>
      );
    case "drawer":
      return (
        <div className="relative h-56 w-full max-w-md overflow-hidden rounded-xl border border-border bg-surface">
          <mw.div
            className={`${recipe.classes} absolute inset-y-0 right-0 w-64 border-l border-border bg-surface-elevated p-5`}
          >
            <div className="text-sm font-semibold">Inspector</div>
            <p className="mt-2 text-xs leading-relaxed text-fg-muted">
              Slides in and exits with the same class language.
            </p>
          </mw.div>
        </div>
      );
    case "tooltip-pop":
      return (
        <div className="relative flex h-32 items-end justify-center">
          <button className={buttonSkin()}>Hover target</button>
          <mw.div
            className={`${recipe.classes} absolute bottom-16 rounded-lg border border-border bg-surface-elevated px-3 py-2 text-xs text-fg`}
          >
            Motionwind tooltip
          </mw.div>
        </div>
      );
    case "skeleton-pulse":
      return (
        <div className="grid w-full max-w-sm gap-3">
          <mw.div className={`${recipe.classes} h-4 rounded-full bg-border`} />
          <mw.div
            className={`${recipe.classes} h-4 w-4/5 rounded-full bg-border`}
          />
          <mw.div className={`${recipe.classes} h-24 rounded-xl bg-border`} />
        </div>
      );
    case "card-hover":
      return (
        <mw.article
          className={`${recipe.classes} ${panelSkin()} max-w-sm cursor-pointer`}
        >
          <div className="text-sm font-semibold">Interactive card</div>
          <p className="mt-2 text-xs leading-relaxed text-fg-muted">
            Lift, scale, and spring response in a single class list.
          </p>
        </mw.article>
      );
    case "parallax-scroll":
      return (
        <div className="relative h-64 w-full max-w-md overflow-hidden rounded-2xl border border-border bg-surface">
          <mw.div
            className={`${recipe.classes} absolute left-1/2 top-16 h-32 w-32 -translate-x-1/2 rounded-2xl bg-accent/25`}
          />
          <div className="absolute inset-x-6 bottom-6 rounded-xl bg-surface-elevated p-4 text-sm text-fg">
            Layer follows scroll progress
          </div>
        </div>
      );
    default:
      return (
        <mw.div className={`${recipe.classes} ${buttonSkin()}`}>
          {_getRecipeText(recipe)}
        </mw.div>
      );
  }
}

function MiniRecipePreview({ recipe }: { recipe: MotionwindRecipe }) {
  switch (recipe.id) {
    case "dialog-enter":
      return (
        <mw.div
          className={`${recipe.classes} w-36 rounded-xl border border-border bg-surface-elevated p-3`}
        >
          <div className="h-2.5 w-20 rounded-full bg-fg/20" />
          <div className="mt-2 h-2 w-28 rounded-full bg-border" />
        </mw.div>
      );
    case "loading-orbit":
      return (
        <mw.div
          className={`${recipe.classes} flex h-12 w-12 items-center justify-center rounded-xl border border-accent/30 bg-accent/10`}
        >
          <span className="h-4 w-4 rounded-full border-2 border-accent border-t-transparent" />
        </mw.div>
      );
    case "menu-pop":
      return (
        <mw.div
          className={`${recipe.classes} grid w-36 gap-1.5 rounded-xl border border-border bg-surface-elevated p-2`}
        >
          <span className="h-7 rounded-md bg-surface" />
          <span className="h-7 rounded-md bg-accent/10" />
          <span className="h-7 rounded-md bg-surface" />
        </mw.div>
      );
    case "tab-indicator":
      return (
        <div className="flex rounded-xl border border-border bg-surface-elevated p-1.5">
          {["A", "B", "C"].map((tab, index) => (
            <span
              key={tab}
              className={`rounded-lg px-3 py-2 text-xs ${
                index === 1 ? "bg-accent/10 text-accent" : "text-code-muted"
              }`}
            >
              {tab}
            </span>
          ))}
        </div>
      );
    case "toast-enter":
      return (
        <mw.div
          className={`${recipe.classes} w-40 rounded-xl border border-border bg-surface-elevated p-3`}
        >
          <div className="h-2.5 w-24 rounded-full bg-fg/20" />
          <div className="mt-2 h-2 w-32 rounded-full bg-border" />
        </mw.div>
      );
    case "svg-line-loader":
      return (
        <svg
          viewBox="0 0 120 56"
          className="h-16 w-32 text-accent"
          aria-hidden="true"
        >
          <mw.path
            className={recipe.classes}
            d="M10 34 C32 6 52 6 60 34 S92 62 110 34"
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </svg>
      );
    case "scroll-progress":
      return (
        <div className="w-36">
          <div className="h-2 overflow-hidden rounded-full bg-border-subtle">
            <mw.div
              className={`${recipe.classes} h-full origin-left rounded-full bg-accent`}
            />
          </div>
          <div className="mt-3 grid gap-1.5">
            <span className="h-2 rounded-full bg-border" />
            <span className="h-2 w-2/3 rounded-full bg-border" />
          </div>
        </div>
      );
    case "skeleton-pulse":
      return (
        <div className="grid w-36 gap-2">
          <mw.div className={`${recipe.classes} h-3 rounded-full bg-border`} />
          <mw.div
            className={`${recipe.classes} h-3 w-4/5 rounded-full bg-border`}
          />
          <mw.div className={`${recipe.classes} h-12 rounded-lg bg-border`} />
        </div>
      );
    default:
      return (
        <mw.div
          className={`${recipe.classes} rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-accent-fg`}
        >
          Preview
        </mw.div>
      );
  }
}

function TabIndicatorPreview({ recipe }: { recipe: MotionwindRecipe }) {
  const [active, setActive] = useState("Preview");
  const tabs = ["Preview", "Classes", "Output"];

  return (
    <div className="rounded-xl border border-border bg-surface-elevated p-2">
      <div className="flex gap-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActive(tab)}
            className="relative cursor-pointer rounded-lg px-4 py-2 text-sm text-fg-muted transition-colors hover:text-fg active:scale-[0.98]"
          >
            {active === tab && (
              <mw.span
                className={`${recipe.classes} absolute inset-0 rounded-lg bg-accent/12`}
              />
            )}
            <span className="relative">{tab}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function _getRecipeTag(recipe: MotionwindRecipe) {
  return TAG_BY_RECIPE[recipe.id] ?? "div";
}

function _getRecipeText(recipe: MotionwindRecipe) {
  if (recipe.id === "button-press") return "Press me";
  if (recipe.id === "magnetic-button") return "Magnetic";
  if (recipe.id === "card-hover") return "Preview card";
  return recipe.name;
}

function buttonSkin() {
  return "cursor-pointer rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-accent-fg";
}

function panelSkin() {
  return "rounded-2xl border border-border bg-surface-elevated p-5";
}
