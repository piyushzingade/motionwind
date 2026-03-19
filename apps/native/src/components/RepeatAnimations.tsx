import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withSpring,
  Easing,
} from "react-native-reanimated";
import { DemoCard } from "./DemoCard";

function PulsingCircle() {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.3, { duration: 1000, easing: Easing.inOut(Easing.cubic) }),
      -1,
      true,
    );
    opacity.value = withRepeat(
      withTiming(0.2, { duration: 1000, easing: Easing.inOut(Easing.cubic) }),
      -1,
      true,
    );
  }, []);

  const outerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={styles.pulseContainer}>
      <Animated.View style={[styles.pulseOuter, outerStyle]} />
      <View style={styles.pulseInner}>
        <Text style={styles.pulseIcon}>🔔</Text>
      </View>
    </View>
  );
}

function SpinningLoader() {
  const rotate = useSharedValue(0);

  useEffect(() => {
    rotate.value = withRepeat(
      withTiming(360, { duration: 1200, easing: Easing.linear }),
      -1,
      false,
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value}deg` }],
  }));

  return (
    <View style={styles.spinContainer}>
      <Animated.View style={[styles.spinner, style]}>
        <View style={styles.spinnerDot} />
      </Animated.View>
      <Text style={styles.miniLabel}>Infinite Spin</Text>
    </View>
  );
}

function BreathingBox() {
  const scale = useSharedValue(1);
  const borderRadius = useSharedValue(16);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 1500, easing: Easing.inOut(Easing.cubic) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.cubic) }),
      ),
      -1,
      false,
    );
    borderRadius.value = withRepeat(
      withSequence(
        withTiming(28, { duration: 1500, easing: Easing.inOut(Easing.cubic) }),
        withTiming(16, { duration: 1500, easing: Easing.inOut(Easing.cubic) }),
      ),
      -1,
      false,
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    borderRadius: borderRadius.value,
  }));

  return (
    <View style={styles.breathContainer}>
      <Animated.View style={[styles.breathBox, style]} />
      <Text style={styles.miniLabel}>Breathing</Text>
    </View>
  );
}

function ShakeAnimation() {
  const translateX = useSharedValue(0);

  useEffect(() => {
    const shake = () => {
      translateX.value = withSequence(
        withTiming(-8, { duration: 50 }),
        withTiming(8, { duration: 50 }),
        withTiming(-6, { duration: 50 }),
        withTiming(6, { duration: 50 }),
        withTiming(-3, { duration: 50 }),
        withTiming(0, { duration: 50 }),
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
      <Animated.View style={[styles.shakeBox, style]}>
        <Text style={styles.shakeIcon}>⚠️</Text>
      </Animated.View>
      <Text style={styles.miniLabel}>Shake</Text>
    </View>
  );
}

export function RepeatAnimations() {
  return (
    <DemoCard
      title="Looping & Repeat"
      subtitle="animate-repeat-infinite animate-repeat-reverse"
    >
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
  grid: {
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  pulseContainer: {
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  pulseOuter: {
    position: "absolute",
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#f59e0b",
  },
  pulseInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f59e0b",
    alignItems: "center",
    justifyContent: "center",
  },
  pulseIcon: {
    fontSize: 18,
  },
  spinContainer: {
    alignItems: "center",
    gap: 8,
  },
  spinner: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: "rgba(99, 102, 241, 0.2)",
    borderTopColor: "#6366f1",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  spinnerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#6366f1",
    marginTop: -3,
  },
  breathContainer: {
    alignItems: "center",
    gap: 8,
  },
  breathBox: {
    width: 44,
    height: 44,
    backgroundColor: "#10b981",
    borderRadius: 16,
  },
  shakeContainer: {
    alignItems: "center",
    gap: 8,
  },
  shakeBox: {
    width: 44,
    height: 44,
    backgroundColor: "#ef4444",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  shakeIcon: {
    fontSize: 20,
  },
  miniLabel: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 10,
    fontWeight: "500",
  },
});
