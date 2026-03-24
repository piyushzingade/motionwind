import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from "react-native-reanimated";
import { DemoCard } from "./DemoCard";
import { useTheme } from "../theme";

function PulsingCircle() {
  const { colors } = useTheme();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    scale.value = withRepeat(withTiming(1.3, { duration: 1000, easing: Easing.inOut(Easing.cubic) }), -1, true);
    opacity.value = withRepeat(withTiming(0.2, { duration: 1000, easing: Easing.inOut(Easing.cubic) }), -1, true);
  }, []);

  const outerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={styles.pulseContainer}>
      <Animated.View style={[styles.pulseOuter, { backgroundColor: colors.accent }, outerStyle]} />
      <View style={[styles.pulseInner, { backgroundColor: colors.accent }]}>
        <Text style={styles.pulseIcon}>🔔</Text>
      </View>
    </View>
  );
}

function SpinningLoader() {
  const { colors } = useTheme();
  const rotate = useSharedValue(0);

  useEffect(() => {
    rotate.value = withRepeat(withTiming(360, { duration: 1200, easing: Easing.linear }), -1, false);
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value}deg` }],
  }));

  return (
    <View style={styles.spinContainer}>
      <Animated.View style={[styles.spinner, { borderColor: colors.borderSubtle, borderTopColor: colors.accent }, style]}>
        <View style={[styles.spinnerDot, { backgroundColor: colors.accent }]} />
      </Animated.View>
      <Text style={[styles.miniLabel, { color: colors.fgMuted }]}>Spin</Text>
    </View>
  );
}

function BreathingBox() {
  const { colors } = useTheme();
  const scale = useSharedValue(1);
  const borderRadius = useSharedValue(16);

  useEffect(() => {
    scale.value = withRepeat(withSequence(withTiming(1.15, { duration: 1500, easing: Easing.inOut(Easing.cubic) }), withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.cubic) })), -1, false);
    borderRadius.value = withRepeat(withSequence(withTiming(28, { duration: 1500, easing: Easing.inOut(Easing.cubic) }), withTiming(16, { duration: 1500, easing: Easing.inOut(Easing.cubic) })), -1, false);
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    borderRadius: borderRadius.value,
  }));

  return (
    <View style={styles.breathContainer}>
      <Animated.View style={[styles.breathBox, { backgroundColor: colors.accent, opacity: 0.8 }, style]} />
      <Text style={[styles.miniLabel, { color: colors.fgMuted }]}>Breathe</Text>
    </View>
  );
}

function ShakeAnimation() {
  const { colors } = useTheme();
  const translateX = useSharedValue(0);

  useEffect(() => {
    const shake = () => {
      translateX.value = withSequence(
        withTiming(-8, { duration: 50 }), withTiming(8, { duration: 50 }),
        withTiming(-6, { duration: 50 }), withTiming(6, { duration: 50 }),
        withTiming(-3, { duration: 50 }), withTiming(0, { duration: 50 }),
      );
    };
    shake();
    const interval = setInterval(shake, 3000);
    return () => clearInterval(interval);
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={styles.shakeContainer}>
      <Animated.View style={[styles.shakeBox, { backgroundColor: "#ef4444" }, style]}>
        <Text style={styles.shakeIcon}>⚠️</Text>
      </Animated.View>
      <Text style={[styles.miniLabel, { color: colors.fgMuted }]}>Shake</Text>
    </View>
  );
}

export function RepeatAnimations() {
  return (
    <DemoCard title="Looping & Repeat" subtitle="animate-repeat-infinite animate-repeat-reverse">
      <View style={styles.grid}>
        <PulsingCircle />
        <SpinningLoader />
        <BreathingBox />
        <ShakeAnimation />
      </View>
    </DemoCard>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", gap: 20, alignItems: "center", justifyContent: "center", flexWrap: "wrap" },
  pulseContainer: { width: 60, height: 60, alignItems: "center", justifyContent: "center" },
  pulseOuter: { position: "absolute", width: 56, height: 56, borderRadius: 28 },
  pulseInner: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  pulseIcon: { fontSize: 18 },
  spinContainer: { alignItems: "center", gap: 8 },
  spinner: { width: 36, height: 36, borderRadius: 18, borderWidth: 3, justifyContent: "flex-start", alignItems: "center" },
  spinnerDot: { width: 6, height: 6, borderRadius: 3, marginTop: -3 },
  breathContainer: { alignItems: "center", gap: 8 },
  breathBox: { width: 44, height: 44, borderRadius: 16 },
  shakeContainer: { alignItems: "center", gap: 8 },
  shakeBox: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  shakeIcon: { fontSize: 20 },
  miniLabel: { fontSize: 10, fontWeight: "500" },
});
