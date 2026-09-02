"use client";

import { PlaygroundHeader } from "./playground-header";

export function PlaygroundLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[var(--color-bg)]">
      <div className="relative flex flex-1 flex-col min-h-0 min-w-0">
        <PlaygroundHeader />
        <main className="flex-1 overflow-y-auto min-h-0">
          <div className="p-5 sm:p-8 max-w-5xl mx-auto w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
