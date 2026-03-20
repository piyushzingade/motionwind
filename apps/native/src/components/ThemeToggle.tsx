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
import Svg, { Path, Circle, Line } from "react-native-svg";
import { useTheme } from "../theme";

/** Lucide Sun icon as inline SVG */
function SunIcon({ size = 20, color = "#f59e0b" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="12" cy="12" r="4" />
      <Line x1="12" y1="2" x2="12" y2="4" />
      <Line x1="12" y1="20" x2="12" y2="22" />
      <Line x1="4.93" y1="4.93" x2="6.34" y2="6.34" />
      <Line x1="17.66" y1="17.66" x2="19.07" y2="19.07" />
      <Line x1="2" y1="12" x2="4" y2="12" />
      <Line x1="20" y1="12" x2="22" y2="12" />
      <Line x1="4.93" y1="19.07" x2="6.34" y2="17.66" />
      <Line x1="17.66" y1="6.34" x2="19.07" y2="4.93" />
    </Svg>
  );
}

/** Lucide Moon icon as inline SVG */
function MoonIcon({ size = 20, color = "#e2e8f0" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </Svg>
  );
}

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

  const sunStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.5], [1, 0]),
    transform: [
      { scale: interpolate(progress.value, [0, 0.5], [1, 0.5]) },
      { rotate: `${interpolate(progress.value, [0, 1], [0, -90])}deg` },
    ],
    position: "absolute" as const,
  }));

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
          <SunIcon />
        </Animated.View>
        <Animated.View style={moonStyle}>
          <MoonIcon />
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
