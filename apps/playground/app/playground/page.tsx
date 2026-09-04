"use client";

import { useState, useCallback, useEffect } from "react";
import type { MotionwindRecipe } from "motionwind-react";
import { PREVIEW_SKIN } from "@/lib/types";
import { useStudioState } from "@/lib/use-studio-state";
import { PlaygroundSidebar } from "@/components/playground-sidebar";
import { PlaygroundHeader } from "@/components/playground-header";
import { PlaygroundStudio } from "@/components/playground/studio";

export default function PlaygroundPage() {
  const { editor, updateEditor, replay } = useStudioState();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);

  // Cmd+B / Ctrl+B to toggle sidebar
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "b") {
        e.preventDefault();
        if (window.matchMedia("(min-width: 768px)").matches) {
          setDesktopCollapsed((prev) => !prev);
        } else {
          setMobileOpen((prev) => !prev);
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleToggleSidebar = useCallback(() => {
    if (window.matchMedia("(min-width: 768px)").matches) {
      setDesktopCollapsed((prev) => !prev);
    } else {
      setMobileOpen((prev) => !prev);
    }
  }, []);

  const handleCloseMobile = useCallback(() => {
    setMobileOpen(false);
  }, []);

  const applyRecipe = useCallback(
    (recipe: MotionwindRecipe) => {
      updateEditor({
        classes: `${recipe.classes} ${PREVIEW_SKIN}`,
        text: recipe.name,
      });
      replay();
      handleCloseMobile();
    },
    [updateEditor, replay, handleCloseMobile],
  );

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[var(--color-bg)]">
      <PlaygroundSidebar
        mobileOpen={mobileOpen}
        desktopCollapsed={desktopCollapsed}
        onCloseMobile={handleCloseMobile}
        editor={editor}
        onApply={applyRecipe}
      />
      <div className="relative flex flex-1 flex-col min-h-0 min-w-0">
        <PlaygroundHeader onToggleSidebar={handleToggleSidebar} />
        <main className="flex-1 overflow-y-auto min-h-0">
          <div className="p-5 sm:p-8 max-w-5xl mx-auto w-full">
            <PlaygroundStudio />
          </div>
        </main>
      </div>
    </div>
  );
}
