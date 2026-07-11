# eslint-plugin-motionwind

ESLint rules for [motionwind](https://github.com/piyushzingade/motionwind) animation classes.

## Install

```bash
npm install -D eslint-plugin-motionwind
```

## Usage (flat config)

```js
// eslint.config.js
import motionwind from "eslint-plugin-motionwind";

export default [motionwind.configs.recommended];
```

## Rules

| Rule | Description |
|---|---|
| `motionwind/no-unknown-classes` | Flags `animate-*` classes the parser doesn't recognize. |
| `motionwind/no-duplicate-gesture-props` | Flags a property set more than once within one gesture/variant. |
| `motionwind/prefer-mw-for-dynamic` | Flags `animate-*` in a dynamic className on a host element (use `mw.*`). |
| `motionwind/exit-requires-presence` | Flags `animate-exit:*` used without importing `AnimatePresence`. |

All rules are `warn` in the recommended config and reuse motionwind's own parser, so
they never drift from what the Babel plugin actually compiles.
