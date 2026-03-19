import React from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolateColor,
} from "react-native-reanimated";
import { useTheme } from "../theme";

export function ThemeToggle() {
  const { mode, colors, toggle } = useTheme();
  const progress = useSharedValue(mode === "dark" ? 1 : 0);
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);

  const handlePress = () => {
    const next = mode === "dark" ? 0 : 1;
    progress.value = withTiming(next, { duration: 350 });
    rotate.value = withSpring(rotate.value + 180, { damping: 12, stiffness: 200 });
    scale.value = withSpring(0.85, { damping: 15 }, () => {
      scale.value = withSpring(1, { damping: 12 });
    });
    toggle();
  };

  const containerStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      ["#e4e4e0", "#1e1e2a"],
    ),
    transform: [{ scale: scale.value }],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value}deg` }],
    opacity: withTiming(1, { duration: 200 }),
  }));

  return (
    <Pressable onPress={handlePress}>
      <Animated.View style={[styles.container, containerStyle]}>
        <Animated.Text style={[styles.icon, iconStyle]}>
          {mode === "dark" ? "☀️" : "🌙"}
        </Animated.Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 18,
  },
});
