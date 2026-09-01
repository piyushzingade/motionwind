"use client";

import Link from "next/link";
import { MOTIONWIND_RECIPES } from "motionwind-react";
import { ThemeToggle } from "../../components/theme-toggle";
import { useStudioState } from "./use-studio-state";
import { useGeneratedCode } from "./use-generated-code";
import { replaceClass } from "./utils";
import { PREVIEW_SKIN, STAGES } from "./types";
import type { MotionwindRecipe } from "motionwind-react";
import { RecipeButton } from "./recipe-button";
import { RangeControl } from "./range-control";
import { Timeline } from "./timeline";
import { PreviewStage } from "./preview-stage";
import { ControlsPanel } from "./controls-panel";
import { TargetSelector } from "./target-selector";

export default function StudioPage() {
  const {
    editor,
    stage,
    setStage,
    reduceMotion,
    setReduceMotion,
    replayKey,
    replay,
    copied,
    copy,
    updateEditor,
  } = useStudioState();

  const { parsed, generated, highlighted, duration, delay, stiffness, damping, activeRecipe, recipeSupportsTarget } =
    useGeneratedCode(editor);

  const applyRecipe = (recipe: MotionwindRecipe) => {
    updateEditor({ classes: `${recipe.classes} ${PREVIEW_SKIN}`, text: recipe.name });
    replay();
  };

  return (
    <main className="min-h-screen bg-surface text-foreground">
      <header className="sticky top-0 z-200 flex h-14 items-center justify-between border-b border-border-subtle bg-surface/80 px-4 backdrop-blur-xl md:px-6">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="font-mono text-xs font-bold tracking-[-0.03em] text-acid hover:text-acid-dim transition-colors"
          >
            motionwind
          </Link>
          <span className="hidden h-4 w-px bg-border-strong sm:block" />
          <div>
            <h1 className="text-xs font-semibold">Motion Studio</h1>
            <p className="hidden font-mono text-[8px] uppercase tracking-[0.2em] text-text-muted sm:block">
              Classes in · production code out
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => copy("link", generated)}
            className="cursor-pointer rounded-md border border-border-subtle px-3 py-1.5 text-[11px] text-text-dim transition hover:border-border-strong hover:text-foreground"
          >
            {copied === "link" ? "Link copied" : "Share"}
          </button>
          <button
            type="button"
            onClick={() => copy("code", generated)}
            className="cursor-pointer rounded-md bg-acid px-3 py-1.5 text-[11px] font-bold text-[var(--color-accent-fg)] transition hover:bg-acid-dim"
          >
            {copied === "code" ? "Copied" : "Copy code"}
          </button>
        </div>
      </header>

      <div className="grid min-h-[calc(100vh-3.5rem)] xl:grid-cols-[220px_minmax(0,1fr)_320px]">
        {/* Recipe sidebar */}
        <aside className="border-b border-border-subtle bg-surface-overlay xl:border-b-0 xl:border-r">
          <div className="border-b border-border-subtle px-4 py-3 font-mono text-[9px] uppercase tracking-[0.2em] text-text-muted">
            Reviewed recipes
          </div>
          <div className="grid sm:grid-cols-2 xl:block">
            {MOTIONWIND_RECIPES.map((recipe) => (
              <RecipeButton
                key={recipe.id}
                recipe={recipe}
                active={editor.classes.startsWith(recipe.classes)}
                onClick={() => applyRecipe(recipe)}
              />
            ))}
          </div>
          <div className="m-4 rounded-lg border border-acid/10 bg-acid-soft p-3">
            <div className="mb-1 font-mono text-[9px] uppercase tracking-wider text-acid">
              Registry contract
            </div>
            <p className="text-[10px] leading-relaxed text-text-muted">
              Every recipe declares adapters, accessibility guidance, source,
              version, and maintainer.
            </p>
          </div>
        </aside>

        {/* Main preview area */}
        <section className="min-w-0 bg-background">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle px-4 py-3 md:px-5">
            <div
              className="flex rounded-md border border-border-subtle bg-surface-inset p-0.5"
              aria-label="Preview size"
            >
              {STAGES.map((size) => (
                <button
                  key={size.id}
                  type="button"
                  aria-pressed={stage === size.id}
                  onClick={() => setStage(size.id)}
                  className="cursor-pointer rounded px-2.5 py-1 font-mono text-[9px] text-text-muted aria-pressed:bg-surface-overlay aria-pressed:text-foreground"
                >
                  {size.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-pressed={reduceMotion}
                onClick={() => setReduceMotion((v) => !v)}
                className="flex cursor-pointer items-center gap-2 font-mono text-[9px] uppercase tracking-wider text-text-muted hover:text-foreground"
              >
                <span
                  className={`h-2 w-2 rounded-full ${reduceMotion ? "bg-amber-400" : "bg-acid"}`}
                />
                {reduceMotion ? "Reduced" : "Full motion"}
              </button>
              <button
                type="button"
                onClick={replay}
                className="cursor-pointer rounded-md border border-border-subtle px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-wider text-text-dim hover:text-acid"
              >
                ↻ Replay
              </button>
            </div>
          </div>

          <PreviewStage
            tag={editor.tag}
            classes={editor.classes}
            text={editor.text}
            stage={stage}
            reduceMotion={reduceMotion}
            replayKey={replayKey}
          />

          <Timeline duration={duration} delay={delay} replayKey={replayKey} />

          <ControlsPanel
            editor={editor}
            updateEditor={updateEditor}
            parsed={parsed}
            activeRecipe={activeRecipe}
            recipeSupportsTarget={recipeSupportsTarget}
          />
        </section>

        {/* Properties + code panel */}
        <aside className="border-t border-border-subtle bg-surface-overlay xl:border-l xl:border-t-0">
          <div className="border-b border-border-subtle p-4">
            <div className="grid gap-5">
              <RangeControl
                id="duration"
                label="Duration"
                value={duration}
                min={80}
                max={1600}
                step={20}
                unit="ms"
                onChange={(value) =>
                  updateEditor({
                    classes: replaceClass(
                      editor.classes,
                      /^animate-duration-/,
                      `animate-duration-${value}`,
                    ),
                  })
                }
              />
              <RangeControl
                id="stiffness"
                label="Stiffness"
                value={stiffness}
                min={40}
                max={700}
                step={10}
                onChange={(value) =>
                  updateEditor({
                    classes: replaceClass(
                      editor.classes,
                      /^animate-stiffness-/,
                      `animate-stiffness-${value}`,
                    ),
                  })
                }
              />
              <RangeControl
                id="damping"
                label="Damping"
                value={damping}
                min={4}
                max={60}
                onChange={(value) =>
                  updateEditor({
                    classes: replaceClass(
                      editor.classes,
                      /^animate-damping-/,
                      `animate-damping-${value}`,
                    ),
                  })
                }
              />
            </div>
          </div>
          <TargetSelector
            editor={editor}
            updateEditor={updateEditor}
            highlighted={highlighted}
          />
        </aside>
      </div>
      <span className="sr-only" aria-live="polite">
        {copied ? `${copied} copied` : ""}
      </span>
    </main>
  );
}