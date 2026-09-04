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
      <div className="mb-3 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.18em] text-code-muted">
        <span>Timeline</span>
        <span>{total}ms</span>
      </div>
      <div className="studio-timeline relative h-8 overflow-hidden rounded-md border border-border bg-code-header">
        <div
          className="absolute inset-y-0 border-r border-dashed border-border bg-code-header/60"
          style={{ width: `${(delay / total) * 100}%` }}
        />
        <div
          key={replayKey}
          className="studio-playhead absolute inset-y-0 w-px bg-accent shadow-[0_0_12px_var(--accent-glow)]"
          style={{ animationDuration: `${Math.max(total, 240)}ms` }}
        />
        <div className="absolute inset-x-2 top-1/2 h-px bg-gradient-to-r from-accent/10 via-accent/60 to-accent/10" />
      </div>
    </div>
  );
}
