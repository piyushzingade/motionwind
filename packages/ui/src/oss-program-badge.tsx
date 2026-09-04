import type { ReactNode } from "react";

export function OssProgramBadge({ brand }: { brand: ReactNode }) {
  return (
    <span className="oss-badge relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-[var(--color-surface)] px-3 py-1.5 shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_1px_2px_rgba(0,0,0,0.04)]">
      <span className="oss-badge-beam" aria-hidden="true" />
      <span className="relative font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">
        Backed by
      </span>
      <span className="relative shrink-0 text-[var(--color-fg)]">{brand}</span>
      <span className="relative font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">
        OSS Program
      </span>
    </span>
  );
}
