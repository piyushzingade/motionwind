import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../theme";

interface DemoCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function DemoCard({ title, subtitle, children }: DemoCardProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surfaceElevated,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.fg }]}>{title}</Text>
        {subtitle && (
          <Text
            style={[
              styles.subtitle,
              { color: colors.fgMuted, backgroundColor: colors.codeBg },
            ]}
          >
            {subtitle}
          </Text>
        )}
      </View>
      <View
        style={[
          styles.content,
          { borderTopColor: colors.borderSubtle },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 24,
    overflow: "hidden",
    borderWidth: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 6,
    fontWeight: "400",
    fontFamily: "monospace",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    overflow: "hidden",
    alignSelf: "flex-start",
  },
  content: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 140,
    borderTopWidth: 1,
  },
});
