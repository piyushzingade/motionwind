# motionwind-react v2

Compile Motion animations from Tailwind-like `animate-*` classes in React,
Vite, and Next.js. Static JSX uses the build-time path; `mw.*` is the explicit
runtime fallback for dynamic classes.

```bash
npm install motionwind-react@2 motion motionwind-core@2
```

```tsx
<button className="animate-hover:scale-110 animate-tap:scale-90 animate-focus:scale-105 animate-spring">
  Save
</button>
```

## Vite

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { motionwind } from "motionwind-react/vite";
import config from "./motionwind.config";

export default defineConfig({ plugins: [motionwind(config), react()] });
```

## Next.js

```ts
import withMotionwind from "motionwind-react/next";
import config from "./motionwind.config";

export default withMotionwind({}, config);
```

The wrapper supports webpack and Turbopack. A transformed App Router file gets
the client directive and Motion import it requires, so isolate animated UI when
you want to keep a larger server component boundary.

## Configuration and runtime components

```ts
import { defineConfig } from "motionwind-core";

export default defineConfig({
  adapter: "react",
  strict: true,
  reducedMotion: "user",
  tokens: { durations: { fast: 160 } },
});
```

```tsx
import { MotionwindProvider, mw } from "motionwind-react";

const MotionButton = mw.create(Button);

<MotionwindProvider config={config}>
  <mw.div className={`animate-enter:opacity-${ready ? "100" : "0"}`} />
  <MotionButton className="animate-tap:scale-95" />
</MotionwindProvider>;
```

`mw.create(Component)` expects the component to forward its ref and DOM props.
Exit classes require Motion's `AnimatePresence`. Use direct Motion APIs for
imperative timelines and advanced orchestration.

Full v2 docs and the compatibility matrix: https://motionwind.xyz/docs

MIT
