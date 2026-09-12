"use client";

import { useCallback, useEffect, useState } from "react";
import type { MotionwindRecipe } from "motionwind-react";
import { PREVIEW_SKIN } from "@/lib/types";
import { useStudioState } from "@/lib/use-studio-state";
import { PlaygroundSidebar } from "@/components/playground-sidebar";
import { PlaygroundHeader } from "@/components/playground-header";
import { PlaygroundStudio } from "@/components/playground/studio";

export function PlaygroundPage({ starCount }: { starCount: number | null }) {
  const studio = useStudioState();
  const { editor, updateEditor, replay } = studio;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "b") {
        event.preventDefault();
        if (window.matchMedia("(min-width: 768px)").matches) {
          setDesktopCollapsed((current) => !current);
        } else {
          setMobileOpen((current) => !current);
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleToggleSidebar = useCallback(() => {
    if (window.matchMedia("(min-width: 768px)").matches) {
      setDesktopCollapsed((current) => !current);
    } else {
      setMobileOpen((current) => !current);
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
    <div className="flex h-[100dvh] w-full overflow-hidden bg-[var(--color-bg)] text-[var(--color-fg)]">
      <PlaygroundSidebar
        mobileOpen={mobileOpen}
        desktopCollapsed={desktopCollapsed}
        onCloseMobile={handleCloseMobile}
        editor={editor}
        onApply={applyRecipe}
      />
      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col">
        <PlaygroundHeader
          sidebarCollapsed={desktopCollapsed}
          onToggleSidebar={handleToggleSidebar}
          starCount={starCount}
          editor={editor}
          onApply={applyRecipe}
        />
        <main className="min-h-0 flex-1 overflow-y-auto">
          <PlaygroundStudio studio={studio} />
        </main>
      </div>
    </div>
  );
}
