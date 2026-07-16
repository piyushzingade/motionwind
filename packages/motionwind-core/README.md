# motionwind-core v2

The framework-independent parser, public types, syntax registry, configuration,
presets, plugin API, and adapter contract for Motionwind.

```bash
npm install motionwind-core@2
```

```ts
import {
  defineConfig,
  parseMotionClasses,
  MOTIONWIND_SYNTAX_REGISTRY,
} from "motionwind-core";

const config = defineConfig({
  adapter: "react",
  strict: true,
  reducedMotion: "user",
  tokens: { durations: { fast: 160 } },
});

const result = parseMotionClasses(
  "p-4 animate-hover:scale-105 animate-duration-fast",
  config,
);
```

`ParsedResult` is the stable Motion-first v2 intermediate representation. It
contains passthrough classes, gestures, transition, viewport, drag, layout,
scroll, variants, diagnostics, and `hasMotion`.

Extension entry points:

- `defineMotionwindPlugin()` adds presets, definitions, token transforms, and
  diagnostics.
- `defineMotionwindAdapter()` maps `ParsedResult` to a runtime.
- `AdapterCapabilities` declares gestures, scroll, layout, drag, variants, SVG,
  and reduced-motion support.
- `getSyntaxDefinitions()` and `MOTIONWIND_SYNTAX_REGISTRY` provide tooling data.
- `analyzeClassName()` and `sortMotionClasses()` power diagnostics and formatting.

MIT

