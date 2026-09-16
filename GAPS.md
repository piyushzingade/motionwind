# Motionwind Feature Gaps vs Motion

Feature comparison with [Motion](https://github.com/motiondivision/motion) — what's missing and what can be added.

---

## Layout Animations

Motionwind has no equivalent for layout-based animations.

| Motion API | Description | Priority |
|---|---|---|
| `layout` | Auto-animates position/size changes using FLIP technique | High |
| `layoutId` | Shared element transitions between components | High |
| `LayoutGroup` | Coordinate layout animations across sibling components | Medium |
| `layoutScroll` | Correct layout measurement in scrollable containers | Low |
| `layoutRoot` | Correct layout measurement in fixed containers | Low |
| `layoutAnchor` | Custom transform origin for layout animations | Low |

**Possible class syntax:**
```
animate-layout
animate-layout-id:my-element
```

---

## SVG Animation

No SVG-specific animation classes exist.

| Motion API | Description | Priority |
|---|---|---|
| `pathLength` | Draw-on effect for SVG paths (0-1 progress) | High |
| `pathSpacing` | Spacing along SVG path | Low |
| `pathOffset` | Offset along SVG path | Low |
| Path morphing | Animate between similar SVG shapes | Medium |
| `viewBox` animation | Pan/zoom SVG viewBox | Low |
| `attrX`, `attrY` | Animate SVG attributes directly | Low |
| SVG filters | Animate `feTurbulence`, `feDisplacementMap` | Low |

**Possible class syntax:**
```
animate-enter:pathLength-100
animate-duration-1000
```

---

## Drag System

Motionwind has basic drag but missing constraints and events.

| Motion API | Description | Priority |
|---|---|---|
| `dragConstraints` | Limit drag to a container or ref | High |
| `dragConstraints={{ top, left, right, bottom }}` | Pixel-based constraints | High |
| `dragDirectionLock` | Lock to single axis automatically | Medium |
| `onDragStart` | Callback when drag starts | High |
| `onDrag` | Callback during drag | High |
| `onDragEnd` | Callback when drag ends | High |
| `useDragControls()` | Imperative drag start/stop | Medium |
| `snapToCursor` | Snap element to cursor on drag start | Low |

**Possible class syntax:**
```
animate-drag-x animate-drag-constrain-parent
```

Events would need a runtime API or callback props.

---

## Value System

Motionwind has no reactive value primitives.

| Motion API | Description | Priority |
|---|---|---|
| `useMotionValue()` | Reactive animation values (bypass React render) | Medium |
| `useTransform()` | Map/chain values (input ranges to output ranges) | Medium |
| `useSpring()` | Spring-attached motion value | Low |
| `useVelocity()` | Track velocity of another value | Low |
| `useScroll()` | Scroll position as motion value | Medium |
| `useInView()` | Boolean viewport intersection state | Low |
| `useMotionValueEvent()` | Subscribe to motion value changes | Low |

These are imperative APIs — may not fit the class-based model. Could be exposed as companion hooks.

---

## Scroll System

Motionwind has `animate-inview` but missing scroll-linked animations.

| Motion API | Description | Priority |
|---|---|---|
| `useScroll()` | Scroll position + progress as motion value | Medium |
| Scroll-linked values | Map scroll progress to element properties | Medium |
| Parallax | Scroll-driven position offset | Medium |
| Horizontal scroll | Sticky container + scroll mapping | Low |
| Custom scroll containers | Measure within a specific scrollable element | Low |
| `ScrollTimeline` | Native browser scroll animation (no JS per frame) | Low |

**Possible class syntax:**
```
animate-scroll:y-[0,-200] animate-scroll-linked
```

---

## Easing Functions

Motionwind has basic easing — Motion has more named curves.

| Motion Easing | Description | Priority |
|---|---|---|
| `anticipate` | Pull back before moving forward | Medium |
| `backIn`, `backOut`, `backInOut` | Overshoot easing | Medium |
| `circIn`, `circOut`, `circInOut` | Circular easing | Low |
| Custom JS functions | Pass easing function as value | Low |

**Possible class syntax:**
```
animate-ease-anticipate
animate-ease-back-in-out
```

---

## Timeline / Sequencing

Motionwind explicitly excludes imperative timelines. Consider if worth adding.

| Motion API | Description | Priority |
|---|---|---|
| `animate()` sequence | Chain multiple animations with timing | Low |
| Labels (`"<"`, `"+0.5"`) | Relative and absolute scheduling | Low |
| `.pause()`, `.play()`, `.stop()` | Playback controls | Low |
| `.then()` | Promise-based completion | Low |

This is a design philosophy decision. Motionwind targets common UI animation, not complex timelines.

---

## Animation Controls

No imperative playback control in Motionwind.

| Motion API | Description | Priority |
|---|---|---|
| `.pause()` | Pause running animation | Low |
| `.play()` | Resume paused animation | Low |
| `.stop()` | Stop animation | Low |
| `.cancel()` | Cancel and reset | Low |
| `.complete()` | Jump to end | Low |
| `.time` | Get/set current time | Low |
| `.speed` | Get/set playback speed | Low |

---

## Components

Motion has components Motionwind doesn't.

| Motion API | Description | Priority |
|---|---|---|
| `Reorder` | Drag-to-reorder lists | Medium |
| `AnimatePresence` | Exit animations (keep in DOM during removal) | High |
| `MotionConfig` | Global defaults (transition, reducedMotion) | Medium |

**Note:** `AnimatePresence` is critical — `animate-exit:` classes may not work without it.

**Possible class syntax for AnimatePresence:**
```
// Maybe not class-based — needs wrapper component
```

---

## Reduced Motion

Motion handles reduced motion at library level. Motionwind uses design tokens.

| Motion Approach | Motionwind Approach |
|---|---|
| `MotionConfig reducedMotion="user"` | Design tokens (`0ms` instant) |
| Disables transforms automatically | Manual token configuration |
| Persists opacity/color transitions | Relies on CSS |

**Gap:** No library-level reduced motion policy. Users must configure tokens manually.

**Possible addition:**
```ts
// motionwind.config.ts
export default defineConfig({
  reducedMotion: "user" | "always" | "never"
});
```

---

## Other Features

| Motion API | Description | Priority |
|---|---|---|
| CSS variable animation | Animate `--custom-prop` | Low |
| Arc motion paths | Curved motion trajectories | Low |
| Three.js / WebGL | 3D animation support | Low |
| `stagger()` | Distribute delays across elements | Low |
| `spring()` | Standalone spring generator | Low |

---

## Priority Summary

### Must Have (High Priority)
- [ ] `layout` — FLIP animations
- [ ] `layoutId` — shared element transitions
- [ ] `AnimatePresence` — exit animations wrapper
- [ ] `dragConstraints` — limit drag area
- [ ] Drag events (`onDragStart`, `onDrag`, `onDragEnd`)
- [ ] SVG `pathLength` — draw-on effect

### Should Have (Medium Priority)
- [ ] `LayoutGroup` — coordinate layout across components
- [ ] `useMotionValue()` / `useTransform()` — reactive values
- [ ] `useScroll()` — scroll-linked animations
- [ ] Parallax classes
- [ ] `MotionConfig` — global defaults
- [ ] `Reorder` — drag-to-reorder
- [ ] Named easings (`anticipate`, `backIn`, etc.)
- [ ] `dragDirectionLock`

### Nice to Have (Low Priority)
- [ ] `layoutScroll` / `layoutRoot`
- [ ] SVG path morphing
- [ ] `viewBox` animation
- [ ] Arc motion paths
- [ ] Timeline sequencing
- [ ] Imperative playback controls
- [ ] Three.js support
- [ ] CSS variable animation
- [ ] `stagger()` utility
- [ ] `snapToCursor`

---

## What Motionwind Already Does Better

- [x] Zero runtime for static classes (compile-time)
- [x] Tailwind-familiar syntax
- [x] Broader framework support (React, Vue, Vanilla, React Native)
- [x] Richer tooling (ESLint, Prettier, CLI, MCP, Studio)
- [x] Simpler SSR (no hydration mismatch)
- [x] Config tokens and presets
- [x] Recipe registry
- [x] Design system integration via `mw.create()`
