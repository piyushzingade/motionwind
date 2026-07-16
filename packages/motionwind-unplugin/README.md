# motionwind-unplugin v2

Shared React/JSX compiler integration for Vite, Rollup, webpack, Rspack, and
esbuild.

```bash
npm install -D motionwind-unplugin@2
npm install motionwind-react@2 motion motionwind-core@2
```

```ts
import motionwind from "motionwind-unplugin/vite";

export default {
  plugins: [motionwind({ config: motionwindConfig })],
};
```

Equivalent entry points are available at `/rollup`, `/webpack`, `/rspack`, and
`/esbuild`. The transform runs before JSX compilation, preserves source maps,
and accepts `{ config, include }`. Babel and the focused React Vite/Next entry
points remain supported.

MIT
