"use client";

import { TAGS, TARGETS } from "@/lib/types";
import type { StudioState } from "@/lib/types";
import type { MotionwindRecipe } from "motionwind-react";
import { CheckCircleIcon, WarningCircleIcon } from "@phosphor-icons/react";
import { ControlLabel } from "./control-label";

export function ControlsPanel({
  editor,
  updateEditor,
  parsed,
  highlighted,
  activeRecipe,
  recipeSupportsTarget,
}: {
  editor: StudioState;
  updateEditor: (patch: Partial<StudioState>) => void;
  parsed: ReturnType<
    typeof import("@/lib/use-generated-code").useGeneratedCode
  >["parsed"];
  highlighted: React.ReactNode[];
  activeRecipe: MotionwindRecipe | undefined;
  recipeSupportsTarget: boolean;
}) {
  return (
    <div className="grid lg:grid-cols-2">
      <div className="border-b border-[var(--color-border)] p-4 lg:border-b-0 lg:border-r">
        <ControlLabel htmlFor="studio-classes">Motionwind classes</ControlLabel>
        <textarea
          id="studio-classes"
          aria-label="Motionwind classes"
          value={editor.classes}
          onChange={(event) => updateEditor({ classes: event.target.value })}
          spellCheck={false}
          rows={6}
          className="w-full resize-y rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-3 font-[family-name:var(--font-mono)] text-[11px] leading-relaxed text-[var(--color-accent)] outline-none transition-[border-color,box-shadow] duration-150 focus:border-[var(--color-accent)]/40 focus:ring-2 focus:ring-[var(--color-accent)]/10"
        />
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div>
            <ControlLabel htmlFor="studio-element">Element</ControlLabel>
            <select
              id="studio-element"
              value={editor.tag}
              onChange={(event) => updateEditor({ tag: event.target.value })}
              className="h-10 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-2.5 text-xs outline-none transition-[border-color,box-shadow] duration-150 focus:border-[var(--color-accent)]/40 focus:ring-2 focus:ring-[var(--color-accent)]/10"
            >
              {TAGS.map((tag) => (
                <option key={tag}>{tag}</option>
              ))}
            </select>
          </div>
          <div>
            <ControlLabel htmlFor="studio-text">Content</ControlLabel>
            <input
              id="studio-text"
              aria-label="Content"
              value={editor.text}
              onChange={(event) => updateEditor({ text: event.target.value })}
              className="h-10 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-2.5 text-xs outline-none transition-[border-color,box-shadow] duration-150 focus:border-[var(--color-accent)]/40 focus:ring-2 focus:ring-[var(--color-accent)]/10"
            />
          </div>
        </div>
        <div className="col-span-2 flex flex-wrap gap-1.5 pt-3">
          {parsed.diagnostics.map((diagnostic) => (
            <span
              key={`${diagnostic.code}-${diagnostic.token}`}
              className="inline-flex items-center gap-1.5 rounded-md border border-amber-500/20 bg-amber-500/5 px-2 py-1 font-[family-name:var(--font-mono)] text-[9px] text-amber-600 dark:text-amber-300"
            >
              <WarningCircleIcon size={11} weight="fill" />
              {diagnostic.message}
            </span>
          ))}
          {!recipeSupportsTarget ? (
            <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-500/20 bg-amber-500/5 px-2 py-1 font-[family-name:var(--font-mono)] text-[9px] text-amber-600 dark:text-amber-300">
              <WarningCircleIcon size={11} weight="fill" />
              {activeRecipe!.name} is not reviewed for {editor.target}.
            </span>
          ) : null}
          {parsed.diagnostics.length === 0 && recipeSupportsTarget ? (
            <span className="inline-flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.08em] text-[var(--color-accent)]">
              <CheckCircleIcon size={12} weight="fill" />
              Syntax valid
            </span>
          ) : null}
        </div>
      </div>

      <div className="p-4">
        <div className="mb-3 flex items-center justify-between font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">
          <span>Production output</span>
          <span className="text-[var(--color-accent)]">{editor.target}</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5 mb-3">
          {TARGETS.map((target) => (
            <button
              key={target.id}
              type="button"
              aria-pressed={editor.target === target.id}
              onClick={() => updateEditor({ target: target.id })}
              className="control-press min-h-10 cursor-pointer rounded-md border border-[var(--color-border)] px-2 py-2 text-[10px] text-[var(--color-fg-muted)] transition-[border-color,color,background-color] duration-150 hover:border-[var(--color-accent)]/30 hover:text-[var(--color-fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/45 aria-pressed:border-[var(--color-accent)]/30 aria-pressed:bg-[var(--color-accent)]/[0.08] aria-pressed:text-[var(--color-accent)]"
            >
              {target.label}
            </button>
          ))}
        </div>
        <pre
          className="max-h-[400px] overflow-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-code-bg)] p-3 font-[family-name:var(--font-mono)] text-[10px] leading-relaxed"
          data-testid="generated-code"
        >
          <code>{highlighted}</code>
        </pre>
      </div>
    </div>
  );
}
