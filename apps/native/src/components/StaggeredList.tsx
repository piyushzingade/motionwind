import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Animated, {
  FadeInRight,
  FadeOutLeft,
  LinearTransition,
} from "react-native-reanimated";
import { DemoCard } from "./DemoCard";

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
    <DemoCard
      title="Staggered List"
      subtitle="animate-stagger-100 animate-delay-children-200"
    >
      <Pressable style={styles.resetBtn} onPress={resetItems}>
        <Text style={styles.resetText}>Reset List</Text>
      </Pressable>

      <View style={styles.list} key={key}>
        {items.map((item, index) => (
          <Animated.View
            key={item.id}
            entering={FadeInRight.delay(index * 80)
              .duration(400)
              .springify()
              .damping(14)}
            exiting={FadeOutLeft.duration(300)}
            layout={LinearTransition.springify().damping(14)}
            style={styles.listItem}
          >
            <Text style={styles.icon}>{item.icon}</Text>
            <Text style={styles.itemText}>{item.title}</Text>
            <Pressable
              onPress={() => removeItem(item.id)}
              style={styles.removeBtn}
            >
              <Text style={styles.removeText}>×</Text>
            </Pressable>
          </Animated.View>
        ))}
      </View>
    </DemoCard>
  );
}

const styles = StyleSheet.create({
  list: {
    width: "100%",
    gap: 8,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 12,
  },
  icon: {
    fontSize: 20,
  },
  itemText: {
    flex: 1,
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  removeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  removeText: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 18,
    lineHeight: 20,
    fontWeight: "300",
  },
  resetBtn: {
    backgroundColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 16,
    alignSelf: "center",
  },
  resetText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 13,
    fontWeight: "500",
  },
});
