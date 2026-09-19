"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { ClockIcon } from "@phosphor-icons/react";
import { useReducedMotion } from "motion/react";

export function Timeline({
  duration,
  delay,
  replayKey,
  reduceMotion,
  playing,
  onPlayingChange,
  onTimeChange,
  onComplete,
}: {
  duration: number;
  delay: number;
  replayKey: number;
  reduceMotion: boolean;
  playing: boolean;
  onPlayingChange: (playing: boolean) => void;
  onTimeChange: (time: number) => void;
  onComplete: () => void;
}) {
  const total = Math.max(duration + delay, 1);
  const systemReducedMotion = useReducedMotion();
  const shouldReduceMotion = reduceMotion || systemReducedMotion;
  const delayPercent = (delay / total) * 100;
  const [elapsed, setElapsed] = useState(0);
  const elapsedRef = useRef(0);
  const frameRef = useRef<number | null>(null);

  const updateElapsed = useCallback(
    (nextElapsed: number) => {
      const next = Math.min(Math.max(nextElapsed, 0), total);
      elapsedRef.current = next;
      setElapsed(next);
    },
    [total],
  );

  useEffect(() => {
    updateElapsed(shouldReduceMotion ? total : 0);
    onTimeChange(shouldReduceMotion ? total : 0);
    onPlayingChange(!shouldReduceMotion);
  }, [
    onPlayingChange,
    onTimeChange,
    replayKey,
    shouldReduceMotion,
    total,
    updateElapsed,
  ]);

  useEffect(() => {
    if (shouldReduceMotion) return;

    if (!playing) {
      onTimeChange(elapsedRef.current);
      return;
    }

    const startedAt = performance.now() - elapsedRef.current;
    const tick = (now: number) => {
      const next = Math.min(now - startedAt, total);
      updateElapsed(next);
      if (next >= total) {
        onTimeChange(total);
        onComplete();
        return;
      }
      frameRef.current = window.requestAnimationFrame(tick);
    };

    frameRef.current = window.requestAnimationFrame(tick);
    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, [
    onComplete,
    onTimeChange,
    playing,
    shouldReduceMotion,
    total,
    updateElapsed,
  ]);

  const progress = elapsed / total;
  const elapsedLabel = `${Math.round(elapsed)}ms`;

  function seek(nextElapsed: number) {
    updateElapsed(nextElapsed);
    onTimeChange(nextElapsed);
    onPlayingChange(false);
    if (nextElapsed >= total) onComplete();
  }

  return (
    <div className="border-t border-[var(--color-border-subtle)] px-4 py-4 sm:px-5">
      <div className="mb-2.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[11px] font-medium text-[var(--color-fg)]">
          <ClockIcon size={14} className="text-[var(--color-fg-muted)]" />
          Timeline
        </div>
        <div className="flex items-center gap-3 font-[family-name:var(--font-mono)] text-[9px] tabular-nums text-[var(--color-fg-muted)]">
          {delay > 0 ? <span>Delay {delay}ms</span> : null}
          <span className="hidden sm:inline">Duration {duration}ms</span>
          <span className="text-[var(--color-fg)]">
            {elapsedLabel} / {total}ms
          </span>
        </div>
      </div>
      <div
        className="studio-timeline group relative h-12 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]"
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
          className="studio-playhead absolute inset-y-0 left-0 z-10 w-px bg-[var(--color-accent)] shadow-[0_0_12px_var(--acid-glow)]"
          data-reduced-motion={shouldReduceMotion ? "true" : "false"}
          data-testid="timeline-playhead"
          style={{
            transform: `translateX(calc((100cqw - 16px) * ${progress}))`,
          }}
        />
        <div
          className="absolute bottom-2 left-2 right-2 h-1 origin-left rounded-full bg-[var(--color-accent)]/80"
          style={{
            transform: `scaleX(${progress})`,
          }}
          aria-hidden="true"
        />
        <input
          className="absolute inset-0 z-20 h-full w-full cursor-ew-resize opacity-0"
          type="range"
          min={0}
          max={total}
          step={1}
          value={Math.round(elapsed)}
          aria-label="Timeline scrubber"
          aria-valuetext={elapsedLabel}
          onChange={(event) => seek(Number(event.target.value))}
        />
      </div>
    </div>
  );
}
