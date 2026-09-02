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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "b") {
        e.preventDefault();
        if (window.matchMedia("(min-width: 768px)").matches) {
          setSidebarCollapsed((prev) => !prev);
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
      setSidebarCollapsed((prev) => !prev);
    } else {
      setMobileOpen((prev) => !prev);
    }
  }, []);

  const handleCloseMobile = useCallback(() => {
    setMobileOpen(false);
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[var(--color-bg)]">
      <PlaygroundSidebar
        mobileOpen={mobileOpen}
        collapsed={sidebarCollapsed}
        onCloseMobile={handleCloseMobile}
      />
      <div className="relative flex flex-1 flex-col min-h-0 min-w-0">
        <PlaygroundHeader onToggleSidebar={handleToggleSidebar} />
        <main className="flex-1 overflow-y-auto min-h-0">
          <div className="p-5 sm:p-8 max-w-5xl mx-auto w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
