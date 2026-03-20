import React from "react";
import { Text, View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { DemoCard } from "./DemoCard";
import { useTheme } from "../theme";

function ScaleButton({ label, color }: { label: string; color: string }) {
  const scale = useSharedValue(1);
  const gesture = Gesture.Tap()
    .onBegin(() => {
      scale.value = withSpring(0.92, { damping: 15, stiffness: 400 });
    })
    .onFinalize(() => {
      scale.value = withSpring(1, { damping: 15, stiffness: 400 });
    });
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.tapBox, { backgroundColor: color }, animatedStyle]}>
        <Text style={styles.tapText}>{label}</Text>
      </Animated.View>
    </GestureDetector>
  );
}

function RotateButton() {
  const { colors } = useTheme();
  const rotate = useSharedValue(0);
  const scale = useSharedValue(1);
  const gesture = Gesture.Tap()
    .onBegin(() => {
      rotate.value = withSpring(15, { damping: 10 });
      scale.value = withSpring(0.95, { damping: 15 });
    })
    .onFinalize(() => {
      rotate.value = withSpring(0, { damping: 10 });
      scale.value = withSpring(1, { damping: 15 });
    });
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value}deg` }, { scale: scale.value }],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.tapBox, { backgroundColor: colors.accent }, animatedStyle]}>
        <Text style={[styles.tapText, { color: colors.accentFg }]}>Rotate + Scale</Text>
      </Animated.View>
    </GestureDetector>
  );
}

function OpacityPulse() {
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);
  const gesture = Gesture.Tap()
    .onBegin(() => {
      opacity.value = withTiming(0.5, { duration: 100 });
      scale.value = withSpring(1.1, { damping: 12 });
    })
    .onFinalize(() => {
      opacity.value = withTiming(1, { duration: 200 });
      scale.value = withSpring(1, { damping: 12 });
    });
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.tapBox, { backgroundColor: "#ef4444" }, animatedStyle]}>
        <Text style={styles.tapText}>Opacity Pulse</Text>
      </Animated.View>
    </GestureDetector>
  );
}

export function TapAnimations() {
  const { colors } = useTheme();
  return (
    <DemoCard title="Tap / Press Animations" subtitle="animate-tap:scale-95 animate-spring">
      <View style={styles.row}>
        <ScaleButton label="Scale Down" color="#0ea5e9" />
        <ScaleButton label="Bounce" color="#14b8a6" />
      </View>
      <View style={[styles.row, { marginTop: 10 }]}>
        <RotateButton />
        <OpacityPulse />
      </View>
    </DemoCard>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 10 },
  tapBox: {
    width: 130,
    height: 64,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  tapText: { color: "#fff", fontSize: 12, fontWeight: "600" },
});
