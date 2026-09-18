import type { ReactNode } from "react";

export function OssProgramBadge({ brand }: { brand: ReactNode }) {
  return (
    <span className="inline-flex w-fit items-center gap-2.5 rounded-full border border-black/10 bg-[var(--color-surface-elevated)]/70 py-1.5 pl-4 pr-5 font-[family-name:var(--font-sans)] text-base font-normal leading-6 text-[var(--color-fg)] backdrop-blur-sm dark:border-white/[0.08]">
      <span className="text-[15px] text-[var(--color-fg-muted)]">
        Backed by
      </span>
      <span className="shrink-0 text-[var(--color-fg)]">{brand}</span>
    </span>
  );
}
