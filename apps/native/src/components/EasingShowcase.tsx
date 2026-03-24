import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { DemoCard } from "./DemoCard";
import { useTheme } from "../theme";

const EASINGS = [
  { label: "ease-out", easing: Easing.out(Easing.cubic) },
  { label: "ease-in", easing: Easing.in(Easing.cubic) },
  { label: "ease-in-out", easing: Easing.inOut(Easing.cubic) },
  { label: "linear", easing: Easing.linear },
  { label: "circ-out", easing: Easing.out(Easing.circle) },
  { label: "back-out", easing: Easing.out(Easing.back(1.7)) },
  { label: "bezier", easing: Easing.bezier(0.23, 1, 0.32, 1) },
];

function EasingBar({
  label,
  easing,
  trigger,
  index,
}: {
  label: string;
  easing: any;
  trigger: number;
  index: number;
}) {
  const { colors } = useTheme();
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = 0;
    setTimeout(() => {
      width.value = withTiming(1, { duration: 800, easing });
    }, 50);
  }, [trigger]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${width.value * 100}%`,
    backgroundColor: colors.accent,
    opacity: 1 - index * 0.08,
  }));

  return (
    <View style={styles.easingRow}>
      <Text style={[styles.easingLabel, { color: colors.fgMuted }]}>{label}</Text>
      <View style={[styles.track, { backgroundColor: colors.surface }]}>
        <Animated.View style={[styles.bar, barStyle]} />
      </View>
    </View>
  );
}

export function EasingShowcase() {
  const [trigger, setTrigger] = useState(0);
  const { colors } = useTheme();

  return (
    <DemoCard title="Easing Functions" subtitle="animate-ease-out, animate-ease-[0.23,1,0.32,1]">
      <Pressable
        style={[styles.replayBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
        onPress={() => setTrigger((t) => t + 1)}
      >
        <Text style={[styles.replayText, { color: colors.fgMuted }]}>Replay All</Text>
      </Pressable>
      <View style={styles.easings}>
        {EASINGS.map((e, i) => (
          <EasingBar key={e.label} {...e} trigger={trigger} index={i} />
        ))}
      </View>
    </DemoCard>
  );
}

const styles = StyleSheet.create({
  easings: { width: "100%", gap: 8 },
  easingRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  easingLabel: { fontSize: 10, width: 70, textAlign: "right", fontWeight: "500" },
  track: { flex: 1, height: 8, borderRadius: 4, overflow: "hidden" },
  bar: { height: "100%", borderRadius: 4 },
  replayBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 16,
    alignSelf: "center",
    borderWidth: 1,
  },
  replayText: { fontSize: 13, fontWeight: "500" },
});
