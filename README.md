# motionwind

**A shared utility language for Motion animation.** Motionwind turns classes such as
`animate-hover:scale-110` into Motion output at build time across React, Vue, and JavaScript,
with an explicit runtime fallback for dynamic classes and React Native.

```jsx
// Before
<motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>Click</motion.button>

// After — no imports needed
<button className="animate-hover:scale-110 animate-tap:scale-90">Click</button>
```

## Quick start

```bash
npx create-motionwind@2 init
```

The CLI detects Next.js, React/Vite, Vue/Nuxt, vanilla JavaScript, or Expo and installs the
matching published adapter. Preview changes with `npx create-motionwind@2 init --dry-run`, then
use `doctor`, `migrate`, or `add <preset>` as the project evolves.

```js
// next.config.js
import withMotionwind from "motionwind-react/next";
export default withMotionwind({});
```

For dynamic class names, use `mw.*`. Design-system components can be wrapped with
`mw.create(Component)`. The existing `animate-*` language and direct Motion APIs remain
available together—Motionwind targets the common UI-animation path, not complex imperative
timelines.

## Packages

| Package                                                   | Purpose                                                                          | Tier   |
| --------------------------------------------------------- | -------------------------------------------------------------------------------- | ------ |
| `motionwind-core`                                         | Parser, typed IR, configuration, syntax registry, plugins, and adapter contracts | Stable |
| `motionwind-react`                                        | React runtime plus Babel, Vite, and Next.js integrations                         | Stable |
| `motionwind-vue`                                          | Vue components and Vite integration                                              | Stable |
| `motionwind-vanilla`                                      | JavaScript runtime                                                               | Stable |
| `motionwind-react-native`                                 | Expo/React Native runtime                                                        | Beta   |
| `motionwind-unplugin`                                     | Vite, Rollup, webpack, Rspack, and esbuild integration layer                     | Stable |
| `create-motionwind`                                       | Init, doctor, migrate, and preset CLI                                            | Stable |
| `eslint-plugin-motionwind` / `prettier-plugin-motionwind` | Registry-driven diagnostics and formatting                                       | Stable |
| `motionwind-mcp`                                          | Registry-driven validation, explanation, optimization, and generation tools      | Stable |

Installable examples live in [`starters/`](starters). Reviewed, portable recipes live in
[`registry/recipes`](registry/recipes) and power `animate-preset-*`, Motionwind Studio, and the CLI.

## Docs

- **Guides & reference** — [motionwind.xyz](https://motionwind.xyz), or design an interaction in [Motionwind Studio](https://web.motionwind.xyz/play)
- **Syntax & features** — [`packages/documentation/features.md`](packages/documentation/features.md)
- **Architecture & internals** — [`packages/documentation/architecture.md`](packages/documentation/architecture.md)
- **Roadmap and support** — [`ROADMAP.md`](ROADMAP.md) and [`SUPPORT.md`](SUPPORT.md)
- **Contributing** — [`CONTRIBUTING.md`](CONTRIBUTING.md), [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md), and starter tasks tagged [`good first issue`](https://github.com/piyushzingade/motionwind/labels/good%20first%20issue)

All public packages are released together with Changesets, generated changelogs, npm
provenance, and canary tags. CI validates the common syntax corpus, package artifacts, registry,
supported Node versions, and adapter test suites.

## License

MIT
