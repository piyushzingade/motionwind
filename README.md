# motionwind

**Motion animations as Tailwind classes.** A Babel plugin that transforms `animate-hover:scale-110` into `whileHover={{ scale: 1.1 }}` at build time. Zero imports, zero boilerplate.

## Before & After

**Before (verbose):**

```jsx
"use client";
import { motion } from "motion/react";

<motion.button
  className="px-6 py-3 bg-indigo-600 text-white rounded-lg"
  whileHover={{ scale: 1.1 }}
  whileTap={{ scale: 0.9 }}
  transition={{ type: "spring", stiffness: 400 }}
>
  Click Me!
</motion.button>
```

**After (motionwind):**

```jsx
// No imports needed! The Babel plugin handles everything.
<button className="px-6 py-3 bg-indigo-600 text-white rounded-lg animate-hover:scale-110 animate-tap:scale-90 animate-spring animate-stiffness-400">
  Click Me!
</button>
```

## Quick Start

```bash
npx create-motionwind init
```

Or install manually:

```bash
npm install motionwind motion
```

### Next.js

```js
// next.config.js
import withMotionwind from "motionwind/next";
export default withMotionwind({});
```

### Vite

```ts
// vite.config.ts
import { motionwind } from "motionwind/vite";
import react from "@vitejs/plugin-react";
export default defineConfig({ plugins: [motionwind(), react()] });
```

### Babel

```json
{ "plugins": ["motionwind/babel"] }
```

## Syntax

Format: `animate-{gesture}:{property}-{value}`

### Gestures

| Class Prefix | Motion Prop |
|---|---|
| `animate-hover:` | `whileHover` |
| `animate-tap:` | `whileTap` |
| `animate-focus:` | `whileFocus` |
| `animate-inview:` | `whileInView` |
| `animate-drag:` | `whileDrag` |
| `animate-initial:` | `initial` |
| `animate-enter:` | `animate` |
| `animate-exit:` | `exit` |

### Properties

| Class | Motion Value |
|---|---|
| `scale-110` | `scale: 1.1` |
| `rotate-45` | `rotate: 45` |
| `x-20` | `x: 20` |
| `y-100` | `y: 100` |
| `opacity-0` | `opacity: 0` |
| `blur-10` | `filter: "blur(10px)"` |
| `rounded-16` | `borderRadius: 16` |
| `w-200` | `width: 200` |
| `h-100` | `height: 100` |

Negative values: prefix with `-` (e.g., `animate-hover:-x-20`)

Arbitrary values: `animate-hover:[backgroundColor=#4f46e5]`

### Transition Config

| Class | Effect |
|---|---|
| `animate-duration-300` | `duration: 0.3s` |
| `animate-delay-500` | `delay: 0.5s` |
| `animate-ease-in-out` | `ease: "easeInOut"` |
| `animate-spring` | `type: "spring"` |
| `animate-stiffness-400` | `stiffness: 400` |
| `animate-damping-20` | `damping: 20` |
| `animate-repeat-infinite` | `repeat: Infinity` |

### Viewport & Drag

| Class | Effect |
|---|---|
| `animate-once` | `viewport.once: true` |
| `animate-drag-both` | `drag: true` |
| `animate-drag-x` | `drag: "x"` |
| `animate-drag-elastic-50` | `dragElastic: 0.5` |

## Dynamic ClassNames

For dynamic classNames that Babel can't statically analyze, use the runtime fallback:

```tsx
import { mw } from "motionwind";

<mw.button className={`${isActive ? "bg-blue-500" : "bg-gray-500"} animate-hover:scale-110`}>
  Dynamic
</mw.button>
```

## Packages

| Package | Description |
|---|---|
| `motionwind` | Core library — parser, Babel plugin, runtime component, framework integrations |
| `create-motionwind` | CLI to scaffold motionwind in your project |

## Development

```bash
# Install deps
bun install

# Dev mode
bun run dev

# Build
bun run build

# Test
bun run test

# Lint
bun run lint

# Type check
bun run check-types
```

## How It Works

1. **Parser** (`motionwind/parser`) — Framework-agnostic class parser. Zero dependencies.
2. **Babel Plugin** (`motionwind/babel`) — Build-time JSX transform. Converts `<button className="animate-...">` into `<motion.button whileHover={...}>`. Auto-injects imports and `"use client"`.
3. **Runtime Fallback** (`motionwind`) — `mw.*` Proxy for dynamic classNames.

All Tailwind classes pass through untouched. Only `animate-{gesture}:` and `animate-{config}` tokens are intercepted.

## License

MIT
