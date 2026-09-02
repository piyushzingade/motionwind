"use client";

import { TARGETS } from "./types";
import type { StudioState } from "./types";

export function TargetSelector({
  editor,
  updateEditor,
  highlighted,
}: {
  editor: StudioState;
  updateEditor: (patch: Partial<StudioState>) => void;
  highlighted: React.ReactNode[];
}) {
  return (
    <aside className="border-t border-border-subtle bg-surface-overlay xl:border-l xl:border-t-0">
      <div className="border-b border-border-subtle p-4">
        <div className="mb-3 font-mono text-[9px] uppercase tracking-[0.2em] text-text-muted">
          Export target
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {TARGETS.map((target) => (
            <button
              key={target.id}
              type="button"
              aria-pressed={editor.target === target.id}
              onClick={() => updateEditor({ target: target.id })}
              className="cursor-pointer rounded-md border border-border-subtle px-2 py-2 text-[10px] text-text-muted transition hover:text-foreground hover:border-acid/30 aria-pressed:border-acid/20 aria-pressed:bg-acid-soft aria-pressed:text-acid"
            >
              {target.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        <div className="mb-3 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.2em] text-text-muted">
          <span>Production output</span>
          <span className="text-acid">{editor.target}</span>
        </div>
        <pre className="max-h-[430px] overflow-auto rounded-lg border border-border-subtle bg-surface-inset p-3 font-mono text-[10px] leading-relaxed">
          <code>{highlighted}</code>
        </pre>
      </div>
    </aside>
  );
}
