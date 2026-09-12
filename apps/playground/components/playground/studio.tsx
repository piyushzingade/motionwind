"use client";

import { STAGES } from "@/lib/types";
import type { StudioController } from "@/lib/use-studio-state";
import { useGeneratedCode } from "@/lib/use-generated-code";
import { replaceClass } from "@/lib/utils";
import {
  CheckIcon,
  CodeIcon,
  CopyIcon,
  DesktopIcon,
  DeviceMobileIcon,
  DeviceTabletIcon,
  LinkIcon,
  PlayIcon,
  PulseIcon,
  SlidersHorizontalIcon,
} from "@phosphor-icons/react";
import { PreviewStage } from "./preview-stage";
import { ControlsPanel } from "./controls-panel";
import { Timeline } from "./timeline";
import { RangeControl } from "./range-control";

const stageIcons = {
  phone: DeviceMobileIcon,
  tablet: DeviceTabletIcon,
  desktop: DesktopIcon,
};

export function PlaygroundStudio({
  studio,
}: {
  studio: StudioController;
}) {
  const {
    editor,
    stage,
    setStage,
    reduceMotion,
    setReduceMotion,
    replayKey,
    replay,
    copyStatus,
    copy,
    updateEditor,
  } = studio;

  const {
    parsed,
    generated,
    highlighted,
    duration,
    delay,
    stiffness,
    damping,
    activeRecipe,
    recipeSupportsTarget,
  } = useGeneratedCode(editor);

  return (
    <div className="mx-auto w-full max-w-[1480px] p-3 sm:p-5 lg:p-6">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 sm:px-4">
        <div
          className="flex rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] p-0.5"
          aria-label="Preview size"
        >
          {STAGES.map((size) => {
            const StageIcon = stageIcons[size.id];
            return (
              <button
                key={size.id}
                type="button"
                aria-label={`${size.id} preview, ${size.width} pixels`}
                aria-pressed={stage === size.id}
                onClick={() => setStage(size.id)}
                className="control-press inline-flex h-8 min-w-9 cursor-pointer items-center justify-center gap-1.5 rounded px-2 text-[var(--color-fg-muted)] transition-[background-color,color] duration-150 hover:text-[var(--color-fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/45 aria-pressed:bg-[var(--color-surface-elevated)] aria-pressed:text-[var(--color-accent)]"
              >
                <StageIcon size={15} weight="regular" />
                <span className="font-[family-name:var(--font-mono)] text-[9px]">
                  {size.label}
                </span>
              </button>
            );
          })}
        </div>
        <div className="flex flex-wrap items-center justify-end gap-1.5 sm:gap-2">
          <button
            type="button"
            aria-pressed={reduceMotion}
            onClick={() => setReduceMotion((v) => !v)}
            className="control-press inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md px-2 font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.08em] text-[var(--color-fg-muted)] transition-colors duration-150 hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/45"
          >
            <PulseIcon size={14} weight={reduceMotion ? "regular" : "fill"} />
            {reduceMotion ? "Reduced" : "Full motion"}
          </button>
          <button
            type="button"
            onClick={replay}
            className="control-press inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-2.5 font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.08em] text-[var(--color-fg-muted)] transition-[border-color,color,background-color] duration-150 hover:border-[var(--color-accent)]/30 hover:text-[var(--color-fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/45"
          >
            <PlayIcon size={13} weight="fill" />
            Replay
          </button>
          <button
            type="button"
            onClick={() => copy("link", generated)}
            className="control-press inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-2.5 text-[11px] text-[var(--color-fg-muted)] transition-[border-color,color] duration-150 hover:border-[var(--color-accent)]/30 hover:text-[var(--color-fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/45"
          >
            {copyStatus === "link" ? (
              <CheckIcon size={13} weight="bold" />
            ) : (
              <LinkIcon size={13} />
            )}
            {copyStatus === "link" ? "Link copied" : "Share"}
          </button>
          <button
            type="button"
            onClick={() => copy("code", generated)}
            className="control-press inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md bg-[var(--color-accent)] px-3 text-[11px] font-semibold text-[var(--color-accent-fg)] transition-colors duration-150 hover:bg-[var(--color-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
          >
            {copyStatus === "code" ? (
              <CheckIcon size={13} weight="bold" />
            ) : (
              <CopyIcon size={13} />
            )}
            {copyStatus === "code" ? "Copied" : "Copy code"}
          </button>
        </div>
      </div>

      <div className="grid min-w-0 gap-3 xl:grid-cols-[minmax(0,1fr)_340px]">
        <section className="min-w-0 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="flex h-11 items-center justify-between border-b border-dashed border-[var(--color-border)] px-4">
            <div className="flex items-center gap-2 text-xs font-medium">
              <PlayIcon size={14} weight="fill" className="text-[var(--color-accent)]" />
              Preview
            </div>
            <span className="font-[family-name:var(--font-mono)] text-[9px] text-[var(--color-fg-muted)]">
              {STAGES.find((item) => item.id === stage)?.width}px
            </span>
          </div>
          <PreviewStage
            tag={editor.tag}
            classes={editor.classes}
            text={editor.text}
            stage={stage}
            reduceMotion={reduceMotion}
            replayKey={replayKey}
          />
          <Timeline
            duration={duration}
            delay={delay}
            replayKey={replayKey}
            reduceMotion={reduceMotion}
          />
        </section>

        <aside className="min-w-0 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="flex h-11 items-center gap-2 border-b border-dashed border-[var(--color-border)] px-4 text-xs font-medium">
            <SlidersHorizontalIcon
              size={14}
              className="text-[var(--color-accent)]"
            />
            Properties
          </div>
          <div className="grid gap-5 p-4">
            <RangeControl
              id="duration"
              label="Duration"
              value={duration}
              min={80}
              max={1600}
              step={20}
              unit="ms"
              onChange={(value) => {
                updateEditor({
                  classes: replaceClass(
                    editor.classes,
                    /^animate-duration-/,
                    `animate-duration-${value}`,
                  ),
                });
                replay();
              }}
            />
            <RangeControl
              id="delay"
              label="Delay"
              value={delay}
              min={0}
              max={1000}
              step={20}
              unit="ms"
              onChange={(value) => {
                updateEditor({
                  classes: replaceClass(
                    editor.classes,
                    /^animate-delay-/,
                    `animate-delay-${value}`,
                  ),
                });
                replay();
              }}
            />
            <RangeControl
              id="stiffness"
              label="Stiffness"
              value={stiffness}
              min={40}
              max={700}
              step={10}
              onChange={(value) => {
                updateEditor({
                  classes: replaceClass(
                    editor.classes,
                    /^animate-stiffness-/,
                    `animate-stiffness-${value}`,
                  ),
                });
                replay();
              }}
            />
            <RangeControl
              id="damping"
              label="Damping"
              value={damping}
              min={4}
              max={60}
              onChange={(value) => {
                updateEditor({
                  classes: replaceClass(
                    editor.classes,
                    /^animate-damping-/,
                    `animate-damping-${value}`,
                  ),
                });
                replay();
              }}
            />
          </div>
        </aside>
      </div>

      <div className="mt-3 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="flex h-11 items-center gap-2 border-b border-dashed border-[var(--color-border)] px-4 text-xs font-medium">
          <CodeIcon size={14} className="text-[var(--color-accent)]" />
          Editor and output
        </div>
        <ControlsPanel
          editor={editor}
          updateEditor={updateEditor}
          parsed={parsed}
          highlighted={highlighted}
          activeRecipe={activeRecipe}
          recipeSupportsTarget={recipeSupportsTarget}
        />
      </div>

      <span className="sr-only" aria-live="polite">
        {copyStatus === "error"
          ? "Copy failed"
          : copyStatus === "idle"
            ? ""
            : `${copyStatus} copied`}
      </span>
    </div>
  );
}
