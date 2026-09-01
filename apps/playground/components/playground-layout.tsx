"use client";

import { useState, useCallback, useEffect } from "react";
import { PlaygroundSidebar } from "./playground-sidebar";
import { PlaygroundHeader } from "./playground-header";

export function PlaygroundLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);

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

  return (
    <div className="flex h-screen w-full bg-[var(--color-bg)]">
      <PlaygroundSidebar
        mobileOpen={mobileOpen}
        desktopCollapsed={desktopCollapsed}
        onCloseMobile={handleCloseMobile}
      />
      <div className="relative flex flex-1 flex-col min-h-0 min-w-0">
        <PlaygroundHeader onToggleSidebar={handleToggleSidebar} />
        <div className="docs-content-wrapper flex-1 overflow-y-auto min-h-0">
          {children}
        </div>
        <div className="progressive-blur" aria-hidden="true">
          <div className="blur-layer blur-1" />
          <div className="blur-layer blur-2" />
          <div className="blur-layer blur-3" />
          <div className="blur-layer blur-4" />
          <div className="blur-layer blur-5" />
          <div className="blur-layer blur-6" />
        </div>
      </div>
    </div>
  );
}
