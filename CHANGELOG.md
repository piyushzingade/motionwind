# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **More CSS filters**: `grayscale`, `sepia`, `invert`, `hue-rotate`, and `drop-shadow-[…]` (web; parsed-and-dropped on React Native)
- **Scroll-linked animations**: `animate-scroll:{prop}-[from,to]` with `animate-scroll-axis-x`, `animate-scroll-container`, and `animate-scroll-offset-[…]`. The Babel plugin routes these to the `mw.*` runtime (`useScroll`/`useTransform`); React Native support via a scroll-progress context on `mw.ScrollView` (experimental)
- **First-class named variants**: `animate-variant-{name}:{prop-value}` definitions plus `animate-from/to/exit-{name}` state selectors, with parent→child propagation (context-based on React Native)
- **`motionwind-react/tooling`** entry: `analyzeClassName`, `classifyMotionToken`, `sortMotionClasses`, and `generateMotionCode`
- **`eslint-plugin-motionwind`**: `no-unknown-classes`, `no-duplicate-gesture-props`, `prefer-mw-for-dynamic`, `exit-requires-presence`
- **`prettier-plugin-motionwind`**: sorts `animate-*` classes into a canonical order
- **`create-motionwind migrate`**: codemod that converts an existing Motion codebase (`<motion.* … />`) into motionwind classes
- **Playground**: full `/play` page on the web app and an embedded `<Playground>` component in the docs
- First tests for `motionwind-react-native` (parser)

### Changed

- Upgraded Next.js to 16.2.6+ (patches the RSC denial-of-service advisory CVE-2026-23870)

## [0.1.0] - 2025-07-14

### Added

- Babel plugin that transforms Tailwind-like motion classes into Motion component props at build time
- Class parser supporting animations: `animate-`, `initial-`, `exit-`, `whileHover-`, `whileTap-`, `whileFocus-`, `whileInView-`
- Transform properties: `translate`, `rotate`, `scale`, `skew`, with X/Y axis variants
- Basic animation properties: `opacity`, `backgroundColor`, `color`, `width`, `height`, `borderRadius`
- Physics-based animations via `spring-`, `duration-`, `delay-`, `ease-`, `damping-`, `stiffness-`, `mass-` classes
- Keyframe animations with bracket syntax (e.g., `animate-opacity-[0,0.5,1]`)
- Scroll-triggered animations with `whileInView-` and viewport options (`viewport-once`, `viewport-amount-`)
- Drag support with `drag`, `drag-x`, `drag-y`, and `dragConstraints-` classes
- Layout animations via `layout` and `layoutId-` classes
- SVG animation support for `pathLength`, `pathOffset`, `pathSpacing`
- `<M>` wrapper component for applying motion classes to any React element
- Next.js integration via `motionwind/next` (SWC + Babel plugin)
- Vite plugin via `motionwind/vite`
- CLI scaffolding tool (`create-motionwind`)
- Full TypeScript support with exported types
- Dual CJS/ESM package output

[0.1.0]: https://github.com/piyushzingade/motionwind/releases/tag/v0.1.0
