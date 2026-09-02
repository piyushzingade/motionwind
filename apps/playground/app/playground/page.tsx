"use client";

import { PlaygroundStudio } from "@/components/playground/studio";

export default function PlaygroundPage() {
  return (
    <div>
      <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-[var(--color-fg)] mb-1">
        Motion Studio
      </h2>
      <p className="text-sm text-[var(--color-fg-muted)] mb-6">
        Pick a recipe, tweak the parameters, and see the compiled output for
        your target framework. The code panel updates live as you adjust.
      </p>
      <PlaygroundStudio />
    </div>
  );
}
