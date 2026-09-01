# Motionwind — Product Definition

## One-line pitch
Write Motion animations as Tailwind-like utility classes. Transformed at build time. Zero runtime overhead.

## Target user
Frontend developers (React, Vue, vanilla, React Native) who want expressive, performant animations without learning a new API or shipping parser bundles.

## Core value props
1. **Utility-first syntax** — `animate-hover:scale-110` feels native to Tailwind users
2. **Build-time compilation** — Babel plugin emits optimized `motion` components; no parser in production
3. **Framework agnostic** — One syntax, four targets (React, Vue, Vanilla, React Native)
4. **Full Motion power** — Springs, drag, layout, scroll, variants, exit animations all available

## Brand personality
Technical, precise, developer-first. Not playful or whimsical. The aesthetic should feel like a well-crafted developer tool — clean, high-contrast, information-dense where it matters, generous whitespace where it doesn't.

## Color strategy
**Committed** — the acid lime (`#c8ff2e` dark / `#5b8c00` light) carries 30-40% of visual weight. It's the unmistakable brand signal. Dark mode is default; light mode is a first-class peer (not an afterthought).

## Register
Product UI / Developer tool landing page. Design serves the product — clarity > cleverness.

## Key surfaces
1. **Landing page** (`/`) — marketing, demos, syntax reference, install
2. **Studio** (`/play`) — interactive playground with live preview, code generation, shareable URLs
3. **Docs** (separate app) — full documentation

## Navigation structure
- **Landing** → hero → demos → how it works → features → syntax → get started → footer
- **Studio** in top-level nav (not buried)
- Consistent header across both surfaces with theme toggle

## Motion principles
- Composite-only (transform/opacity) for 60fps
- Spring physics as default feel (stiffness ~300, damping ~20)
- Reduced-motion: instant crossfade, no parallax/glow
- Stagger only where it clarifies sequence (not reflexive)
- Mouse-follow glow on hero — spring-smoothed, GPU composited