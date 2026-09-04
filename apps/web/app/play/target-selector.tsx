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
    <aside className="border-t border-border-subtle bg-surface xl:border-l xl:border-t-0">
      <div className="border-b border-border-subtle p-4">
        <div className="mb-3 font-mono text-[9px] uppercase tracking-[0.2em] text-code-muted">
          Export target
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {TARGETS.map((target) => (
            <button
              key={target.id}
              type="button"
              aria-pressed={editor.target === target.id}
              onClick={() => updateEditor({ target: target.id })}
              className="cursor-pointer rounded-md border border-border-subtle px-2 py-2 text-[10px] text-code-muted transition hover:text-fg hover:border-accent/30 aria-pressed:border-accent/20 aria-pressed:bg-accent/10 aria-pressed:text-accent"
            >
              {target.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        <div className="mb-3 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.2em] text-code-muted">
          <span>Production output</span>
          <span className="text-accent">{editor.target}</span>
        </div>
        <pre className="max-h-[430px] overflow-auto rounded-lg border border-border-subtle bg-code-header p-3 font-mono text-[10px] leading-relaxed">
          <code>{highlighted}</code>
        </pre>
      </div>
    </aside>
  );
}
