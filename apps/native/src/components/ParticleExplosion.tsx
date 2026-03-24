import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  withSequence,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import { DemoCard } from "./DemoCard";
import { useTheme } from "../theme";

const PARTICLE_COUNT = 12;
const RING_COUNT = 8;

/**
 * Advanced: Particle explosion + ring burst effect.
 * Demonstrates coordinated multi-element choreography:
 * - Central button squish (scale 0.85 → 1.15 → 1)
 * - Radial particle burst with random spread
 * - Expanding ring with fade
 * - Staggered color wave through particles
 */

function Particle({
  index,
  trigger,
  total,
}: {
  index: number;
  trigger: number;
  total: number;
}) {
  const { colors } = useTheme();
  const angle = (index / total) * Math.PI * 2;
  const distance = 50 + Math.random() * 30;
  const targetX = Math.cos(angle) * distance;
  const targetY = Math.sin(angle) * distance;

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (trigger === 0) return;
    const stagger = index * 20;

    // Burst outward
    translateX.value = withDelay(
      stagger,
      withTiming(targetX, { duration: 400, easing: Easing.out(Easing.cubic) }),
    );
    translateY.value = withDelay(
      stagger,
      withTiming(targetY, { duration: 400, easing: Easing.out(Easing.cubic) }),
    );
    scale.value = withDelay(
      stagger,
      withSequence(
        withTiming(1.2, { duration: 150 }),
        withTiming(0, { duration: 350 }),
      ),
    );
    opacity.value = withDelay(
      stagger,
      withSequence(
        withTiming(1, { duration: 100 }),
        withTiming(0, { duration: 400 }),
      ),
    );

    // Reset after animation
    const timeout = setTimeout(() => {
      translateX.value = 0;
      translateY.value = 0;
    }, 800);
    return () => clearTimeout(timeout);
  }, [trigger]);

  const sizes = [6, 8, 5, 7, 4, 9, 6, 5, 8, 7, 4, 6];
  const particleColors = [
    colors.accent,
    "#f43f5e",
    "#0ea5e9",
    colors.accent,
    "#f59e0b",
    "#10b981",
    colors.accent,
    "#8b5cf6",
    "#f43f5e",
    colors.accent,
    "#0ea5e9",
    "#f59e0b",
  ];
  const size = sizes[index % sizes.length]!;
  const color = particleColors[index % particleColors.length]!;

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
        style,
      ]}
    />
  );
}

function RingBurst({ trigger }: { trigger: number }) {
  const { colors } = useTheme();
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const borderWidth = useSharedValue(3);

  useEffect(() => {
    if (trigger === 0) return;
    scale.value = withSequence(
      withTiming(0, { duration: 0 }),
      withTiming(1.8, { duration: 500, easing: Easing.out(Easing.cubic) }),
    );
    opacity.value = withSequence(
      withTiming(0.8, { duration: 100 }),
      withTiming(0, { duration: 400 }),
    );
    borderWidth.value = withSequence(
      withTiming(3, { duration: 0 }),
      withTiming(0.5, { duration: 500 }),
    );
  }, [trigger]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
    borderWidth: borderWidth.value,
    borderColor: colors.accent,
  }));

  return <Animated.View style={[styles.ring, style]} />;
}

export function ParticleExplosion() {
  const [trigger, setTrigger] = useState(0);
  const { colors } = useTheme();

  const buttonScale = useSharedValue(1);
  const buttonRotate = useSharedValue(0);

  const handlePress = () => {
    setTrigger((t) => t + 1);
    buttonScale.value = withSequence(
      withTiming(0.85, { duration: 80, easing: Easing.in(Easing.cubic) }),
      withSpring(1.15, { damping: 8, stiffness: 400 }),
      withSpring(1, { damping: 15, stiffness: 300 }),
    );
    buttonRotate.value = withSpring(buttonRotate.value + 90, {
      damping: 14,
      stiffness: 200,
    });
  };

  const btnStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: buttonScale.value },
      { rotate: `${buttonRotate.value}deg` },
    ],
  }));

  return (
    <DemoCard
      title="Particle Explosion"
      subtitle="Coordinated multi-element choreography"
    >
      <View style={styles.explosionWrap}>
        {/* Ring burst */}
        <RingBurst trigger={trigger} />

        {/* Particles */}
        {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
          <Particle
            key={i}
            index={i}
            trigger={trigger}
            total={PARTICLE_COUNT}
          />
        ))}

        {/* Central button */}
        <Pressable onPress={handlePress}>
          <Animated.View
            style={[
              styles.triggerBtn,
              { backgroundColor: colors.accent },
              btnStyle,
            ]}
          >
            <Text style={[styles.triggerIcon, { color: colors.accentFg }]}>
              ✦
            </Text>
          </Animated.View>
        </Pressable>
      </View>

      <Text style={[styles.hint, { color: colors.fgMuted }]}>
        Tap the star to trigger
      </Text>
    </DemoCard>
  );
}

const styles = StyleSheet.create({
  explosionWrap: {
    width: 200,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  particle: {
    position: "absolute",
  },
  ring: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  triggerBtn: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  triggerIcon: {
    fontSize: 22,
    fontWeight: "700",
  },
  hint: {
    fontSize: 12,
    marginTop: 8,
  },
});
