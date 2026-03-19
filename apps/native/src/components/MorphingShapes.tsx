import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
  interpolateColor,
  Easing,
} from "react-native-reanimated";
import { DemoCard } from "./DemoCard";
import { useTheme } from "../theme";

/**
 * Advanced: Morphing shapes that transition between geometric forms
 * with coordinated color, size, rotation, and border-radius changes.
 * Demonstrates complex multi-property spring orchestration.
 */

const SHAPES = [
  { radius: 8, rotation: 0, scale: 1, color: 0 },       // Square
  { radius: 50, rotation: 0, scale: 0.85, color: 1 },    // Circle
  { radius: 8, rotation: 45, scale: 1.1, color: 2 },     // Diamond
  { radius: 24, rotation: 0, scale: 0.9, color: 3 },     // Squircle
];

function MorphShape({ index, trigger }: { index: number; trigger: number }) {
  const { colors } = useTheme();
  const shapeColors = [colors.accent, "#0ea5e9", "#f43f5e", "#f59e0b"];

  const borderRadius = useSharedValue(8);
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const colorProgress = useSharedValue(0);
  const glowOpacity = useSharedValue(0);

  useEffect(() => {
    const shape = SHAPES[trigger % SHAPES.length]!;
    const spring = { damping: 12, stiffness: 180, mass: 0.8 };

    borderRadius.value = withDelay(
      index * 80,
      withSpring(shape.radius, spring),
    );
    rotation.value = withDelay(
      index * 80,
      withSpring(shape.rotation + trigger * 90, spring),
    );
    scale.value = withDelay(
      index * 80,
      withSpring(shape.scale, spring),
    );
    colorProgress.value = withDelay(
      index * 80,
      withTiming(trigger % SHAPES.length, {
        duration: 500,
        easing: Easing.out(Easing.cubic),
      }),
    );
    // Glow pulse on morph
    glowOpacity.value = withDelay(
      index * 80,
      withSequence(
        withTiming(0.6, { duration: 150 }),
        withTiming(0, { duration: 400 }),
      ),
    );
  }, [trigger]);

  const shapeStyle = useAnimatedStyle(() => ({
    borderRadius: borderRadius.value,
    transform: [
      { rotate: `${rotation.value}deg` },
      { scale: scale.value },
    ],
    backgroundColor: interpolateColor(
      colorProgress.value,
      [0, 1, 2, 3],
      shapeColors,
    ),
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    borderRadius: borderRadius.value + 8,
    backgroundColor: interpolateColor(
      colorProgress.value,
      [0, 1, 2, 3],
      shapeColors,
    ),
  }));

  return (
    <View style={styles.shapeWrap}>
      <Animated.View style={[styles.glow, glowStyle]} />
      <Animated.View style={[styles.shape, shapeStyle]} />
    </View>
  );
}

export function MorphingShapes() {
  const [trigger, setTrigger] = useState(0);
  const { colors } = useTheme();
  const shapeName = ["Square", "Circle", "Diamond", "Squircle"][trigger % 4];

  return (
    <DemoCard
      title="Morphing Shapes"
      subtitle="Multi-property spring orchestration with staggered delay"
    >
      <Pressable
        style={[styles.morphBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
        onPress={() => setTrigger((t) => t + 1)}
      >
        <Text style={[styles.morphBtnText, { color: colors.accent }]}>
          Morph → {SHAPES[(trigger + 1) % 4] && ["Circle", "Diamond", "Squircle", "Square"][(trigger) % 4]}
        </Text>
      </Pressable>

      <View style={styles.shapesRow}>
        {[0, 1, 2, 3, 4].map((i) => (
          <MorphShape key={i} index={i} trigger={trigger} />
        ))}
      </View>

      <Text style={[styles.currentLabel, { color: colors.fgMuted }]}>
        Current: {shapeName}
      </Text>
    </DemoCard>
  );
}

const styles = StyleSheet.create({
  shapesRow: {
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  shapeWrap: {
    width: 52,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  shape: {
    width: 40,
    height: 40,
  },
  glow: {
    position: "absolute",
    width: 56,
    height: 56,
  },
  morphBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 16,
    alignSelf: "center",
    borderWidth: 1,
  },
  morphBtnText: {
    fontSize: 14,
    fontWeight: "600",
  },
  currentLabel: {
    marginTop: 12,
    fontSize: 12,
    fontWeight: "500",
  },
});
