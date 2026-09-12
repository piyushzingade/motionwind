"use client";

import { type ComponentType, type ReactNode } from "react";
import { CheckerboardIcon } from "@phosphor-icons/react";
import { MotionConfig, useReducedMotion } from "motion/react";
import { mw } from "motionwind-react";
import { STAGES } from "@/lib/types";
import type { StageSize } from "@/lib/types";

const MwComponent = mw as unknown as Record<
  string,
  ComponentType<{ className?: string; children?: ReactNode }>
>;

const DEFAULT_TAG = "div";

export function PreviewStage({
  tag,
  classes,
  text,
  stage,
  reduceMotion,
  replayKey,
}: {
  tag: string;
  classes: string;
  text: string;
  stage: StageSize;
  reduceMotion: boolean;
  replayKey: number;
}) {
  const Preview = (MwComponent[tag] ?? MwComponent[DEFAULT_TAG]) as ComponentType<{ className?: string; children?: ReactNode }>;
  const stageWidth = STAGES.find(({ id }) => id === stage)?.width ?? 400;
  const systemReducedMotion = useReducedMotion();
  const shouldReduceMotion = reduceMotion || systemReducedMotion;

  return (
    <div className="studio-checker flex min-h-[360px] items-center justify-center overflow-auto p-3 sm:p-5">
      <div
        className={`relative flex min-h-[300px] max-w-full items-center justify-center overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] shadow-[0_18px_55px_var(--color-shadow)] ${shouldReduceMotion ? "" : "transition-[width] duration-200 ease-[cubic-bezier(0.645,0.045,0.355,1)]"}`}
        style={{ width: stageWidth }}
        data-testid="preview-viewport"
      >
        <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-md border border-[var(--color-border)] bg-[var(--color-bg)]/80 px-2 py-1 font-[family-name:var(--font-mono)] text-[8px] uppercase tracking-[0.1em] text-[var(--color-code-muted)] backdrop-blur-sm">
          <CheckerboardIcon size={11} />
          Live viewport {stageWidth}px
        </div>
        <MotionConfig reducedMotion={shouldReduceMotion ? "always" : "user"}>
          <Preview key={replayKey} className={classes}>
            {text}
          </Preview>
        </MotionConfig>
      </div>
    </div>
  );
}
