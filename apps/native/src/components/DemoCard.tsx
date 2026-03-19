import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface DemoCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function DemoCard({ title, subtitle, children }: DemoCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1a1a2e",
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.4)",
    marginTop: 4,
    fontWeight: "400",
  },
  content: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 140,
  },
});
