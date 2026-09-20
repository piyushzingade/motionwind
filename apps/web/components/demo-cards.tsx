"use client";

import { useMemo, useState } from "react";
import {
  MOTIONWIND_RECIPES,
  mw,
  type MotionwindRecipe,
} from "motionwind-react";
import {
  CaretDownIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
} from "@phosphor-icons/react";
import { Reveal } from "./reveal";
import { ComponentPreviewCard } from "./component-preview-card";

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
      className="section-anchor relative overflow-hidden px-4 py-12 sm:px-6 sm:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-[1120px]">
        <Reveal>
          <div className="mb-10 max-w-2xl sm:mb-12">
            <h2 className="text-balance text-3xl font-semibold tracking-[-0.035em] text-fg sm:text-4xl md:text-5xl">
              The examples are the API.
            </h2>
            <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-fg-muted sm:text-lg">
              Nine focused previews, each showing one motion pattern you can
              author beside the element.
            </p>
          </div>
        </Reveal>

        <Reveal y={18}>
          <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe) => (
              <ComponentPreviewCard
                key={recipe.id}
                title={recipe.name}
                preview={<MiniRecipePreview recipe={recipe} />}
              />
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
    case "button-press":
      return (
        <span
          className={`${buttonSkin()} component-preview-press`}
          aria-hidden="true"
        >
          Preview
        </span>
      );
    case "dialog-enter":
      return (
        <mw.div className="component-preview-dialog w-48 rounded-xl border border-border bg-surface-elevated p-3 shadow-[0_12px_28px_-18px_var(--color-shadow)]">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-semibold text-fg">
              Quick actions
            </span>
            <span className="rounded border border-border-subtle px-1.5 py-0.5 text-[9px] text-code-muted">
              esc
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-md border border-border-subtle bg-surface px-2.5 py-2">
            <MagnifyingGlassIcon
              size={13}
              weight="regular"
              className="shrink-0 text-code-muted"
              aria-hidden="true"
            />
            <span className="text-[10px] text-code-muted">Search commands</span>
          </div>
          <div className="mt-3 grid gap-1.5">
            <div className="rounded-md bg-accent/10 px-2.5 py-1.5 text-[10px] text-accent">
              Open playground
            </div>
            <div className="rounded-md px-2.5 py-1.5 text-[10px] text-fg-muted">
              Read the docs
            </div>
          </div>
        </mw.div>
      );
    case "loading-orbit":
      return (
        <div
          className="component-preview-orbit relative flex size-48 items-center justify-center"
          aria-hidden="true"
        >
          <span className="component-preview-orbit-track component-preview-orbit-outer absolute size-42 rounded-full border border-accent/10">
            <span className="absolute -top-1 left-1/2 size-2 -translate-x-1/2 rounded-full bg-accent/70" />
          </span>
          <span className="component-preview-orbit-track component-preview-orbit-middle absolute size-24 rounded-full border border-accent/20">
            <span className="absolute -top-1 left-1/2 size-2.5 -translate-x-1/2 rounded-full bg-accent shadow-[0_0_10px_var(--color-accent)]" />
          </span>
          <span className="component-preview-orbit-track component-preview-orbit-inner absolute size-12 rounded-full border border-accent/30">
            <span className="absolute -top-1 left-1/2 size-2 -translate-x-1/2 rounded-full bg-accent/80" />
          </span>
          <span className="size-2.5 rounded-full bg-accent/70 shadow-[0_0_14px_var(--color-accent)]" />
        </div>
      );
    case "menu-pop":
      return (
        <mw.div className="component-preview-menu grid w-48 gap-2 rounded-xl border border-border bg-surface-elevated p-3">
          <span className="component-preview-menu-item flex h-8 items-center rounded-md bg-surface px-3 text-[10px] text-fg-muted">
            Open playground
          </span>
          <span className="component-preview-menu-item flex h-8 items-center rounded-md bg-accent/10 px-3 text-[10px] text-accent">
            Read the docs
          </span>
          <span className="component-preview-menu-item flex h-8 items-center rounded-md bg-surface px-3 text-[10px] text-fg-muted">
            Copy classes
          </span>
        </mw.div>
      );
    case "accordion-reveal":
      return (
        <div className="component-preview-accordion w-56 overflow-hidden rounded-xl border border-border bg-surface-elevated">
          <div className="flex items-center justify-between border-b border-border-subtle px-4 py-3">
            <span className="text-[11px] font-semibold text-fg">
              Motion output
            </span>
            <span className="component-preview-accordion-chevron flex size-6 items-center justify-center rounded-md bg-accent/10 text-accent">
              <CaretDownIcon size={13} weight="bold" aria-hidden="true" />
            </span>
          </div>
          <div className="component-preview-accordion-content px-4 py-4">
            <p className="text-[11px] leading-relaxed text-fg-muted">
              Utility classes compile into Motion props.
            </p>
            <div className="mt-2 grid gap-1.5">
              <span className="h-2 w-4/5 rounded-full bg-accent/30" />
              <span className="h-2 w-3/5 rounded-full bg-border" />
            </div>
          </div>
        </div>
      );
    case "tab-indicator":
      return (
        <div
          className="component-preview-tabs relative flex w-48 rounded-xl border border-border bg-surface-elevated p-1.5"
          aria-hidden="true"
        >
          <span className="component-preview-tab-indicator absolute inset-y-1.5 left-1.5 w-[calc((100%_-_0.75rem)_/_3)] rounded-lg bg-accent" />
          {["A", "B", "C"].map((tab) => (
            <span
              key={tab}
              className="relative z-10 flex flex-1 items-center justify-center rounded-lg py-2 text-xs font-medium text-fg"
            >
              {tab}
            </span>
          ))}
        </div>
      );
    case "toast-enter":
      return (
        <mw.div className="component-preview-toast w-48 rounded-xl border border-border bg-surface-elevated p-2.5 shadow-[0_12px_28px_-18px_var(--color-shadow)]">
          <div className="flex items-start gap-2.5">
            <CheckCircleIcon
              size={16}
              weight="fill"
              className="shrink-0 text-accent"
              aria-hidden="true"
            />
            <div className="min-w-0">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[10px] font-semibold text-fg">
                  Classes copied
                </span>
                <span className="text-[8px] text-code-muted">now</span>
              </div>
              <p className="mt-0.5 whitespace-nowrap text-[9px] leading-relaxed text-fg-muted">
                Motion props are ready to paste.
              </p>
            </div>
          </div>
        </mw.div>
      );
    case "svg-line-loader":
      return (
        <svg
          viewBox="0 0 120 56"
          className="h-16 w-32 text-accent"
          aria-hidden="true"
        >
          <path
            className="component-preview-svg-line"
            d="M10 34 C32 6 52 6 60 34 S92 62 110 34"
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            pathLength="1"
          />
        </svg>
      );
    case "scroll-progress":
      return (
        <div className="w-36">
          <div className="h-2 overflow-hidden rounded-full bg-border-subtle">
            <mw.div className="h-full origin-left rounded-full bg-accent" />
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
          <div className="h-3 rounded-full bg-border" />
          <div className="h-3 w-4/5 rounded-full bg-border" />
          <div className="h-12 rounded-lg bg-border" />
        </div>
      );
    case "card-hover":
      return (
        <article className="component-preview-card-hover w-48 rounded-xl border border-border bg-surface-elevated p-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] font-semibold text-fg">
              Motionwind
            </span>
            <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[9px] text-accent">
              ready
            </span>
          </div>
          <p className="mt-2 text-[10px] leading-relaxed text-fg-muted">
            Motion that stays out of the way until it matters.
          </p>
          <div className="mt-4 flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-accent" />
            <span className="text-[9px] text-code-muted">hover to explore</span>
          </div>
        </article>
      );
    default:
      return (
        <mw.div className="component-preview-card-hover rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-accent-fg">
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
