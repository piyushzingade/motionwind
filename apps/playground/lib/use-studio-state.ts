"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { StudioState } from "./types";
import { INITIAL_SHARED } from "./types";
import { encodeState, decodeState } from "./utils";

export function useStudioState() {
  const [sharedState, setSharedState] = useState(INITIAL_SHARED);
  const [hydrated, setHydrated] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const [copyStatus, setCopyStatus] = useState<
    "idle" | "link" | "code" | "error"
  >("idle");
  const copyTimer = useRef<number | null>(null);

  const writeHash = useCallback((state: typeof INITIAL_SHARED) => {
    window.history.replaceState(null, "", `#${encodeState(state)}`);
  }, []);

  const updateEditor = useCallback((patch: Partial<StudioState>) => {
    setSharedState((current) => ({ ...current, ...patch }));
  }, []);

  useEffect(() => {
    const decoded = decodeState(window.location.hash);
    setSharedState(decoded ?? INITIAL_SHARED);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeHash(sharedState);
  }, [hydrated, sharedState, writeHash]);

  useEffect(
    () => () => {
      if (copyTimer.current) window.clearTimeout(copyTimer.current);
    },
    [],
  );

  const replay = useCallback(() => setReplayKey((k) => k + 1), []);

  const copy = useCallback(
    async (kind: "link" | "code", generated: string) => {
      try {
        const value =
          kind === "link"
            ? `${window.location.origin}${window.location.pathname}#${encodeState(sharedState)}`
            : generated;
        await navigator.clipboard.writeText(value);
        setCopyStatus(kind);
      } catch {
        setCopyStatus("error");
      }

      if (copyTimer.current) window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setCopyStatus("idle"), 1600);
    },
    [sharedState],
  );

  return {
    editor: sharedState,
    stage: sharedState.stage,
    setStage: (stage: typeof sharedState.stage) =>
      setSharedState((current) => ({ ...current, stage })),
    reduceMotion: sharedState.reduceMotion,
    setReduceMotion: (value: boolean | ((current: boolean) => boolean)) =>
      setSharedState((current) => ({
        ...current,
        reduceMotion:
          typeof value === "function" ? value(current.reduceMotion) : value,
      })),
    replayKey,
    replay,
    copyStatus,
    copy,
    updateEditor,
  };
}

export type StudioController = ReturnType<typeof useStudioState>;
