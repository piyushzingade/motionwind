import { useRef, useState, useCallback } from "react";
import { type LayoutChangeEvent, Dimensions } from "react-native";
import type { ViewportConfig } from "./types.js";

const SCREEN_HEIGHT = Dimensions.get("window").height;

/**
 * Simple viewport detection for React Native.
 *
 * Uses onLayout to detect when an element is within the visible viewport.
 * This is a simplified version — for production use, consider integrating
 * with a ScrollView's onScroll for real-time tracking.
 */
export function useInView(config: ViewportConfig) {
  const [isInView, setIsInView] = useState(false);
  const hasBeenInView = useRef(false);
  const viewRef = useRef<any>(null);

  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { y, height } = event.nativeEvent.layout;
      const margin = config.margin ?? 0;

      // Check if the element is within the viewport
      const elementTop = y - margin;
      const elementBottom = y + height + margin;
      const viewportHeight = SCREEN_HEIGHT;

      const isVisible = elementTop < viewportHeight && elementBottom > 0;

      if (isVisible && !hasBeenInView.current) {
        setIsInView(true);
        if (config.once) {
          hasBeenInView.current = true;
        }
      } else if (!isVisible && !config.once) {
        setIsInView(false);
      }
    },
    [config.margin, config.once],
  );

  return { isInView, onLayout, viewRef };
}
