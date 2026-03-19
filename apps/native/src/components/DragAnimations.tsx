import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { DemoCard } from "./DemoCard";

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
    .onStart(() => {
      scale.value = withSpring(1.1, { damping: 15 });
    })
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
      <Animated.View
        style={[styles.dragBox, { backgroundColor: color }, animatedStyle]}
      >
        <Text style={styles.dragText}>{label}</Text>
      </Animated.View>
    </GestureDetector>
  );
}

function ElasticDrag() {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const borderRadius = useSharedValue(30);

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX * 0.5; // elastic resistance
      translateY.value = e.translationY * 0.5;
      const dist = Math.sqrt(
        e.translationX * e.translationX + e.translationY * e.translationY,
      );
      borderRadius.value = Math.max(10, 30 - dist * 0.1);
    })
    .onEnd(() => {
      translateX.value = withSpring(0, { damping: 8, stiffness: 300 });
      translateY.value = withSpring(0, { damping: 8, stiffness: 300 });
      borderRadius.value = withSpring(30, { damping: 8 });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
    borderRadius: borderRadius.value,
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.elasticBox, animatedStyle]}>
        <Text style={styles.dragText}>Elastic</Text>
      </Animated.View>
    </GestureDetector>
  );
}

export function DragAnimations() {
  return (
    <DemoCard
      title="Drag Interactions"
      subtitle="animate-drag-both animate-drag-snap animate-drag-elastic-50"
    >
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
  elasticBox: {
    width: 72,
    height: 72,
    backgroundColor: "#f43f5e",
    alignItems: "center",
    justifyContent: "center",
  },
  dragText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
    textAlign: "center",
  },
});
