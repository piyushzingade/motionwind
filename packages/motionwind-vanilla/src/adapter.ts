import { defineMotionwindAdapter } from "motionwind-core";

export const VANILLA_CAPABILITIES = {
  gestures: true,
  scroll: true,
  layout: false,
  drag: false,
  variants: true,
  svg: true,
  "reduced-motion": true,
} as const;

export const vanillaAdapter = defineMotionwindAdapter({
  name: "motionwind-vanilla",
  version: "2.0.0",
  capabilities: VANILLA_CAPABILITIES,
  compile(parsed) {
    return parsed;
  },
});
