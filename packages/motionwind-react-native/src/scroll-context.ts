import { createContext, useContext } from "react";
import type { SharedValue } from "react-native-reanimated";

/**
 * Shares a scroll container's normalized progress (0→1) with descendant `mw.*`
 * elements that use `animate-scroll:*` classes. Provided by `mw.ScrollView`.
 */
export interface ScrollContextValue {
  progressX?: SharedValue<number>;
  progressY?: SharedValue<number>;
}

export const MotionwindScrollContext = createContext<ScrollContextValue>({});

export function useMotionScrollContext(): ScrollContextValue {
  return useContext(MotionwindScrollContext);
}
