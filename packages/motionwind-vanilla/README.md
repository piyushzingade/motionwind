# motionwind-vanilla

Write Motion animations as Tailwind-like classes in **plain HTML/JS** — no framework. It scans
the DOM for `animate-*` classes and wires them up with the [Motion](https://motion.dev) vanilla API.

## npm

```bash
npm install motionwind-vanilla motion
```

```js
import { motionwind } from "motionwind-vanilla";
const stop = motionwind(); // scans document, returns a cleanup fn
```

## CDN (zero build)

```html
<script src="https://unpkg.com/motionwind-vanilla"></script>
<!-- auto-initializes on load; window.motionwind() to re-scan -->

<button class="animate-hover:scale-110 animate-tap:scale-90 animate-spring">Click me</button>
```

## Supported

initial/enter, hover, tap, focus, in-view, and scroll-linked (`animate-scroll:*`) — using the same
`animate-*` syntax as the rest of motionwind.

> Drag, layout, exit, and variant *propagation* are React/Vue-only (they need a component runtime).
