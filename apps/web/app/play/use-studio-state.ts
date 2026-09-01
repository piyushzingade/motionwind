"use client";

import { useCallback, useEffect, useState } from "react";
import type { StudioState } from "./types";
import { getInitial } from "./types";
import { encodeState, decodeState } from "./utils";

export function useStudioState() {
  const [editor, setEditor] = useState<StudioState>(getInitial);
  const [stage, setStage] = useState<"phone" | "tablet" | "desktop">("desktop");
  const [reduceMotion, setReduceMotion] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const [copied, setCopied] = useState<"link" | "code" | null>(null);

  const writeHash = useCallback((state: StudioState) => {
    window.history.replaceState(null, "", `#${encodeState(state)}`);
  }, []);

  const updateEditor = useCallback((patch: Partial<StudioState>) => {
    setEditor((current) => ({ ...current, ...patch }));
  }, []);

  useEffect(() => {
    const decoded = decodeState(window.location.hash);
    if (decoded) setEditor(decoded);
    else writeHash(getInitial());
  }, [writeHash]);

  useEffect(() => {
    writeHash(editor);
  }, [editor, writeHash]);

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
