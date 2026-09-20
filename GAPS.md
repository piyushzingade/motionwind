# Motionwind Feature Gaps vs Motion 13

Engineering tracker comparing Motionwind with
[Motion](https://github.com/motiondivision/motion). This is not user-facing
documentation or a release promise. It records what Motionwind already supports,
what needs verification, and what Motion 13.4 introduces that may be worth
adding.

Sources checked:

- Current repo on `feat/docs-landing-and-toc`
- `motion@13.4.0`
- `motion-v@2.4.4`
- Motion changelog and upgrade guides

---

## Current status: no longer gaps

The original gap list was written before the v2 docs/parser work. These items
are now implemented or documented in this branch and should be treated as
verification-only work unless tests prove otherwise.

| Area                        | Current Motionwind support                                                                                                                                           | Follow-up                                                         |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Layout basics               | `animate-layout`, `animate-layout-position`, `animate-layout-size`, `animate-layout-preserve`, `animate-layout-id-*`, `animate-layout-scroll`, `animate-layout-root` | Verify docs, parser, codegen, Vue, and React runtime stay aligned |
| SVG path drawing            | `path-length-*`, `path-offset-*`, `path-spacing-*`, plus bracket syntax like `[pathLength=1]`                                                                        | Keep SVG docs and compatibility matrix accurate                   |
| Drag basics                 | `animate-drag-both`, axis drag, elastic, momentum, snap-to-origin, direction lock, pixel constraints                                                                 | Add missing Motion 13 per-axis snap support                       |
| Repeat controls             | `animate-repeat-*`, `animate-repeat-reverse`, `animate-repeat-mirror`, `animate-repeat-delay-*`                                                                      | Confirm sequence-specific behavior remains direct Motion-only     |
| Scroll-linked React/runtime | `animate-scroll:*`, axis, offset, container support in React runtime path                                                                                            | Vue remains warning-level; React Native remains beta              |
| Reduced motion config       | `reducedMotion: "user" \| "always" \| "never"` via config/provider                                                                                                   | Keep docs clear on class-level vs global policy                   |
| Exit prop generation        | `animate-exit:*` compiles to Motion `exit`; `MotionwindPresence` re-exports `AnimatePresence`                                                                        | Continue documenting wrapper requirement                          |

---

## Package upgrade audit

Motionwind packages and starters now target Motion 13 for web runtimes and
Motion Vue 2 for Vue. The class language remains intentionally conservative;
Motion 13-only APIs still need explicit parser/codegen design before exposing
new utility tokens.

| Package         | Latest checked | Current repo usage                                     | Priority |
| --------------- | -------------- | ------------------------------------------------------ | -------- |
| `motion`        | `13.4.0`       | Apps and web packages use `^13.4.0`; peers allow 11–13 | Done     |
| `framer-motion` | `13.4.0`       | Resolved transitively by `motion@13.4.0`               | Low      |
| `motion-v`      | `2.4.4`        | Vue package uses `^2.4.4`; peers require Vue Motion 2  | Done     |

Recommended audit:

1. Run packed starter compatibility checks on the upgraded dependency graph.
2. Verify Vue/Nuxt with `motion-v@2.4.4`, especially CJS/ESM packaging.
3. Add explicit Motion 13-only utility syntax only after parser and runtime tests
   define its cross-framework behavior.

---

## Motion 13 React compatibility

### `MotionConfig isValidProp`

Motion 13 removed the optional `@emotion/is-prop-valid` dependency and expects
users of styled-components/emotion to inject prop filtering explicitly through
`MotionConfig isValidProp`.

| Need                                                                    | Priority | Recommended Motionwind action           |
| ----------------------------------------------------------------------- | -------- | --------------------------------------- |
| Document behavior for styled wrappers passed to `mw.create()`           | High     | Add docs note and example               |
| Confirm `MotionwindProvider` passes through `MotionConfig` safely       | High     | Add React runtime test                  |
| Decide whether MotionwindProvider should expose `isValidProp` in config | Medium   | Prefer pass-through prop only if needed |

Suggested docs example:

```tsx
import isPropValid from "@emotion/is-prop-valid";
import { MotionwindProvider } from "motionwind-react";

<MotionwindProvider config={config} motionConfig={{ isValidProp }}>
  <App />
</MotionwindProvider>;
```

This API does not exist today; treat it as a proposal unless implemented.

---

## View transitions

Motion 12.41 added `animateView`, and Motion 13.4 added React `AnimateView` for
React 19.3 view transitions.

| Motion API                  | Description                                   | Priority | Motionwind direction                     |
| --------------------------- | --------------------------------------------- | -------- | ---------------------------------------- |
| `animateView`               | JavaScript View Transition API orchestration  | Medium   | Document direct Motion usage first       |
| `AnimateView`               | React wrapper for React 19.3 `ViewTransition` | Medium   | Track until React 19.3 is stable in repo |
| View transition class hooks | `.class(name)` tags transition layers         | Low      | Direct Motion escape hatch               |

Do not add class syntax yet. View transitions span route/page state and are not a
simple element animation token.

---

## Layout additions from Motion 12.36+

Motion added axis-locked layout animations and a custom layout anchor.

| Motion API     | Description                              | Priority | Possible syntax                   |
| -------------- | ---------------------------------------- | -------- | --------------------------------- |
| `layout="x"`   | Animate layout changes on x axis only    | High     | `animate-layout-x`                |
| `layout="y"`   | Animate layout changes on y axis only    | High     | `animate-layout-y`                |
| `layoutAnchor` | Custom anchor point for projection boxes | Medium   | `animate-layout-anchor-[0.5,0.5]` |

Implementation notes:

- Extend `LayoutConfig.layout` to include `"x"` and `"y"`.
- Add parser, registry, codegen, React Babel/runtime, Vue props, docs, and tests.
- Treat `layoutAnchor` as experimental until exact Motion type/value shape is
  confirmed.

---

## Drag additions from Motion 12.36+

Motion allows `dragSnapToOrigin` to be scoped per axis.

| Motion API             | Description                | Priority | Possible syntax       |
| ---------------------- | -------------------------- | -------- | --------------------- |
| `dragSnapToOrigin="x"` | Snap x axis back to origin | Medium   | `animate-drag-snap-x` |
| `dragSnapToOrigin="y"` | Snap y axis back to origin | Medium   | `animate-drag-snap-y` |

Current `animate-drag-snap` maps to boolean `dragSnapToOrigin`. Add per-axis
syntax without changing existing behavior.

Drag callbacks and `useDragControls()` remain direct Motion APIs; class syntax
should not invent callback wiring.

---

## Curved motion and transition paths

Motion 12.40 added `transition.path` and `arc()` for arc motion.

| Motion API        | Description               | Priority | Motionwind direction             |
| ----------------- | ------------------------- | -------- | -------------------------------- |
| `transition.path` | Drive values along a path | Medium   | Docs/direct Motion first         |
| `arc()`           | Generate arc trajectories | Medium   | Consider helper export or recipe |

Suggested first step: add examples in advanced-effects docs and recipe registry,
not parser syntax. Curved motion usually needs coordinates, layout context, and
runtime values.

---

## Effects and non-DOM subjects

Motion 13.2 added `animate.addEffect()` and `createEffect` options for driving
non-DOM subjects. The Motion docs also expose effect utilities.

| Motion API            | Description                               | Priority | Motionwind direction             |
| --------------------- | ----------------------------------------- | -------- | -------------------------------- |
| `animate.addEffect()` | Register custom effect targets            | Low      | Direct Motion escape hatch       |
| `createEffect`        | Custom effect with `test`, `read`, `step` | Low      | Direct Motion escape hatch       |
| `styleEffect`         | Render Motion values to styles            | Low      | Companion docs                   |
| `attrEffect`          | Render Motion values to attributes        | Low      | Useful for SVG docs              |
| `propEffect`          | Render Motion values to object props      | Low      | Direct Motion escape hatch       |
| `svgEffect`           | SVG-specific value rendering              | Low      | Compare with current SVG support |

These APIs do not fit static class compilation well. Document how to combine
them with Motionwind-generated static animation props.

---

## Motion values and hooks

Motionwind should continue to support static class workflows, but users still
need Motion values for cursor followers, scroll math, physics, and continuous
interaction.

| Motion API                            | Current status                                    | Priority |
| ------------------------------------- | ------------------------------------------------- | -------- |
| `useMotionValue()` / `motionValue()`  | Direct Motion API                                 | Medium   |
| `useTransform()` / `transformValue()` | Direct Motion API                                 | Medium   |
| `useSpring()` / `springValue()`       | Direct Motion API                                 | Medium   |
| `useVelocity()`                       | Direct Motion API                                 | Low      |
| `useMotionValueEvent()`               | Direct Motion API                                 | Low      |
| `useScroll()`                         | Direct API plus React scroll-linked class runtime | Medium   |

Recommended Motionwind action:

- Improve docs that show mixed usage: Motionwind classes for discrete states,
  Motion hooks for continuous values.
- Avoid class syntax for arbitrary Motion value graphs until a concrete product
  need appears.

---

## Reorder

Motion 13.1 improved `Reorder` with multidimensional reorder, automatic axis
detection, and RTL support.

| Feature                               | Priority | Motionwind direction                                        |
| ------------------------------------- | -------- | ----------------------------------------------------------- |
| `Reorder.Group` / `Reorder.Item` docs | Medium   | Direct Motion API with Motionwind classes on child controls |
| Multidimensional reorder              | Medium   | Example/demo only                                           |
| Automatic axis detection              | Low      | Mention in docs after Motion 13 upgrade                     |
| RTL support                           | Low      | Compatibility note                                          |

Do not wrap `Reorder` in class syntax yet. It is a structural component API.

---

## Color and value type support

Motion 12.37 added support for modern color types and improved scroll offset
hardware acceleration.

| Feature                                         | Priority | Motionwind direction                        |
| ----------------------------------------------- | -------- | ------------------------------------------- |
| `oklch`, `oklab`, `lab`, `lch` colors           | Medium   | Add parser/docs tests for bracket values    |
| `color()`, `color-mix()`, `light-dark()`        | Medium   | Verify arbitrary values pass through safely |
| Scroll offsets `"start"` / `"end"` acceleration | Low      | Docs note only                              |

Motionwind already supports arbitrary value syntax for color-like properties.
The gap is test coverage and examples.

---

## Advanced integrations

Motion 13.2 added `motion/three` and `motion/vgpu`.

| Integration                  | Priority | Motionwind direction                           |
| ---------------------------- | -------- | ---------------------------------------------- |
| `motion/three`               | Low      | Direct Motion escape hatch                     |
| `motion/vgpu`                | Low      | Direct Motion escape hatch                     |
| Three.js/WebGPU class syntax | Very low | Out of scope unless a dedicated adapter exists |

Motionwind should not claim support here. Add docs saying these are direct
Motion APIs that can coexist with Motionwind in the same app.

---

## Updated priority summary

### Must have

- [ ] Audit and test `motion@13.4.0` across apps, starters, and packages.
- [ ] Audit and test `motion-v@2.4.4` across Vue/Nuxt package and starters.
- [ ] Document Motion 13 `MotionConfig isValidProp` implications for
      `mw.create()` and styled wrappers.
- [ ] Add `animate-layout-x` and `animate-layout-y`.
- [ ] Add per-axis `animate-drag-snap-x` / `animate-drag-snap-y`.

### Should have

- [ ] Decide whether `layoutAnchor` gets parser syntax or remains direct Motion.
- [ ] Add advanced docs for `animateView` / `AnimateView`.
- [ ] Add recipe/docs examples for `transition.path` and `arc()`.
- [ ] Add modern color parser/docs test coverage.
- [ ] Refresh Reorder docs for Motion 13 behavior.

### Nice to have

- [ ] Document `animate.addEffect()` and effect utilities as direct Motion
      escape hatches.
- [ ] Add mixed Motion-value examples for cursor, scroll, and physics patterns.
- [ ] Document `motion/three` and `motion/vgpu` as out-of-scope integrations.
- [ ] Consider helper recipes for arc motion and view-transition-like patterns.

---

## What Motionwind already does better

- [x] Zero runtime for static classes via compile-time transforms.
- [x] Tailwind-familiar syntax for common Motion props.
- [x] Multi-framework support across React, Vue, Vanilla, and React Native.
- [x] Tooling ecosystem: ESLint, Prettier, CLI, MCP, VS Code, Studio.
- [x] Config tokens, presets, and plugin hooks.
- [x] Recipe registry and code generation helpers.
- [x] Compatibility matrix and starter verification flow.

---

## Guardrails

- Prefer direct Motion escape hatches for structural APIs: `Reorder`,
  `AnimatePresence`, `AnimateView`, effects, Three.js, and WebGPU.
- Add class syntax only when the mapping is deterministic and adapter-friendly.
- Keep every new token in sync across parser, registry, codegen, adapters, docs,
  fixture corpus, ESLint, Prettier, VS Code, MCP, and compatibility data.
