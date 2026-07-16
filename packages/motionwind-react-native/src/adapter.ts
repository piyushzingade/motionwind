import { defineMotionwindAdapter } from "motionwind-core";

export const REACT_NATIVE_CAPABILITIES = {
  gestures: true,
  scroll: true,
  layout: false,
  drag: false,
  variants: true,
  svg: false,
  "reduced-motion": true,
} as const;

export const reactNativeAdapter = defineMotionwindAdapter({
  name: "motionwind-react-native",
  version: "2.0.0",
  capabilities: REACT_NATIVE_CAPABILITIES,
  compile(parsed) {
    return parsed;
  },
});
