import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { DemoCard } from "./DemoCard";

function SpringBall({
  label,
  damping,
  stiffness,
  color,
}: {
  label: string;
  damping: number;
  stiffness: number;
  color: string;
}) {
  const translateY = useSharedValue(0);
  const [active, setActive] = useState(false);

  const toggle = () => {
    const target = active ? 0 : -40;
    translateY.value = withSpring(target, { damping, stiffness });
    setActive(!active);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Pressable onPress={toggle} style={styles.springItem}>
      <Animated.View
        style={[styles.ball, { backgroundColor: color }, animatedStyle]}
      />
      <Text style={styles.springLabel}>{label}</Text>
      <Text style={styles.springParams}>
        d:{damping} s:{stiffness}
      </Text>
    </Pressable>
  );
}

function BouncyLoader() {
  const dot1 = useSharedValue(0);
  const dot2 = useSharedValue(0);
  const dot3 = useSharedValue(0);

  useEffect(() => {
    dot1.value = withRepeat(
      withSequence(
        withTiming(-12, { duration: 300, easing: Easing.out(Easing.cubic) }),
        withTiming(0, { duration: 300, easing: Easing.in(Easing.cubic) }),
      ),
      -1,
      false,
    );
    setTimeout(() => {
      dot2.value = withRepeat(
        withSequence(
          withTiming(-12, { duration: 300, easing: Easing.out(Easing.cubic) }),
          withTiming(0, { duration: 300, easing: Easing.in(Easing.cubic) }),
        ),
        -1,
        false,
      );
    }, 100);
    setTimeout(() => {
      dot3.value = withRepeat(
        withSequence(
          withTiming(-12, { duration: 300, easing: Easing.out(Easing.cubic) }),
          withTiming(0, { duration: 300, easing: Easing.in(Easing.cubic) }),
        ),
        -1,
        false,
      );
    }, 200);
  }, []);

  const s1 = useAnimatedStyle(() => ({
    transform: [{ translateY: dot1.value }],
  }));
  const s2 = useAnimatedStyle(() => ({
    transform: [{ translateY: dot2.value }],
  }));
  const s3 = useAnimatedStyle(() => ({
    transform: [{ translateY: dot3.value }],
  }));

  return (
    <View style={styles.dotsRow}>
      <Animated.View style={[styles.dot, { backgroundColor: "#818cf8" }, s1]} />
      <Animated.View style={[styles.dot, { backgroundColor: "#a78bfa" }, s2]} />
      <Animated.View style={[styles.dot, { backgroundColor: "#c084fc" }, s3]} />
    </View>
  );
}

export function SpringAnimations() {
  return (
    <DemoCard
      title="Spring Physics"
      subtitle="animate-spring animate-stiffness-400 animate-damping-10"
    >
      <View style={styles.springs}>
        <SpringBall label="Snappy" damping={20} stiffness={500} color="#10b981" />
        <SpringBall label="Bouncy" damping={6} stiffness={300} color="#f59e0b" />
        <SpringBall label="Loose" damping={4} stiffness={100} color="#ef4444" />
        <SpringBall label="Stiff" damping={30} stiffness={800} color="#0ea5e9" />
      </View>

      <View style={styles.loaderSection}>
        <Text style={styles.loaderLabel}>Staggered Loader</Text>
        <BouncyLoader />
      </View>
    </DemoCard>
  );
}

const styles = StyleSheet.create({
  springs: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 20,
  },
  springItem: {
    alignItems: "center",
    gap: 8,
  },
  ball: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  springLabel: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },
  springParams: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 10,
  },
  loaderSection: {
    alignItems: "center",
    gap: 12,
  },
  loaderLabel: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 12,
  },
  dotsRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    height: 30,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});
