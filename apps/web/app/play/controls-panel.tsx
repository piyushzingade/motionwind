"use client";

import { TAGS } from "./types";
import type { StudioState } from "./types";
import { ControlLabel } from "./control-label";

export function ControlsPanel({
  editor,
  updateEditor,
  parsed,
  activeRecipe,
  recipeSupportsTarget,
}: {
  editor: StudioState;
  updateEditor: (patch: Partial<StudioState>) => void;
  parsed: ReturnType<
    typeof import("./use-generated-code").useGeneratedCode
  >["parsed"];
  activeRecipe: ReturnType<
    typeof import("./use-generated-code").useGeneratedCode
  >["activeRecipe"];
  recipeSupportsTarget: boolean;
}) {
  return (
    <div className="grid border-t border-border-subtle lg:grid-cols-2">
      <div className="border-b border-border-subtle p-4 lg:border-b-0 lg:border-r">
        <ControlLabel htmlFor="studio-classes">Motionwind classes</ControlLabel>
        <textarea
          id="studio-classes"
          aria-label="Motionwind classes"
          value={editor.classes}
          onChange={(event) => updateEditor({ classes: event.target.value })}
          spellCheck={false}
          rows={6}
          className="w-full resize-y rounded-lg border border-border-subtle bg-surface-inset p-3 font-mono text-[11px] leading-relaxed text-acid outline-none transition focus:border-acid/30"
        />
      </div>
      <div className="grid grid-cols-2 gap-3 p-4">
        <div>
          <label
            htmlFor="studio-element"
            className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-text-muted"
          >
            <span>Element</span>
          </label>
          <select
            id="studio-element"
            value={editor.tag}
            onChange={(event) => updateEditor({ tag: event.target.value })}
            className="w-full rounded-lg border border-border-subtle bg-surface-inset p-2 text-xs outline-none focus:border-acid/30"
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
            className="w-full rounded-lg border border-border-subtle bg-surface-inset p-2 text-xs outline-none focus:border-acid/30"
          />
        </div>
        <div className="col-span-2 flex flex-wrap gap-1.5 pt-1">
          {parsed.diagnostics.map((diagnostic) => (
            <span
              key={`${diagnostic.code}-${diagnostic.token}`}
              className="rounded border border-amber-400/15 bg-amber-400/5 px-2 py-1 font-mono text-[9px] text-amber-300"
            >
              {diagnostic.message}
            </span>
          ))}
          {!recipeSupportsTarget ? (
            <span className="rounded border border-amber-400/15 bg-amber-400/5 px-2 py-1 font-mono text-[9px] text-amber-300">
              {activeRecipe!.name} is not reviewed for {editor.target}.
            </span>
          ) : null}
          {parsed.diagnostics.length === 0 && recipeSupportsTarget ? (
            <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-400">
              ✓ syntax valid
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
