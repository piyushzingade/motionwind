---
title: "Motionwind Growth Plan"
description: "Draft engineering backlog behind the roadmap themes — adapter parity, new syntax, ecosystem, and tooling quality."
---

# Motionwind growth plan

> **Status:** Draft · **Scope:** Adapter parity, new syntax, ecosystem, tooling, quality
> **Companion docs:** [`ROADMAP.md`](../ROADMAP.md), [`CONTRIBUTING.md`](../CONTRIBUTING.md)

This plan is the engineering backlog behind the roadmap themes — **Adoption and trust**, **Extensible platform**, and **Creator ecosystem**. It is organized into five phases, ordered roughly by impact. Each phase has concrete steps and an exit criterion.

---

## Phase 1 — Adapter parity & exit orchestration

The "write once, run everywhere" promise currently breaks on missing features. `animate-exit:` classes parse in every adapter, but **no adapter unmounts a component** — exit orchestration is the single biggest gap.

| Feature                | Vue                       | Vanilla | React Native                |
| ---------------------- | ------------------------- | ------- | --------------------------- |
| Scroll-linked          | ❌ warns (`props.ts:8-9`) | ✅      | ⚠️ ScrollView-only          |
| Drag                   | ✅                        | ❌      | ❌                          |
| Layout                 | ✅                        | ❌      | ❌                          |
| Exit / AnimatePresence | props only                | ignored | parsed but dead             |
| In-view                | ✅                        | ✅      | ❌ diagnostic               |
| SVG                    | ✅                        | ✅      | ❌                          |
| Babel build-time       | static only               | n/a     | **stub** (`babel.ts:19-31`) |

**1.1 Exit / AnimatePresence orchestration (all adapters)**

- React: export `<MotionwindPresence>` (AnimatePresence wrapper); point the `exit-requires-presence` ESLint rule at it.
- Vue: wrap Motion Vue's `Presence`/`Transition` equivalents.
- Vanilla: best-effort `animate()` to final state on removal, documented.
- React Native: consume the already-parsed `gestures.exit` in `use-motionwind.ts` (currently dead code) via app-controlled unmount.

**1.2 Vue — scroll-linked animations**

- Add a `v-motionwind-scroll` directive / `<MotionwindScroll>` component using Motion Vue's scroll API.
- Update `VUE_CAPABILITIES` to `scroll: true`; remove `warnScroll`.

**1.3 Vanilla — drag, layout, variants, exit**

- Research which Motion vanilla APIs cover these (`drag()`, layout via `animate()`/`layout`, variant propagation).
- Implement what's feasible; document the rest in the compatibility matrix.

**1.4 React Native — real Babel plugin**

- Replace the no-op stub (`babel.ts:19-31`) with a Metro-compatible transform mirroring the web plugin, or explicitly remove it and document runtime-only usage.

**1.5 React Native — drag, layout, in-view, SVG**

- Drag: Reanimated pan-handler based with `dragConstraints`.
- Layout: Reanimated layout animations (`entering`/`exiting`) for `layout`/`layoutId`.
- In-view: replace the `onLayout` heuristic (`use-in-view.ts`) with a native driver.
- SVG: add `pathLength`/`pathOffset`/`pathSpacing` stroke support.
- Add tests for `use-motionwind.ts` and `component.tsx` (currently untested).

**Exit criterion:** the compatibility matrix shows parity across web/native adapters; CI `compatibility:check` is green.

---

## Phase 2 — New syntax & Motion features

**2.1 `motion-reduce:` / `motion-safe:` variants**

- Tailwind-style per-class reduced-motion toggling (today it's global-only via provider/policy).
- Add to parser, `mw.*` runtime, and Babel build-time; propagate through registry, ESLint, Prettier, and VSCode (registry-driven).

**2.2 Motion-value runtime**

- Expose `useMotionwindValue`, `useTransform`, `useSpring`, `useVelocity` hooks and a `mw.Value` component.
- ⚠️ **Design decision needed:** class syntax for motion values (e.g. `animate-value:x-[0,200]` or `animate-spring:` scoping).

**2.3 Richer timing**

- `type: "inertia"` + `velocity-`; per-gesture transition scoping (`animate-hover:duration-200`); named easing tokens.
- Ensure remaining `TransitionConfig` fields (`times`, `restSpeed`, `restDelta`) are emitted by all adapters.

**2.4 Layout groups & drag controls**

- `LayoutGroup` scoping and `dragControls` class syntax.

**2.5 New properties**

- Per-corner radius (`rounded-t-l-`), `zIndex`, `mask`/`WebkitMask`, `boxShadow`/`textShadow` keyframes, `transformTemplate`.

**Exit criterion:** every new token appears in `MOTIONWIND_SYNTAX_REGISTRY`, the fixtures corpus, and at least one adapter; docs updated.

---

## Phase 3 — Adoption & ecosystem

**3.1 Tailwind integration** — the top adoption blocker: `animate-*` collides with Tailwind's namespace.

- Ship a Tailwind v4 `@plugin` (and v3 preset) for coexistence + intellisense + correct exclusion of Tailwind's built-in `animate-spin` etc.
- Consider an opt-in `mw-` prefix (`mw-animate-hover:scale-110`) to avoid collisions entirely.

**3.2 More framework targets**

- Explicit Nuxt module (currently runtime-only path).
- Community-owned adapter scaffolding for Svelte / Solid / Astro / Remix.

**3.3 Recipe registry growth** — 12 → ~30 high-demand recipes: flip-card, marquee, magnetic button, parallax, text-stagger, skeleton shimmer, count-up, tilt-card, morphing-blob, gradient-shift, cursor-glow, hamburger-to-x. Keep `create-motionwind add` and the Studio in sync via schema versioning.

**3.4 Studio upgrades** (`apps/web/play`)

- Drag/layout editing in the preview, spring physics playground, embeddable studio, full-state share (add stage-size + reduced-motion to the URL hash).
- Fix the `v0.3` vs `v2.0.0` version badge and stale `motionwind/next` import names.

**Exit criterion:** Tailwind plugin passes starter E2E; 3+ community-ready adapters; recipe count ≥ 30 with Studio + CLI parity.

---

## Phase 4 — Tooling depth

**4.1 CLI** (`packages/cli`)

- Interactive prompts, `--version`, subcommand `--help`.
- `migrate`: emit scroll-linked classes, handle `.mts/.cts/.cjs`, serialize `inertia`/`when`; add preset listing for `add`.
- Replace regex-based config editing (`preset.ts:30-37`) with parser-based editing.
- Tests for `init`, `doctor`, `preset` (currently untested).

**4.2 ESLint** — autofixers, `class` attribute support, legacy eslintrc `configs` export.

**4.3 Prettier** — sort template-literal classNames; register an `html` parser.

**4.4 VSCode extension**

- AST-based document scanning (replace regex in `documentUtils.ts`), sort-on-save formatter, remove dead code in `completionData.ts`, add publish config, and tests.

**4.5 unplugin** — real tests for Vite/Rollup/webpack/Rspack/esbuild entry points (currently `--passWithNoTests`).

**Exit criterion:** every tooling package has tests; lint/format tooling remains registry-driven.

---

## Phase 5 — Quality & infrastructure

- **Coverage:** v8 per-package thresholds + Codecov badge + CI enforcement; cover the untested surfaces above.
- **Dedupe tests:** remove the byte-identical `packages/motionwind/__tests__/parser.test.ts` duplicate (~149 tests run twice).
- **Format gate:** run `prettier --check` in CI (today it's manual only).
- **Docs:** add unplugin + VSCode pages, full API reference (runtime components, config, hooks, all exports), expand CLI/MCP pages, finish the in-progress docs migration to root `docs/` (uncommitted renames risk breaking the Fumadocs build).
- **Cleanup:** delete or repurpose `@repo/ui` create-turbo boilerplate; fix web version/name inconsistencies.

---

## Execution order & open decisions

**Recommended order:** Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5.

**Open design decisions before coding:**

1. Motion-value class syntax (Phase 2.2).
2. Tailwind plugin prefix strategy (Phase 3.1).

**Definition of done for each phase:** exit criterion met + CI green + docs updated + changeset entry.
