"use client";

import { type ComponentType, type ReactNode } from "react";
import { MotionConfig } from "motion/react";
import { mw } from "motionwind-react";
import { STAGES } from "./types";
import type { StageSize } from "./types";

const MwComponent = mw as unknown as Record<
  string,
  ComponentType<{ className?: string; children?: ReactNode }>
>;

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
  const Preview = MwComponent[tag]!;
  const stageWidth = STAGES.find(({ id }) => id === stage)!.width;

  return (
    <div className="studio-checker flex min-h-[430px] items-center justify-center overflow-auto p-5 md:p-10">
      <div
        className="relative flex min-h-[320px] max-w-full items-center justify-center overflow-hidden rounded-2xl border border-white/[0.06] bg-surface-raised/90 shadow-[0_30px_90px_#0008] transition-[width] duration-300"
        style={{ width: stageWidth }}
      >
        <div className="absolute left-4 top-4 flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.18em] code-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-acid/70" />
          live viewport · {stageWidth}px
        </div>
        <MotionConfig reducedMotion={reduceMotion ? "always" : "never"}>
          <Preview key={replayKey} className={classes}>
            {text}
          </Preview>
        </MotionConfig>
      </div>
    </div>
  );
}