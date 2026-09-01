"use client";

import { PlaygroundStudio } from "@/components/playground/studio";

export default function PlaygroundPage() {
  return (
    <div className="docs-prose">
      <h2>Motion Studio</h2>
      <p>
        Pick a recipe, tweak the parameters, and see the compiled output for
        your target framework. The code panel updates live as you adjust.
      </p>
      <PlaygroundStudio />
    </div>
  );
}
