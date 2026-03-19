import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  LinearTransition,
  FadeIn,
  FadeOut,
} from "react-native-reanimated";
import { DemoCard } from "./DemoCard";

const COLORS = ["#6366f1", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444"];

function ExpandableCard() {
  const [expanded, setExpanded] = useState(false);
  const height = useSharedValue(60);
  const borderRadius = useSharedValue(16);

  const toggle = () => {
    const next = !expanded;
    setExpanded(next);
    height.value = withSpring(next ? 160 : 60, { damping: 15, stiffness: 200 });
    borderRadius.value = withSpring(next ? 24 : 16, { damping: 15 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
    borderRadius: borderRadius.value,
  }));

  return (
    <Pressable onPress={toggle}>
      <Animated.View style={[styles.expandCard, animatedStyle]}>
        <Text style={styles.expandTitle}>Tap to Expand</Text>
        {expanded && (
          <Animated.View entering={FadeIn.delay(100)} exiting={FadeOut}>
            <Text style={styles.expandBody}>
              Layout animations make size changes feel smooth and natural.
              Powered by Reanimated's layout transitions.
            </Text>
          </Animated.View>
        )}
      </Animated.View>
    </Pressable>
  );
}

function ShuffleGrid() {
  const [items, setItems] = useState(COLORS.map((c, i) => ({ id: i, color: c })));

  const shuffle = () => {
    setItems((prev) => {
      const arr = [...prev];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j]!, arr[i]!];
      }
      return arr;
    });
  };

  return (
    <View style={styles.shuffleSection}>
      <Pressable style={styles.shuffleBtn} onPress={shuffle}>
        <Text style={styles.shuffleBtnText}>Shuffle</Text>
      </Pressable>
      <View style={styles.shuffleGrid}>
        {items.map((item) => (
          <Animated.View
            key={item.id}
            layout={LinearTransition.springify().damping(14).stiffness(200)}
            style={[styles.shuffleBox, { backgroundColor: item.color }]}
          />
        ))}
      </View>
    </View>
  );
}

export function LayoutAnimations() {
  return (
    <DemoCard
      title="Layout Animations"
      subtitle="animate-layout animate-layout-id-card"
    >
      <ExpandableCard />
      <View style={{ height: 16 }} />
      <ShuffleGrid />
    </DemoCard>
  );
}

const styles = StyleSheet.create({
  expandCard: {
    backgroundColor: "#4f46e5",
    width: 280,
    padding: 16,
    overflow: "hidden",
  },
  expandTitle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  expandBody: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
    marginTop: 12,
    lineHeight: 20,
  },
  shuffleSection: {
    alignItems: "center",
    gap: 12,
  },
  shuffleBtn: {
    backgroundColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  shuffleBtnText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 13,
    fontWeight: "500",
  },
  shuffleGrid: {
    flexDirection: "row",
    gap: 8,
  },
  shuffleBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
  },
});
