# motionwind-vanilla v2

Use Motionwind classes in plain browser HTML and JavaScript through Motion's DOM
runtime.

```bash
npm install motionwind-vanilla@2 motion motionwind-core@2
```

```js
import { motionwind } from "motionwind-vanilla";
import config from "./motionwind.config";

const stop = motionwind({
  config,
  observe: true,
  respectReducedMotion: true,
});
```

The cleanup function removes listeners and observers. Options also include a
custom `root` and `selector`.

```html
<script src="https://unpkg.com/motionwind-vanilla@2"></script>
<button
  class="animate-hover:scale-110 animate-tap:scale-90 animate-focus:scale-105"
>
  Save
</button>
```

V2 supports initial/enter, hover, tap, focus, in-view, scroll-linked values,
SVG paths, and reduced motion. Drag, layout projection, exit orchestration, and
variant propagation require a component runtime and produce adapter warnings.

Compatibility: https://motionwind.xyz/docs/compatibility

MIT
