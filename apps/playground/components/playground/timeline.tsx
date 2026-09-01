export function Timeline({
  duration,
  delay,
  replayKey,
}: {
  duration: number;
  delay: number;
  replayKey: number;
}) {
  const total = Math.max(duration + delay, 1);
  return (
    <div className="border-t border-[var(--color-border)] px-5 py-4">
      <div className="mb-3 flex items-center justify-between font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.18em] text-[var(--color-fg-muted)]">
        <span>Timeline</span>
        <span>{total}ms</span>
      </div>
      <div className="studio-timeline relative h-8 overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-surface)]">
        <div
          className="absolute inset-y-0 border-r border-dashed border-[var(--color-border)] bg-[var(--color-surface)]/60"
          style={{ width: `${(delay / total) * 100}%` }}
        />
        <div
          key={replayKey}
          className="studio-playhead absolute inset-y-0 w-px bg-[var(--color-accent)] shadow-[0_0_12px_var(--acid-glow)]"
          style={{ animationDuration: `${Math.max(total, 240)}ms` }}
        />
        <div className="absolute inset-x-2 top-1/2 h-px bg-gradient-to-r from-[var(--color-accent)]/10 via-[var(--color-accent)]/60 to-[var(--color-accent)]/10" />
      </div>
    </div>
  );
}
