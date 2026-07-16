import { defineMotionwindAdapter } from "motionwind-core";
import { buildMotionProps } from "./props.js";

export const VUE_CAPABILITIES = {
  gestures: true,
  scroll: false,
  layout: true,
  drag: true,
  variants: true,
  svg: true,
  "reduced-motion": true,
} as const;

export const vueAdapter = defineMotionwindAdapter({
  name: "motionwind-vue",
  version: "2.0.0",
  capabilities: VUE_CAPABILITIES,
  compile(parsed) {
    return {
      class: parsed.tailwindClasses || undefined,
      props: buildMotionProps(parsed),
      diagnostics: parsed.diagnostics,
    };
  },
});
