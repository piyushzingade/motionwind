import {
  defineMotionwindAdapter,
  type AdapterCapabilities,
  type ParsedResult,
} from "motionwind-core";

export const REACT_CAPABILITIES: AdapterCapabilities = {
  gestures: true,
  scroll: true,
  layout: true,
  drag: true,
  variants: true,
  svg: true,
  "reduced-motion": true,
};

export const reactAdapter = defineMotionwindAdapter({
  name: "motionwind-react",
  version: "2.0.0",
  capabilities: REACT_CAPABILITIES,
  compile(parsed: ParsedResult) {
    return parsed;
  },
});
