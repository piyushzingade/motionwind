import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { DemoCard } from "./DemoCard";

const EASINGS: {
  label: string;
  easing: (typeof Easing)["linear"];
  color: string;
}[] = [
  { label: "ease-out", easing: Easing.out(Easing.cubic), color: "#6366f1" },
  { label: "ease-in", easing: Easing.in(Easing.cubic), color: "#8b5cf6" },
  {
    label: "ease-in-out",
    easing: Easing.inOut(Easing.cubic),
    color: "#a78bfa",
  },
  { label: "linear", easing: Easing.linear, color: "#c084fc" },
  {
    label: "circ-out",
    easing: Easing.out(Easing.circle),
    color: "#e879f9",
  },
  {
    label: "back-out",
    easing: Easing.out(Easing.back(1.7)),
    color: "#f472b6",
  },
  {
    label: "bezier",
    easing: Easing.bezier(0.23, 1, 0.32, 1),
    color: "#fb7185",
  },
];

function EasingBar({
  label,
  easing,
  color,
  trigger,
}: {
  label: string;
  easing: any;
  color: string;
  trigger: number;
}) {
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = 0;
    setTimeout(() => {
      width.value = withTiming(1, { duration: 800, easing });
    }, 50);
  }, [trigger]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${width.value * 100}%`,
    backgroundColor: color,
  }));

  return (
    <View style={styles.easingRow}>
      <Text style={styles.easingLabel}>{label}</Text>
      <View style={styles.track}>
        <Animated.View style={[styles.bar, barStyle]} />
      </View>
    </View>
  );
}

export function EasingShowcase() {
  const [trigger, setTrigger] = useState(0);

  return (
    <DemoCard
      title="Easing Functions"
      subtitle="animate-ease-out, animate-ease-[0.23,1,0.32,1]"
    >
      <Pressable
        style={styles.replayBtn}
        onPress={() => setTrigger((t) => t + 1)}
      >
        <Text style={styles.replayText}>Replay All</Text>
      </Pressable>

      <View style={styles.easings}>
        {EASINGS.map((e) => (
          <EasingBar key={e.label} {...e} trigger={trigger} />
        ))}
      </View>
    </DemoCard>
  );
}

const styles = StyleSheet.create({
  easings: {
    width: "100%",
    gap: 8,
  },
  easingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  easingLabel: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 10,
    width: 70,
    textAlign: "right",
    fontWeight: "500",
  },
  track: {
    flex: 1,
    height: 8,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 4,
    overflow: "hidden",
  },
  bar: {
    height: "100%",
    borderRadius: 4,
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
