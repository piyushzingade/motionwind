import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { DemoCard } from "./DemoCard";

function TransformBox({
  label,
  color,
  onAnimate,
}: {
  label: string;
  color: string;
  onAnimate: () => ReturnType<typeof useAnimatedStyle>;
}) {
  return (
    <Animated.View style={[styles.transformBox, { backgroundColor: color }, onAnimate()]}>
      <Text style={styles.transformText}>{label}</Text>
    </Animated.View>
  );
}

export function TransformShowcase() {
  const [active, setActive] = useState(false);

  const scaleVal = useSharedValue(1);
  const rotateVal = useSharedValue(0);
  const skewVal = useSharedValue(0);
  const translateXVal = useSharedValue(0);
  const opacityVal = useSharedValue(1);
  const radiusVal = useSharedValue(12);

  const toggle = () => {
    const next = !active;
    setActive(next);

    const spring = { damping: 12, stiffness: 200 };
    scaleVal.value = withSpring(next ? 1.3 : 1, spring);
    rotateVal.value = withSpring(next ? 45 : 0, spring);
    skewVal.value = withSpring(next ? 15 : 0, spring);
    translateXVal.value = withSpring(next ? 30 : 0, spring);
    opacityVal.value = withSpring(next ? 0.4 : 1, spring);
    radiusVal.value = withSpring(next ? 30 : 12, spring);
  };

  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleVal.value }],
  }));
  const rotateStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotateVal.value}deg` }],
  }));
  const skewStyle = useAnimatedStyle(() => ({
    transform: [{ skewX: `${skewVal.value}deg` }],
  }));
  const translateStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateXVal.value }],
  }));
  const opacityStyle = useAnimatedStyle(() => ({
    opacity: opacityVal.value,
  }));
  const radiusStyle = useAnimatedStyle(() => ({
    borderRadius: radiusVal.value,
  }));

  return (
    <DemoCard
      title="Transform Properties"
      subtitle="scale, rotate, skew, translate, opacity, borderRadius"
    >
      <Pressable style={styles.toggleBtn} onPress={toggle}>
        <Text style={styles.toggleText}>{active ? "Reset" : "Animate All"}</Text>
      </Pressable>

      <View style={styles.transformGrid}>
        <View style={styles.transformItem}>
          <Animated.View style={[styles.transformBox, { backgroundColor: "#6366f1" }, scaleStyle]}>
            <Text style={styles.transformText}>Scale</Text>
          </Animated.View>
        </View>
        <View style={styles.transformItem}>
          <Animated.View style={[styles.transformBox, { backgroundColor: "#0ea5e9" }, rotateStyle]}>
            <Text style={styles.transformText}>Rotate</Text>
          </Animated.View>
        </View>
        <View style={styles.transformItem}>
          <Animated.View style={[styles.transformBox, { backgroundColor: "#10b981" }, skewStyle]}>
            <Text style={styles.transformText}>Skew</Text>
          </Animated.View>
        </View>
        <View style={styles.transformItem}>
          <Animated.View style={[styles.transformBox, { backgroundColor: "#f59e0b" }, translateStyle]}>
            <Text style={styles.transformText}>Translate</Text>
          </Animated.View>
        </View>
        <View style={styles.transformItem}>
          <Animated.View style={[styles.transformBox, { backgroundColor: "#ef4444" }, opacityStyle]}>
            <Text style={styles.transformText}>Opacity</Text>
          </Animated.View>
        </View>
        <View style={styles.transformItem}>
          <Animated.View style={[styles.transformBox, { backgroundColor: "#8b5cf6" }, radiusStyle]}>
            <Text style={styles.transformText}>Radius</Text>
          </Animated.View>
        </View>
      </View>
    </DemoCard>
  );
}

const styles = StyleSheet.create({
  transformGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center",
  },
  transformItem: {
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  transformBox: {
    width: 64,
    height: 64,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  transformText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
  toggleBtn: {
    backgroundColor: "rgba(99, 102, 241, 0.2)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 16,
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "rgba(99, 102, 241, 0.3)",
  },
  toggleText: {
    color: "#818cf8",
    fontSize: 14,
    fontWeight: "600",
  },
});
