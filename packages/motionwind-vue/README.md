# motionwind-vue

Write Motion animations as Tailwind-like classes in **Vue 3** — powered by
[Motion for Vue](https://motion.dev/docs/vue).

```bash
npm install motionwind-vue motion-v
```

## Usage

```vue
<script setup>
import { Motionwind } from "motionwind-vue";
</script>

<template>
  <Motionwind as="button" class="animate-hover:scale-110 animate-tap:scale-90 animate-spring">
    Click me
  </Motionwind>
</template>
```

- **`<Motionwind as="…" class="…">`** — parses the class string and renders the matching
  `motion.*` component with mapped props. Non-motion classes pass through as `class`.
- **`mw.div`, `mw.button`, …** — a component proxy for render-function/JSX usage.
- **`useMotionwind(className)`** — composable returning `{ parsed, motionProps, tailwindClasses }`.

Same `animate-*` syntax as the React package (see the [docs](https://motionwind.xyz)).

> Note: scroll-linked classes (`animate-scroll:*`) are not yet mapped in the Vue adapter —
> gestures, transitions, drag, layout, and variants are fully supported.
