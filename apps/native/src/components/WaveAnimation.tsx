import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
  interpolateColor,
} from "react-native-reanimated";
import { DemoCard } from "./DemoCard";
import { useTheme } from "../theme";

const BAR_COUNT = 20;

/**
 * Advanced: Audio visualizer-style wave animation.
 * - Staggered sine-wave bars with varying heights
 * - Color gradient that shifts across the wave
 * - Continuous smooth looping
 */

function WaveBar({ index, total }: { index: number; total: number }) {
  const { colors } = useTheme();
  const height = useSharedValue(8);
  const colorProgress = useSharedValue(0);

  useEffect(() => {
    // Each bar has a different phase offset for the wave effect
    const phase = (index / total) * 600;
    const baseHeight = 8;
    const maxHeight = 40 + Math.sin((index / total) * Math.PI) * 20;

    height.value = withDelay(
      phase,
      withRepeat(
        withSequence(
          withTiming(maxHeight, {
            duration: 600 + index * 15,
            easing: Easing.inOut(Easing.cubic),
          }),
          withTiming(baseHeight, {
            duration: 600 + index * 15,
            easing: Easing.inOut(Easing.cubic),
          }),
        ),
        -1,
        false,
      ),
    );

    colorProgress.value = withDelay(
      phase,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 600 + index * 15 }),
          withTiming(0, { duration: 600 + index * 15 }),
        ),
        -1,
        false,
      ),
    );
  }, []);

  const barStyle = useAnimatedStyle(() => ({
    height: height.value,
    backgroundColor: interpolateColor(
      colorProgress.value,
      [0, 0.5, 1],
      [colors.accent, "#0ea5e9", colors.accent],
    ),
    borderRadius: 2,
  }));

  return (
    <View style={styles.barWrap}>
      <Animated.View style={[styles.bar, barStyle]} />
    </View>
  );
}

/**
 * Orbiting dots — dots that orbit around a center point
 * with different speeds and radii.
 */
function OrbitingDots() {
  const { colors } = useTheme();
  const orbits = [
    { radius: 35, duration: 3000, size: 8, delay: 0 },
    { radius: 35, duration: 3000, size: 6, delay: 1500 },
    { radius: 55, duration: 4500, size: 6, delay: 0 },
    { radius: 55, duration: 4500, size: 5, delay: 2250 },
    { radius: 20, duration: 2000, size: 5, delay: 500 },
  ];

  return (
    <View style={styles.orbitContainer}>
      {/* Orbit rings */}
      <View style={[styles.orbitRing, styles.orbitRing1, { borderColor: `${colors.border}` }]} />
      <View style={[styles.orbitRing, styles.orbitRing2, { borderColor: `${colors.border}` }]} />
      <View style={[styles.orbitRing, styles.orbitRing3, { borderColor: `${colors.border}` }]} />

      {/* Center dot */}
      <View style={[styles.centerDot, { backgroundColor: colors.accent }]} />

      {/* Orbiting dots */}
      {orbits.map((orbit, i) => (
        <OrbitDot key={i} {...orbit} color={i % 2 === 0 ? colors.accent : "#0ea5e9"} />
      ))}
    </View>
  );
}

function OrbitDot({
  radius,
  duration,
  size,
  delay,
  color,
}: {
  radius: number;
  duration: number;
  size: number;
  delay: number;
  color: string;
}) {
  const angle = useSharedValue(0);

  useEffect(() => {
    angle.value = withDelay(
      delay,
      withRepeat(
        withTiming(360, { duration, easing: Easing.linear }),
        -1,
        false,
      ),
    );
  }, []);

  const style = useAnimatedStyle(() => {
    const rad = (angle.value * Math.PI) / 180;
    return {
      transform: [
        { translateX: Math.cos(rad) * radius },
        { translateY: Math.sin(rad) * radius },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        styles.orbitDot,
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

export function WaveAnimation() {
  const { colors } = useTheme();

  return (
    <DemoCard
      title="Continuous Animations"
      subtitle="Audio wave + orbital system — animate-repeat-infinite"
    >
      {/* Wave visualizer */}
      <Text style={[styles.sectionLabel, { color: colors.fgMuted }]}>
        Audio Wave
      </Text>
      <View style={styles.waveContainer}>
        {Array.from({ length: BAR_COUNT }).map((_, i) => (
          <WaveBar key={i} index={i} total={BAR_COUNT} />
        ))}
      </View>

      {/* Orbital system */}
      <Text style={[styles.sectionLabel, { color: colors.fgMuted, marginTop: 24 }]}>
        Orbital System
      </Text>
      <OrbitingDots />
    </DemoCard>
  );
}

const styles = StyleSheet.create({
  waveContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    height: 64,
    gap: 3,
  },
  barWrap: {
    justifyContent: "flex-end",
    height: 64,
  },
  bar: {
    width: 5,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 14,
    alignSelf: "center",
  },
  orbitContainer: {
    width: 140,
    height: 140,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  orbitRing: {
    position: "absolute",
    borderWidth: 1,
    borderStyle: "dashed",
  },
  orbitRing1: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  orbitRing2: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  orbitRing3: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  centerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  orbitDot: {
    position: "absolute",
  },
});
