import React, { useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  interpolateColor,
  Easing,
} from "react-native-reanimated";
import { Sun, Moon } from "lucide-react-native";
import { useTheme } from "../theme";

export function ThemeToggle() {
  const { mode, colors, toggle } = useTheme();
  const progress = useSharedValue(mode === "dark" ? 1 : 0);
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(mode === "dark" ? 1 : 0, {
      duration: 350,
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

  // Sun: visible in light mode
  const sunStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.5], [1, 0]),
    transform: [
      { scale: interpolate(progress.value, [0, 0.5], [1, 0.5]) },
      { rotate: `${interpolate(progress.value, [0, 1], [0, -90])}deg` },
    ],
    position: "absolute" as const,
  }));

  // Moon: visible in dark mode
  const moonStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0.5, 1], [0, 1]),
    transform: [
      { scale: interpolate(progress.value, [0.5, 1], [0.5, 1]) },
      { rotate: `${interpolate(progress.value, [0, 1], [90, 0])}deg` },
    ],
    position: "absolute" as const,
  }));

  return (
    <Pressable onPress={handlePress} hitSlop={8}>
      <Animated.View style={[styles.container, containerStyle]}>
        <Animated.View style={sunStyle}>
          <Sun size={20} color="#f59e0b" strokeWidth={2.2} />
        </Animated.View>
        <Animated.View style={moonStyle}>
          <Moon size={20} color="#e2e8f0" strokeWidth={2.2} />
        </Animated.View>
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
  },
});
