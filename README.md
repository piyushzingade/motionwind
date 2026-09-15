# motionwind

**A shared utility language for Motion animation.** Motionwind turns classes such as
`animate-hover:scale-110` into Motion output at build time across React, Vue, and JavaScript,
with an explicit runtime fallback for dynamic classes and React Native.

<p>
  <a href="https://www.mintlify.com/oss-program">
    <img src="https://img.shields.io/badge/Sponsored%20by-Mintlify%20OSS%20Program-18E299?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIuMjY0IDMuNDM0SDYuNjkwNkM2LjI1NzQgMy40MzQgNS44NjQgMy42OTUgNS41ODIgNC4wNzJMMy41NDQgNi44MTZDMy4yMzYgNy4yMzIgMy4wNzIgNy43NDQgMy4wNzIgOC4yNzJWMTcuMzQ0QzMuMDcyIDE3Ljg3MiAzLjIzNiAxOC4zODQgMy41NDQgMTguOEw1LjU4MiAyMS41NDRDNS44NjQgMjEuOTIgNi4yNTcyIDIyLjE4NCA2LjY5MDYgMjIuMTg0SDEyLjI2NEMxMi42OTc0IDIyLjE4NCAxMy4wOSAyMS45MiAxMy4zNzIgMjEuNTQ0TDE1LjQxIDE4LjhDMTUuNzE4IDE4LjM4NCAxNS44ODIgMTcuODcyIDE1Ljg4MiAxNy4zNDRWOC4yNzJDMTUuODgyIDcuNzQ0IDE1LjcxOCA3LjIzMiAxNS40MSA2LjgxNkwxMy4zNzIgNC4wNzJDMTMuMDkgMy42OTUgMTIuNjk3NCAzLjQzNCAxMi4yNjQgMy40MzRaIiBmaWxsPSIjMThFMjk5Ii8+PC9zdmc+&labelColor=transparent&color=transparent"
    alt="Sponsored by Mintlify OSS Program"
  />
</p>

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

- **Guides & reference** — [motionwind.xyz](https://motionwind.xyz), or design an interaction in [Motionwind Studio](https://play.motionwind.xyz)
- **Syntax & features** — [`packages/documentation/features.md`](packages/documentation/features.md)
- **Architecture & internals** — [`packages/documentation/architecture.md`](packages/documentation/architecture.md)
- **Roadmap and support** — [`ROADMAP.md`](ROADMAP.md) and [`SUPPORT.md`](SUPPORT.md)
- **Contributing** — [`CONTRIBUTING.md`](CONTRIBUTING.md), [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md), and starter tasks tagged [`good first issue`](https://github.com/piyushzingade/motionwind/labels/good%20first%20issue)

All public packages are released together with Changesets, generated changelogs, npm
provenance, and canary tags. CI validates the common syntax corpus, package artifacts, registry,
supported Node versions, and adapter test suites.

## Sponsors

Motionwind is free and open source thanks to our sponsors.

### [Mintlify OSS Program](https://www.mintlify.com/oss-program)

Motionwind is proudly sponsored by the [Mintlify OSS Program](https://www.mintlify.com/oss-program),
supporting open-source developer tools. Thank you for backing motionwind!

<p>
  <a href="https://www.mintlify.com/oss-program">
    <img src="https://img.shields.io/badge/Sponsored%20by-Mintlify%20OSS%20Program-18E299?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIuMjY0IDMuNDM0SDYuNjkwNkM2LjI1NzQgMy40MzQgNS44NjQgMy42OTUgNS41ODIgNC4wNzJMMy41NDQgNi44MTZDMy4yMzYgNy4yMzIgMy4wNzIgNy43NDQgMy4wNzIgOC4yNzJWMTcuMzQ0QzMuMDcyIDE3Ljg3MiAzLjIzNiAxOC4zODQgMy41NDQgMTguOEw1LjU4MiAyMS41NDRDNS44NjQgMjEuOTIgNi4yNTcyIDIyLjE4NCA2LjY5MDYgMjIuMTg0SDEyLjI2NEMxMi42OTc0IDIyLjE4NCAxMy4wOSAyMS45MiAxMy4zNzIgMjEuNTQ0TDE1LjQxIDE4LjhDMTUuNzE4IDE4LjM4NCAxNS44ODIgMTcuODcyIDE1Ljg4MiAxNy4zNDRWOC4yNzJDMTUuODgyIDcuNzQ0IDE1LjcxOCA3LjIzMiAxNS40MSA2LjgxNkwxMy4zNzIgNC4wNzJDMTMuMDkgMy42OTUgMTIuNjk3NCAzLjQzNCAxMi4yNjQgMy40MzRaIiBmaWxsPSIjMThFMjk5Ii8+PC9zdmc+&labelColor=transparent&color=transparent"
    alt="Sponsored by Mintlify OSS Program"
  />
</p>

> Want to sponsor motionwind? [Open an issue](https://github.com/piyushzingade/motionwind/issues/new)
> and get listed here — every sponsor keeps this project free.

## License

MIT
