import React, { useEffect } from "react";
import { Pressable, View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  interpolateColor,
  Easing,
} from "react-native-reanimated";
import { useTheme } from "../theme";

/**
 * Animated sun/moon toggle.
 * Sun: circle with radiating lines. Moon: circle with a cutout crescent.
 * Morphs between states with spring rotation + scale squish.
 */
export function ThemeToggle() {
  const { mode, colors, toggle } = useTheme();
  const progress = useSharedValue(mode === "dark" ? 1 : 0);
  const scale = useSharedValue(1);
  const rotate = useSharedValue(mode === "dark" ? 0 : 0);

  useEffect(() => {
    progress.value = withTiming(mode === "dark" ? 1 : 0, {
      duration: 400,
      easing: Easing.out(Easing.cubic),
    });
  }, [mode]);

  const handlePress = () => {
    rotate.value = withSpring(rotate.value + 360, {
      damping: 14,
      stiffness: 160,
    });
    scale.value = withSpring(0.8, { damping: 20, stiffness: 400 }, () => {
      scale.value = withSpring(1, { damping: 10, stiffness: 300 });
    });
    toggle();
  };

  const containerStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      ["#e4e4e0", "#1e1e2a"],
    ),
    transform: [
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  // Sun rays: visible when light mode (progress → 0)
  const raysOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.3], [1, 0]),
    transform: [
      { scale: interpolate(progress.value, [0, 0.5], [1, 0.3]) },
    ],
  }));

  // Moon crescent mask: visible when dark mode (progress → 1)
  const crescentStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0.5, 1], [0, 1]),
    transform: [
      {
        translateX: interpolate(progress.value, [0.5, 1], [8, 0]),
      },
    ],
  }));

  // Core circle color
  const coreStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      ["#f59e0b", "#e2e8f0"],
    ),
  }));

  return (
    <Pressable onPress={handlePress} hitSlop={8}>
      <Animated.View style={[styles.container, containerStyle]}>
        {/* Sun rays */}
        <Animated.View style={[styles.raysWrap, raysOpacity]}>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <View
              key={deg}
              style={[
                styles.ray,
                {
                  transform: [
                    { rotate: `${deg}deg` },
                    { translateY: -13 },
                  ],
                },
              ]}
            >
              <View style={styles.rayLine} />
            </View>
          ))}
        </Animated.View>

        {/* Core circle */}
        <Animated.View style={[styles.core, coreStyle]} />

        {/* Moon crescent cutout */}
        <Animated.View style={[styles.crescent, crescentStyle]} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  raysWrap: {
    position: "absolute",
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  ray: {
    position: "absolute",
    alignItems: "center",
  },
  rayLine: {
    width: 2,
    height: 4,
    borderRadius: 1,
    backgroundColor: "#f59e0b",
  },
  core: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  crescent: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#1e1e2a",
    top: 11,
    right: 10,
  },
});
