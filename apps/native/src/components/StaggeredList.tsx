import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Animated, {
  FadeInRight,
  FadeOutLeft,
  LinearTransition,
} from "react-native-reanimated";
import { DemoCard } from "./DemoCard";
import { useTheme } from "../theme";

const ITEMS = [
  { id: "1", title: "Welcome to Motionwind", icon: "🎨" },
  { id: "2", title: "Built for React Native", icon: "📱" },
  { id: "3", title: "Powered by Reanimated", icon: "⚡" },
  { id: "4", title: "NativeWind Compatible", icon: "🌊" },
  { id: "5", title: "Spring Physics", icon: "🪀" },
  { id: "6", title: "Gesture Support", icon: "👆" },
];

export function StaggeredList() {
  const [key, setKey] = useState(0);
  const [items, setItems] = useState(ITEMS);
  const { colors } = useTheme();

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const resetItems = () => {
    setItems([]);
    setTimeout(() => {
      setItems(ITEMS);
      setKey((k) => k + 1);
    }, 300);
  };

  return (
    <DemoCard title="Staggered List" subtitle="animate-stagger-100 animate-delay-children-200">
      <Pressable
        style={[styles.resetBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
        onPress={resetItems}
      >
        <Text style={[styles.resetText, { color: colors.fgMuted }]}>Reset List</Text>
      </Pressable>
      <View style={styles.list} key={key}>
        {items.map((item, index) => (
          <Animated.View
            key={item.id}
            entering={FadeInRight.delay(index * 80).duration(400).springify().damping(14)}
            exiting={FadeOutLeft.duration(300)}
            layout={LinearTransition.springify().damping(14)}
            style={[styles.listItem, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]}
          >
            <Text style={styles.icon}>{item.icon}</Text>
            <Text style={[styles.itemText, { color: colors.fg }]}>{item.title}</Text>
            <Pressable
              onPress={() => removeItem(item.id)}
              style={[styles.removeBtn, { backgroundColor: colors.border }]}
            >
              <Text style={[styles.removeText, { color: colors.fgMuted }]}>×</Text>
            </Pressable>
          </Animated.View>
        ))}
      </View>
    </DemoCard>
  );
}

const styles = StyleSheet.create({
  list: { width: "100%", gap: 8 },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 12,
    borderWidth: 1,
  },
  icon: { fontSize: 20 },
  itemText: { flex: 1, fontSize: 14, fontWeight: "500" },
  removeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  removeText: { fontSize: 18, lineHeight: 20, fontWeight: "300" },
  resetBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 16,
    alignSelf: "center",
    borderWidth: 1,
  },
  resetText: { fontSize: 13, fontWeight: "500" },
});
