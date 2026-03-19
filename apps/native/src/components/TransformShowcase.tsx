import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { DemoCard } from "./DemoCard";
import { useTheme } from "../theme";

export function TransformShowcase() {
  const { colors } = useTheme();
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

  const scaleStyle = useAnimatedStyle(() => ({ transform: [{ scale: scaleVal.value }] }));
  const rotateStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${rotateVal.value}deg` }] }));
  const skewStyle = useAnimatedStyle(() => ({ transform: [{ skewX: `${skewVal.value}deg` }] }));
  const translateStyle = useAnimatedStyle(() => ({ transform: [{ translateX: translateXVal.value }] }));
  const opacityStyle = useAnimatedStyle(() => ({ opacity: opacityVal.value }));
  const radiusStyle = useAnimatedStyle(() => ({ borderRadius: radiusVal.value }));

  const boxes = [
    { label: "Scale", color: colors.accent, style: scaleStyle },
    { label: "Rotate", color: "#0ea5e9", style: rotateStyle },
    { label: "Skew", color: "#10b981", style: skewStyle },
    { label: "Translate", color: "#f59e0b", style: translateStyle },
    { label: "Opacity", color: "#ef4444", style: opacityStyle },
    { label: "Radius", color: "#8b5cf6", style: radiusStyle },
  ];

  return (
    <DemoCard title="Transform Properties" subtitle="scale, rotate, skew, translate, opacity, borderRadius">
      <Pressable
        style={[styles.toggleBtn, { backgroundColor: `${colors.accent}20`, borderColor: `${colors.accent}40` }]}
        onPress={toggle}
      >
        <Text style={[styles.toggleText, { color: colors.accent }]}>
          {active ? "Reset" : "Animate All"}
        </Text>
      </Pressable>
      <View style={styles.transformGrid}>
        {boxes.map((b) => (
          <View key={b.label} style={styles.transformItem}>
            <Animated.View style={[styles.transformBox, { backgroundColor: b.color }, b.style]}>
              <Text style={styles.transformText}>{b.label}</Text>
            </Animated.View>
          </View>
        ))}
      </View>
    </DemoCard>
  );
}

const styles = StyleSheet.create({
  transformGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12, justifyContent: "center" },
  transformItem: { width: 80, height: 80, alignItems: "center", justifyContent: "center" },
  transformBox: { width: 64, height: 64, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  transformText: { color: "#fff", fontSize: 10, fontWeight: "600" },
  toggleBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 16,
    alignSelf: "center",
    borderWidth: 1,
  },
  toggleText: { fontSize: 14, fontWeight: "600" },
});
