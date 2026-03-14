# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
