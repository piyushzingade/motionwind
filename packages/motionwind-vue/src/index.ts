import type { App } from "vue";
import { Motionwind, motionwindConfigKey } from "./component.js";
import type { MotionwindConfig } from "motionwind-core";

export { Motionwind, mw } from "./component.js";
export { buildMotionProps, stripInteractive } from "./props.js";
export { vueAdapter, VUE_CAPABILITIES } from "./adapter.js";

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
  install(app: App, config: MotionwindConfig = {}) {
    app.component("Motionwind", Motionwind);
    app.provide(motionwindConfigKey, config);
  },
};

// Re-export the parser so Vue users can analyze classes without a second dep.
export {
  parseMotionClasses,
  defineConfig,
  definePreset,
  defineMotionwindPlugin,
  MOTIONWIND_RECIPES,
  type ParsedResult,
  type MotionwindConfig,
} from "motionwind-core";

/**
 * Composable for advanced/render-function usage: parse a className into the
 * Motion-for-Vue props to spread onto a `motion.*` component.
 */
import { parseMotionClasses as parse } from "motionwind-core";
import { buildMotionProps as build } from "./props.js";

export function useMotionwind(
  className: string,
  config?: import("motionwind-core").MotionwindConfig,
) {
  const parsed = parse(className, config);
  return {
    parsed,
    tailwindClasses: parsed.tailwindClasses,
    motionProps: build(parsed),
    hasMotion: parsed.hasMotion,
  };
}
