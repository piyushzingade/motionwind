import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  withSequence,
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeInLeft,
  FadeInRight,
  SlideInDown,
  SlideInLeft,
  SlideInRight,
  ZoomIn,
  BounceIn,
  FlipInXUp,
  LightSpeedInLeft,
} from "react-native-reanimated";
import { DemoCard } from "./DemoCard";

function AnimatedBox({
  label,
  entering,
  color,
}: {
  label: string;
  entering: any;
  color: string;
}) {
  return (
    <Animated.View
      entering={entering}
      style={[styles.box, { backgroundColor: color }]}
    >
      <Text style={styles.boxText}>{label}</Text>
    </Animated.View>
  );
}

export function EntranceAnimations() {
  const [key, setKey] = useState(0);

  return (
    <DemoCard
      title="Entrance Animations"
      subtitle="animate-enter:opacity-0 animate-enter:y-20"
    >
      <Pressable style={styles.replayBtn} onPress={() => setKey((k) => k + 1)}>
        <Text style={styles.replayText}>Replay</Text>
      </Pressable>

      <View style={styles.grid} key={key}>
        <AnimatedBox
          label="Fade In"
          entering={FadeIn.duration(600)}
          color="#6366f1"
        />
        <AnimatedBox
          label="Fade Up"
          entering={FadeInUp.duration(600).delay(100)}
          color="#8b5cf6"
        />
        <AnimatedBox
          label="Fade Down"
          entering={FadeInDown.duration(600).delay(200)}
          color="#a78bfa"
        />
        <AnimatedBox
          label="Slide Left"
          entering={FadeInLeft.duration(600).delay(300)}
          color="#c084fc"
        />
        <AnimatedBox
          label="Zoom In"
          entering={ZoomIn.duration(500).delay(400)}
          color="#e879f9"
        />
        <AnimatedBox
          label="Bounce"
          entering={BounceIn.duration(700).delay(500)}
          color="#f472b6"
        />
      </View>
    </DemoCard>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
  },
  box: {
    width: 95,
    height: 60,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  boxText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },
  replayBtn: {
    backgroundColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 16,
    alignSelf: "center",
  },
  replayText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 13,
    fontWeight: "500",
  },
});
