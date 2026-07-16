# Features & Syntax

Full reference for motionwind's class syntax. For a live editor, see the
[Motionwind Studio](https://web.motionwind.xyz/play).

## Installation

```bash
npx create-motionwind@2 init
```

Or install manually:

```bash
npm install motionwind-react@2 motion motionwind-core@2
# or: yarn add / pnpm add / bun add
```

### Next.js

```js
// next.config.js
import withMotionwind from "motionwind-react/next";
export default withMotionwind({});
```

### Vite

```ts
// vite.config.ts
import { motionwind } from "motionwind-react/vite";
import react from "@vitejs/plugin-react";
export default defineConfig({ plugins: [motionwind(), react()] });
```

### Babel

```json
{ "plugins": ["motionwind-react/babel"] }
```

## Syntax

Format: `animate-{gesture}:{property}-{value}`

### Gestures

| Class Prefix       | Motion Prop   |
| ------------------ | ------------- |
| `animate-hover:`   | `whileHover`  |
| `animate-tap:`     | `whileTap`    |
| `animate-focus:`   | `whileFocus`  |
| `animate-inview:`  | `whileInView` |
| `animate-drag:`    | `whileDrag`   |
| `animate-initial:` | `initial`     |
| `animate-enter:`   | `animate`     |
| `animate-exit:`    | `exit`        |

### Properties

| Class        | Motion Value           |
| ------------ | ---------------------- |
| `scale-110`  | `scale: 1.1`           |
| `rotate-45`  | `rotate: 45`           |
| `x-20`       | `x: 20`                |
| `y-100`      | `y: 100`               |
| `opacity-0`  | `opacity: 0`           |
| `blur-10`    | `filter: "blur(10px)"` |
| `rounded-16` | `borderRadius: 16`     |
| `w-200`      | `width: 200`           |
| `h-100`      | `height: 100`          |

Negative values: prefix with `-` (e.g., `animate-hover:-x-20`)

Arbitrary values: `animate-hover:[backgroundColor=#4f46e5]`

### Transition Config

| Class                     | Effect              |
| ------------------------- | ------------------- |
| `animate-duration-300`    | `duration: 0.3s`    |
| `animate-delay-500`       | `delay: 0.5s`       |
| `animate-ease-in-out`     | `ease: "easeInOut"` |
| `animate-spring`          | `type: "spring"`    |
| `animate-stiffness-400`   | `stiffness: 400`    |
| `animate-damping-20`      | `damping: 20`       |
| `animate-repeat-infinite` | `repeat: Infinity`  |

### Viewport & Drag

| Class                     | Effect                |
| ------------------------- | --------------------- |
| `animate-once`            | `viewport.once: true` |
| `animate-drag-both`       | `drag: true`          |
| `animate-drag-x`          | `drag: "x"`           |
| `animate-drag-elastic-50` | `dragElastic: 0.5`    |

### Filters

| Class                                        | Effect                      |
| -------------------------------------------- | --------------------------- |
| `animate-hover:blur-10`                      | `filter: blur(10px)`        |
| `animate-hover:grayscale-100`                | `filter: grayscale(1)`      |
| `animate-hover:sepia-50`                     | `filter: sepia(0.5)`        |
| `animate-hover:invert-100`                   | `filter: invert(1)`         |
| `animate-hover:hue-rotate-90`                | `filter: hue-rotate(90deg)` |
| `animate-hover:drop-shadow-[0_4px_8px_#000]` | `filter: drop-shadow(...)`  |

Multiple filter classes on one gesture combine into a single `filter` string.

### Scroll-Linked Animations

Continuously map scroll progress (0→1) onto a style value. These compile to the `mw.*`
runtime automatically (they need hooks + a ref).

| Class                          | Effect                                |
| ------------------------------ | ------------------------------------- |
| `animate-scroll:y-[0,-200]`    | `y` 0 → -200px across scroll          |
| `animate-scroll:opacity-[1,0]` | fade out on scroll                    |
| `animate-scroll:scaleX-[0,1]`  | progress-bar fill                     |
| `animate-scroll-axis-x`        | track horizontal scroll               |
| `animate-scroll-container`     | track the page instead of the element |

### Named Variants

Define named states and select the active one — a parent's state propagates to children.

```jsx
<div className="animate-variant-hidden:opacity-0 animate-variant-visible:opacity-100 animate-from-hidden animate-to-visible" />
// → variants={{ hidden: {opacity:0}, visible: {opacity:1} }} initial="hidden" animate="visible"
```

## Dynamic ClassNames

For dynamic classNames that Babel can't statically analyze, use the runtime fallback:

```tsx
import { mw } from "motionwind-react";

<mw.button
  className={`${isActive ? "bg-blue-500" : "bg-gray-500"} animate-hover:scale-110`}
>
  Dynamic
</mw.button>;
```

## Packages

| Package                      | Description                                                                       |
| ---------------------------- | --------------------------------------------------------------------------------- |
| `motionwind-core`            | Shared parser, types, configuration, registry, plugin and adapter contracts       |
| `motionwind-react`           | React runtime plus Babel, Vite, and Next.js integrations                          |
| `motionwind-vue`             | Vue/Vite and Nuxt integration                                                     |
| `motionwind-vanilla`         | Browser DOM adapter                                                               |
| `motionwind-react-native`    | Beta React Native runtime with capability diagnostics                             |
| `create-motionwind`          | CLI to scaffold motionwind — and `migrate` an existing Motion codebase to classes |
| `eslint-plugin-motionwind`   | ESLint rules: unknown classes, duplicate props, dynamic-className pitfalls        |
| `prettier-plugin-motionwind` | Sorts `animate-*` classes into a canonical order                                  |

## Tooling

```bash
# Convert an existing Framer Motion / Motion codebase to classes
npx create-motionwind@2 migrate src --write
```

```js
// eslint.config.js
import motionwind from "eslint-plugin-motionwind";
export default [motionwind.configs.recommended];
```

```json
// .prettierrc
{ "plugins": ["prettier-plugin-motionwind"] }
```

## Development

```bash
bun install        # install deps
bun run dev        # dev mode
bun run build      # build
bun run test       # test
bun run lint       # lint
bun run check-types # type check
```
