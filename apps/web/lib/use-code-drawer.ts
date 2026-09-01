"use client";

import { useCallback, useEffect, useState } from "react";
import type { CodeKey } from "./code-examples";

export function useCodeDrawer() {
  const [codeOpen, setCodeOpen] = useState(false);
  const [activeCode, setActiveCode] = useState<CodeKey>("hover");

  const openCode = useCallback((key: CodeKey) => {
    setActiveCode(key);
    setCodeOpen(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCodeOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return { codeOpen, setCodeOpen, activeCode, setActiveCode, openCode };
}
