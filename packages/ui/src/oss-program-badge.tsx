import type { ReactNode } from "react";

export function OssProgramBadge({ brand }: { brand: ReactNode }) {
  return (
    <span className="oss-badge group relative inline-flex items-center gap-2 rounded-full bg-[var(--color-surface)] px-3 py-1.5">
      <span className="oss-badge-glow" aria-hidden="true" />
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
