import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { DemoCard } from "./DemoCard";
import { useTheme } from "../theme";

function DraggableBox({
  label,
  color,
  snapBack,
  axis,
}: {
  label: string;
  color: string;
  snapBack?: boolean;
  axis?: "x" | "y";
}) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const pan = Gesture.Pan()
    .onStart(() => { scale.value = withSpring(1.1, { damping: 15 }); })
    .onUpdate((e) => {
      if (axis !== "y") translateX.value = e.translationX;
      if (axis !== "x") translateY.value = e.translationY;
    })
    .onEnd(() => {
      scale.value = withSpring(1, { damping: 15 });
      if (snapBack) {
        translateX.value = withSpring(0, { damping: 12, stiffness: 200 });
        translateY.value = withSpring(0, { damping: 12, stiffness: 200 });
      }
    });
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.dragBox, { backgroundColor: color }, animatedStyle]}>
        <Text style={styles.dragText}>{label}</Text>
      </Animated.View>
    </GestureDetector>
  );
}

function ElasticDrag() {
  const { colors } = useTheme();
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const borderRadius = useSharedValue(30);
  const pan = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX * 0.5;
      translateY.value = e.translationY * 0.5;
      const dist = Math.sqrt(e.translationX ** 2 + e.translationY ** 2);
      borderRadius.value = Math.max(10, 30 - dist * 0.1);
    })
    .onEnd(() => {
      translateX.value = withSpring(0, { damping: 8, stiffness: 300 });
      translateY.value = withSpring(0, { damping: 8, stiffness: 300 });
      borderRadius.value = withSpring(30, { damping: 8 });
    });
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
    borderRadius: borderRadius.value,
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.dragBox, { backgroundColor: colors.accent }, animatedStyle]}>
        <Text style={[styles.dragText, { color: colors.accentFg }]}>Elastic</Text>
      </Animated.View>
    </GestureDetector>
  );
}

export function DragAnimations() {
  return (
    <DemoCard title="Drag Interactions" subtitle="animate-drag-both animate-drag-snap">
      <View style={styles.dragArea}>
        <DraggableBox label="Free Drag" color="#6366f1" />
        <DraggableBox label="Snap Back" color="#0ea5e9" snapBack />
        <DraggableBox label="X Only" color="#10b981" snapBack axis="x" />
        <ElasticDrag />
      </View>
    </DemoCard>
  );
}

const styles = StyleSheet.create({
  dragArea: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center",
    minHeight: 120,
    width: "100%",
  },
  dragBox: {
    width: 72,
    height: 72,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  dragText: { color: "#fff", fontSize: 10, fontWeight: "600", textAlign: "center" },
});
