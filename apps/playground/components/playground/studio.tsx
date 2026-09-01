"use client";

import { useCallback } from "react";
import { MOTIONWIND_RECIPES } from "motionwind-react";
import { PREVIEW_SKIN, STAGES } from "@/lib/types";
import { useStudioState } from "@/lib/use-studio-state";
import { useGeneratedCode } from "@/lib/use-generated-code";
import { PreviewStage } from "./preview-stage";
import { RecipeGrid } from "./recipe-grid";
import { ControlsPanel } from "./controls-panel";
import { Timeline } from "./timeline";

export function PlaygroundStudio() {
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

  const {
    parsed,
    generated,
    highlighted,
    duration,
    delay,
    activeRecipe,
    recipeSupportsTarget,
  } = useGeneratedCode(editor);

  const applyRecipe = useCallback(
    (recipe: (typeof MOTIONWIND_RECIPES)[number]) => {
      updateEditor({
        classes: `${recipe.classes} ${PREVIEW_SKIN}`,
        text: recipe.name,
      });
      replay();
    },
    [updateEditor, replay],
  );

  return (
    <div className="mt-6">
      {/* Toolbar: size + motion + replay + share */}
      <div className="flex flex-wrap items-center justify-between gap-3 border border-dashed border-[var(--color-border)] rounded-lg px-4 py-3 mb-4">
        <div
          className="flex rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-0.5"
          aria-label="Preview size"
        >
          {STAGES.map((size) => (
            <button
              key={size.id}
              type="button"
              aria-pressed={stage === size.id}
              onClick={() => setStage(size.id)}
              className="cursor-pointer rounded px-2.5 py-1 font-[family-name:var(--font-mono)] text-[9px] text-[var(--color-fg-muted)] aria-pressed:bg-[var(--color-surface-elevated)] aria-pressed:text-[var(--color-fg)]"
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
            className="flex cursor-pointer items-center gap-2 font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-wider text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
          >
            <span
              className={`h-2 w-2 rounded-full ${reduceMotion ? "bg-amber-400" : "bg-[var(--color-accent)]"}`}
            />
            {reduceMotion ? "Reduced" : "Full motion"}
          </button>
          <button
            type="button"
            onClick={replay}
            className="cursor-pointer rounded-md border border-[var(--color-border)] px-2.5 py-1.5 font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-wider text-[var(--color-fg-muted)] hover:text-[var(--color-accent)]"
          >
            Replay
          </button>
          <button
            type="button"
            onClick={() => copy("link", generated)}
            className="cursor-pointer rounded-md border border-[var(--color-border)] px-3 py-1.5 text-[11px] text-[var(--color-fg-muted)] transition hover:border-[var(--color-border)] hover:text-[var(--color-fg)]"
          >
            {copied === "link" ? "Link copied" : "Share"}
          </button>
          <button
            type="button"
            onClick={() => copy("code", generated)}
            className="cursor-pointer rounded-md bg-[var(--color-accent)] px-3 py-1.5 text-[11px] font-bold text-[var(--color-accent-fg)] transition hover:bg-[var(--color-accent-hover)]"
          >
            {copied === "code" ? "Copied" : "Copy code"}
          </button>
        </div>
      </div>

      <RecipeGrid editor={editor} onApply={applyRecipe} />

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
        highlighted={highlighted}
        activeRecipe={activeRecipe}
        recipeSupportsTarget={recipeSupportsTarget}
      />

      <span className="sr-only" aria-live="polite">
        {copied ? `${copied} copied` : ""}
      </span>
    </div>
  );
}
