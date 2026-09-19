"use client";

import { useCallback, useEffect, useState } from "react";
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
  PauseIcon,
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

export function PlaygroundStudio({ studio }: { studio: StudioController }) {
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

  const total = Math.max(duration + delay, 1);
  const [playing, setPlaying] = useState(!reduceMotion);
  const [playbackComplete, setPlaybackComplete] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);

  const restart = useCallback(() => {
    setPlaybackTime(0);
    setPlaybackComplete(false);
    setPlaying(!reduceMotion);
    replay();
  }, [reduceMotion, replay]);

  const completePlayback = useCallback(() => {
    setPlaybackTime(total);
    setPlaybackComplete(true);
    setPlaying(false);
  }, [total]);

  useEffect(() => {
    setPlaybackTime(0);
    setPlaybackComplete(false);
    setPlaying(!reduceMotion);
  }, [replayKey, reduceMotion]);

  function togglePlayback() {
    if (playbackComplete || playbackTime >= total) {
      restart();
      return;
    }
    setPlaying((current) => !current);
  }

  return (
    <div className="mx-auto w-full max-w-[1540px] p-3 sm:p-5 lg:p-6">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/90 px-3 py-2.5 shadow-[0_12px_35px_var(--color-shadow)] sm:px-4">
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
            onClick={togglePlayback}
            aria-label={
              playing
                ? "Pause preview"
                : playbackComplete
                  ? "Replay preview"
                  : "Play preview"
            }
            className="control-press inline-flex h-8 min-w-[78px] cursor-pointer items-center justify-center gap-1.5 rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-2.5 font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.08em] text-[var(--color-fg-muted)] transition-[border-color,color,background-color] duration-150 ease-out hover:border-[var(--color-accent)]/30 hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/45"
          >
            {playing ? (
              <PauseIcon size={13} weight="fill" />
            ) : (
              <PlayIcon size={13} weight="fill" />
            )}
            {playing ? "Pause" : playbackComplete ? "Replay" : "Play"}
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

      <div className="grid min-w-0 gap-3">
        <section className="min-w-0 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_18px_60px_var(--color-shadow)]">
          <div className="flex h-12 items-center justify-between border-b border-[var(--color-border-subtle)] px-4 sm:px-5">
            <div className="flex items-center gap-2 text-xs font-medium">
              <PlayIcon
                size={14}
                weight="fill"
                className="text-[var(--color-accent)]"
              />
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
            playing={playing}
            playbackTime={playbackTime}
            recipe={activeRecipe}
          />
          <Timeline
            duration={duration}
            delay={delay}
            replayKey={replayKey}
            reduceMotion={reduceMotion}
            playing={playing}
            onPlayingChange={setPlaying}
            onTimeChange={setPlaybackTime}
            onComplete={completePlayback}
          />
        </section>

        <section className="min-w-0 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="flex h-11 items-center gap-2 border-b border-[var(--color-border-subtle)] px-4 text-xs font-medium">
            <SlidersHorizontalIcon
              size={14}
              className="text-[var(--color-accent)]"
            />
            Properties
          </div>
          <div className="grid gap-5 p-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-7 xl:px-5 xl:py-4">
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
                restart();
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
                restart();
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
                restart();
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
                restart();
              }}
            />
          </div>
        </section>
      </div>

      <div className="mt-3 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="flex h-11 items-center gap-2 border-b border-[var(--color-border-subtle)] px-4 text-xs font-medium">
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
