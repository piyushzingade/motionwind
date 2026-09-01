"use client";

import { useCallback, useEffect, useState } from "react";
import type { StudioState } from "./types";
import { INITIAL } from "./types";
import { encodeState, decodeState } from "./utils";

export function useStudioState() {
  const [editor, setEditor] = useState<StudioState>(INITIAL);
  const [stage, setStage] = useState<"phone" | "tablet" | "desktop">("desktop");
  const [reduceMotion, setReduceMotion] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const [copied, setCopied] = useState<"link" | "code" | null>(null);

  const writeHash = useCallback((state: StudioState) => {
    window.history.replaceState(null, "", `#${encodeState(state)}`);
  }, []);

  const updateEditor = useCallback(
    (patch: Partial<StudioState>) => {
      setEditor((current) => {
        const next = { ...current, ...patch };
        writeHash(next);
        return next;
      });
    },
    [writeHash],
  );

  useEffect(() => {
    const decoded = decodeState(window.location.hash);
    if (decoded) setEditor(decoded);
    else writeHash(INITIAL);
  }, [writeHash]);

  const replay = useCallback(() => setReplayKey((k) => k + 1), []);

  const copy = useCallback(async (kind: "link" | "code", generated: string) => {
    await navigator.clipboard.writeText(
      kind === "link" ? window.location.href : generated,
    );
    setCopied(kind);
    window.setTimeout(() => setCopied(null), 1400);
  }, []);

  return {
    editor,
    stage,
    setStage,
    reduceMotion,
    setReduceMotion,
    replayKey,
    replay,
    copied,
    copy,
    updateEditor,
  };
}
