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
# or
yarn add motionwind motion
# or
pnpm add motionwind motion
# or
bun add motionwind motion
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

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                       MONOREPO (Turborepo + Bun)                        │
│                                                                         │
│   APPS                                                                  │
│   ┌─────────────────────┐       ┌──────────────────────────┐           │
│   │   apps/web          │       │   apps/docs              │           │
│   │   (Next.js)         │       │   (Next.js + Fumadocs)   │           │
│   │   Demo / Marketing  │       │   MDX Documentation      │           │
│   └────────┬────────────┘       └────────────┬─────────────┘           │
│            └──────────────┬──────────────────┘                          │
│                           ▼                                             │
│   PACKAGES                                                              │
│   ┌──────────────────┐  ┌──────────────────────────────────────────┐   │
│   │  packages/cli     │  │  packages/motionwind  (core library)     │   │
│   │  "create-         │  │                                          │   │
│   │   motionwind"     │  │  ┌───────────┐  ┌──────────────────┐    │   │
│   │                   │  │  │ parser.ts  │  │ babel.ts         │    │   │
│   │  • Detect project │  │  │            │  │                  │    │   │
│   │    type (Next/    │  │  │ Tokenizes  │  │ AST transform:   │    │   │
│   │    Vite/CRA)      │  │  │ classNames │◄─┤ <div> → motion. │    │   │
│   │  • Install deps   │  │  │ & extracts │  │ div + props      │    │   │
│   │  • Inject config  │  │  │ motion     │  │                  │    │   │
│   │                   │  │  │ props      │  └──────┬───────────┘    │   │
│   └──────────────────┘  │  └───────────┘         │                 │   │
│                          │                  ┌─────┴──────────┐      │   │
│   ┌──────────────────┐  │  ┌───────────┐  │  vite.ts       │      │   │
│   │ packages/ui      │  │  │ next.ts   │  │  Vite plugin   │      │   │
│   │ Shared components│  │  │ Webpack   │  │  (pre phase)   │      │   │
│   ├──────────────────┤  │  │ babel-    │  │                │      │   │
│   │ eslint-config    │  │  │ loader    │  └────────────────┘      │   │
│   ├──────────────────┤  │  └───────────┘                          │   │
│   │ typescript-config│  │  ┌──────────────────────────────┐       │   │
│   └──────────────────┘  │  │ component.tsx (mw.*)          │       │   │
│                          │  │ Runtime Proxy for dynamic     │       │   │
│                          │  │ classNames Babel can't see    │       │   │
│                          │  └──────────────────────────────┘       │   │
│                          └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

### Data Flow

```
  DEVELOPMENT TIME              BUILD TIME                    RUNTIME
 ─────────────────            ──────────────                 ─────────

 You write:                   Babel plugin kicks in:         Browser gets:
 ┌────────────────────┐       ┌──────────────────┐          ┌──────────────────────┐
 │ <button className= │       │                  │          │ import { motion }    │
 │  "px-6 rounded-lg  │ ───►  │ 1. Find animate-*│  ─────►  │   from "motion/react"│
 │   animate-hover:   │       │ 2. Call parser   │          │                      │
 │     scale-110      │       │ 3. Replace elem  │          │ <motion.button       │
 │   animate-tap:     │       │ 4. Inject motion │          │  className="px-6     │
 │     scale-90       │       │    import        │          │    rounded-lg"       │
 │   animate-spring"  │       │ 5. Add           │          │  whileHover={        │
 │ >                  │       │    "use client"  │          │    {scale:1.1}}      │
 │   Click Me         │       │                  │          │  whileTap={          │
 │ </button>          │       └──────────────────┘          │    {scale:0.9}}      │
 └────────────────────┘                                     │  transition={        │
                                                            │    {type:"spring"}}  │
                                                            │ >Click Me            │
                                                            │ </motion.button>     │
                                                            └──────────────────────┘

                                                            ✅ Zero parser overhead
                                                            ✅ Zero Babel in bundle
                                                            ✅ Only Motion.js runs
```

### The Parser

```
  Input: "px-4 animate-hover:scale-110 animate-spring animate-once"
          │
          ▼
  ┌──────────────────────────────────────────────────────────┐
  │                 TOKENIZER (split by space)                │
  └──────────────────────────────────────────────────────────┘
          │
  ┌───────┴──────────┬──────────────────┬────────────────────┐
  ▼                  ▼                  ▼                    ▼
 "px-4"      "animate-hover:     "animate-spring"     "animate-once"
              scale-110"
  │                  │                  │                    │
  │  No animate-     │  Has colon →     │  No colon →        │  No colon →
  │  prefix          │  GESTURE token   │  TRANSITION token  │  VIEWPORT token
  ▼                  ▼                  ▼                    ▼
 Tailwind       whileHover:        type: "spring"       once: true
 passthrough    { scale: 1.1 }
          │                  │                  │                    │
          └──────────┬───────┴──────────────────┴────────────────────┘
                     ▼
  ┌──────────────────────────────────────────────────────────┐
  │ ParsedResult                                             │
  │   tailwindClasses: "px-4"                                │
  │   gestures:   { whileHover: { scale: 1.1 } }            │
  │   transition: { type: "spring" }                         │
  │   viewport:   { once: true }                             │
  │   hasMotion:  true                                       │
  └──────────────────────────────────────────────────────────┘
```

### Framework Integration

```
                      ┌──────────────────────┐
                      │  npx create-          │
                      │  motionwind init      │
                      └──────────┬───────────┘
                                 │
                 ┌───────────────┼───────────────┐
                 ▼               ▼               ▼
         ┌──────────────┐ ┌───────────┐  ┌─────────────┐
         │   Next.js    │ │   Vite    │  │    CRA      │
         └──────┬───────┘ └─────┬─────┘  └──────┬──────┘
                ▼               ▼               ▼
     ┌──────────────────┐ ┌──────────┐  ┌──────────────┐
     │ next.config.ts   │ │vite.     │  │ .babelrc     │
     │ withMotionwind() │ │config.ts │  │ ["motionwind │
     │ wraps webpack to │ │motionwind│  │  /babel"]    │
     │ add babel-loader │ │() plugin │  │              │
     └────────┬─────────┘ └────┬─────┘  └──────┬──────┘
              └────────────────┼───────────────┘
                               ▼
                 ┌──────────────────────────┐
                 │  Babel Plugin (babel.ts)  │
                 │  Transforms JSX at build  │
                 │  time using the parser    │
                 └──────────────────────────┘
```

### Static vs Dynamic — Two Paths

```
  ┌──────────────────────────────────────────────────────────┐
  │                     Your Component                        │
  └────────────────────────┬─────────────────────────────────┘
                           │
            ┌──────────────┴──────────────┐
            ▼                             ▼
  ┌────────────────────┐     ┌────────────────────────────┐
  │  STATIC className  │     │  DYNAMIC className         │
  │                    │     │                            │
  │  className=        │     │  className={`animate-      │
  │   "animate-hover:  │     │    hover:scale-110         │
  │    scale-110"      │     │    ${cond ? 'x' : 'y'}`}  │
  │                    │     │                            │
  │  Babel sees it ✓   │     │  Babel can't analyze ✗    │
  └────────┬───────────┘     └──────────────┬─────────────┘
           ▼                                ▼
  ┌────────────────────┐     ┌────────────────────────────┐
  │  BUILD-TIME        │     │  RUNTIME                   │
  │  Babel transforms  │     │  Use mw.* proxy:           │
  │  to <motion.btn>   │     │  <mw.button className=...> │
  │                    │     │  Parser runs in browser    │
  │  ✅ Zero overhead  │     │  ⚠️  Small runtime cost    │
  └────────────────────┘     └────────────────────────────┘
```

## Contributing

### Getting Started

```bash
# 1. Fork & clone
git clone https://github.com/<you>/motionwind.git
cd motionwind

# 2. Install dependencies (use any package manager)
npm install    # or yarn install / pnpm install / bun install

# 3. Build all packages
npm run build  # or yarn build / pnpm build / bun run build

# 4. Run dev mode (all packages + apps)
npm run dev    # or yarn dev / pnpm dev / bun run dev

# 5. Run tests
npm run test   # or yarn test / pnpm test / bun run test
```

### Where to Contribute

| Area | Path | What to Do |
|---|---|---|
| New animation property | `packages/motionwind/src/parser.ts` | Add parsing logic for new CSS/motion properties |
| New gesture type | `packages/motionwind/src/constants.ts` | Add to `GESTURE_MAP`, update parser + types |
| Babel transform bugs | `packages/motionwind/src/babel.ts` | Fix edge cases in JSX transformation |
| Next.js integration | `packages/motionwind/src/next.ts` | Improve webpack config injection |
| Vite integration | `packages/motionwind/src/vite.ts` | Improve Vite plugin behavior |
| CLI improvements | `packages/cli/src/commands/init.ts` | Add new framework detection, improve config injection |
| Documentation | `apps/docs/` | Write guides, improve API docs (MDX) |
| Demo site | `apps/web/` | Add animation showcases |
| Tests | `packages/motionwind/__tests__/` | Add parser, babel, component, or integration tests |

### Workflow

```
  1. Pick an issue or feature
         │
         ▼
  2. Create a branch ── git checkout -b feat/my-feature
         │
         ▼
  3. Make changes in the right package
         ├── Parser change?  → Add test in __tests__/parser.test.ts
         ├── Babel change?   → Add test in __tests__/babel.test.ts
         ├── Component?      → Add test in __tests__/component.test.tsx
         └── New feature?    → Add tests + update docs/
         │
         ▼
  4. Run checks
         npm run test        ── All tests pass
         npm run lint         ── No lint errors
         npm run check-types  ── No type errors
         npm run build        ── Everything builds
         │
         ▼
  5. Open a PR against main
```

### Key Conventions

- **npm**, **yarn**, **pnpm**, or **bun** — any package manager works
- **Vitest** for testing — tests live in `__tests__/` directories
- **tsup** builds the core library — config in `packages/motionwind/tsup.config.ts`
- **Turbo** orchestrates builds — `^build` means packages build before apps
- All animate classes use the `animate-` prefix to avoid collision with Tailwind
- The parser is framework-agnostic with zero dependencies — keep it that way

## License

MIT
