# motionwind

**Motion animations as Tailwind classes.** A Babel plugin that turns
`animate-hover:scale-110` into `whileHover={{ scale: 1.1 }}` at build time — zero imports,
zero boilerplate.

```jsx
// Before
<motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>Click</motion.button>

// After — no imports needed
<button className="animate-hover:scale-110 animate-tap:scale-90">Click</button>
```

## Quick Start

```bash
npx create-motionwind init
```

```js
// next.config.js
import withMotionwind from "motionwind-react/next";
export default withMotionwind({});
```

For dynamic classNames, use the `mw.*` runtime component from `motionwind-react`.

## Docs

- **Guides & reference** — [motionwind.xyz](https://motionwind.xyz), or try it live in the [Playground](https://motionwind.dev/play)
- **Syntax & features** — [`packages/documentation/features.md`](packages/documentation/features.md)
- **Architecture & internals** — [`packages/documentation/architecture.md`](packages/documentation/architecture.md)
- **Contributing** — [`packages/documentation/architecture.md#contributing`](packages/documentation/architecture.md#contributing)

## License

MIT
