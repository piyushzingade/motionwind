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
    <div className="border-t border-border-subtle px-5 py-4">
      <div className="mb-3 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.18em] text-text-muted">
        <span>Timeline</span>
        <span>{total}ms</span>
      </div>
      <div className="studio-timeline relative h-8 overflow-hidden rounded-md border border-border-strong bg-surface-inset">
        <div
          className="absolute inset-y-0 border-r border-dashed border-border-strong bg-surface-inset/60"
          style={{ width: `${(delay / total) * 100}%` }}
        />
        <div
          key={replayKey}
          className="studio-playhead absolute inset-y-0 w-px bg-acid shadow-[0_0_12px_var(--acid-glow)]"
          style={{ animationDuration: `${Math.max(total, 240)}ms` }}
        />
        <div className="absolute inset-x-2 top-1/2 h-px bg-gradient-to-r from-acid/10 via-acid/60 to-acid/10" />
      </div>
    </div>
  );
}
