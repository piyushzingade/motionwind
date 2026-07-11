import type { App } from "vue";
import { Motionwind } from "./component.js";

export { Motionwind, mw } from "./component.js";
export { buildMotionProps, stripInteractive } from "./props.js";

/**
 * Vue plugin that globally registers `<Motionwind>`. Use with the
 * `motionwind-vue/vite` compiler transform so plain `<button class="animate-*">`
 * elements work without per-file imports.
 *
 * ```ts
 * import { MotionwindPlugin } from "motionwind-vue";
 * createApp(App).use(MotionwindPlugin).mount("#app");
 * ```
 */
export const MotionwindPlugin = {
  install(app: App) {
    app.component("Motionwind", Motionwind);
  },
};

// Re-export the parser so Vue users can analyze classes without a second dep.
export {
  parseMotionClasses,
  type ParsedResult,
} from "motionwind-core";

/**
 * Composable for advanced/render-function usage: parse a className into the
 * Motion-for-Vue props to spread onto a `motion.*` component.
 */
import { parseMotionClasses as parse } from "motionwind-core";
import { buildMotionProps as build } from "./props.js";

export function useMotionwind(className: string) {
  const parsed = parse(className);
  return {
    parsed,
    tailwindClasses: parsed.tailwindClasses,
    motionProps: build(parsed),
    hasMotion: parsed.hasMotion,
  };
}
