"use client";

import type { CSSProperties } from "react";
import { ClockIcon } from "@phosphor-icons/react";
import { useReducedMotion } from "motion/react";

export function Timeline({
  duration,
  delay,
  replayKey,
  reduceMotion,
}: {
  duration: number;
  delay: number;
  replayKey: number;
  reduceMotion: boolean;
}) {
  const total = Math.max(duration + delay, 1);
  const systemReducedMotion = useReducedMotion();
  const shouldReduceMotion = reduceMotion || systemReducedMotion;
  const delayPercent = (delay / total) * 100;

  return (
    <div className="border-t border-dashed border-[var(--color-border)] px-4 py-3.5">
      <div className="mb-2.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[11px] font-medium text-[var(--color-fg)]">
          <ClockIcon size={14} className="text-[var(--color-fg-muted)]" />
          Timeline
        </div>
        <div className="flex items-center gap-3 font-[family-name:var(--font-mono)] text-[9px] tabular-nums text-[var(--color-fg-muted)]">
          {delay > 0 ? <span>Delay {delay}ms</span> : null}
          <span>Duration {duration}ms</span>
          <span className="text-[var(--color-fg)]">Total {total}ms</span>
        </div>
      </div>
      <div
        className="studio-timeline relative h-10 overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)]"
        data-testid="timeline"
        style={{ "--delay-percent": `${delayPercent}%` } as CSSProperties}
      >
        <div className="timeline-ticks absolute inset-0" aria-hidden="true" />
        <span className="absolute left-2 top-1.5 z-10 font-[family-name:var(--font-mono)] text-[8px] tabular-nums text-[var(--color-code-muted)]">
          0ms
        </span>
        <span className="absolute right-2 top-1.5 z-10 font-[family-name:var(--font-mono)] text-[8px] tabular-nums text-[var(--color-code-muted)]">
          {total}ms
        </span>
        <div
          className="absolute inset-y-0 left-0 border-r border-dashed border-[var(--color-border)] bg-[var(--color-surface-elevated)]/50"
          style={{ width: `${delayPercent}%` }}
          data-testid="timeline-delay"
        />
        <div
          key={replayKey}
          className="studio-playhead absolute inset-y-0 z-10 w-px bg-[var(--color-accent)]"
          data-reduced-motion={shouldReduceMotion ? "true" : "false"}
          data-testid="timeline-playhead"
          style={{ animationDuration: `${total}ms` }}
        />
        <div
          className="absolute bottom-2 left-2 h-1 rounded-full bg-[var(--color-accent)]/70"
          style={{
            left: `max(8px, ${delayPercent}%)`,
            right: "8px",
          }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
