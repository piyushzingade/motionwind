import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { FadeInDown } from "react-native-reanimated";
import { ThemeContext, light, dark, type ThemeMode } from "./src/theme";
import { ThemeToggle } from "./src/components/ThemeToggle";
import { EntranceAnimations } from "./src/components/EntranceAnimations";
import { TapAnimations } from "./src/components/TapAnimations";
import { SpringAnimations } from "./src/components/SpringAnimations";
import { DragAnimations } from "./src/components/DragAnimations";
import { EasingShowcase } from "./src/components/EasingShowcase";
import { StaggeredList } from "./src/components/StaggeredList";
import { LayoutAnimations } from "./src/components/LayoutAnimations";
import { RepeatAnimations } from "./src/components/RepeatAnimations";
import { TransformShowcase } from "./src/components/TransformShowcase";
import { MotionwindDemo } from "./src/components/MotionwindDemo";

export default function App() {
  const [mode, setMode] = useState<ThemeMode>("dark");
  const colors = mode === "dark" ? dark : light;

  const theme = useMemo(
    () => ({
      mode,
      colors,
      toggle: () => setMode((m) => (m === "dark" ? "light" : "dark")),
    }),
    [mode, colors],
  );

  return (
    <ThemeContext.Provider value={theme}>
      <GestureHandlerRootView style={[styles.root, { backgroundColor: colors.bg }]}>
        <SafeAreaView style={styles.safe}>
          <StatusBar
            barStyle={mode === "dark" ? "light-content" : "dark-content"}
            backgroundColor={colors.bg}
          />
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <Animated.View
              entering={FadeInDown.duration(600)}
              style={styles.header}
            >
              <View style={styles.headerLeft}>
                <Text style={[styles.logo, { color: colors.fg }]}>motionwind</Text>
                <Text
                  style={[
                    styles.badge,
                    {
                      color: colors.accent,
                      backgroundColor: `${colors.accent}18`,
                    },
                  ]}
                >
                  react-native
                </Text>
              </View>
              <ThemeToggle />
            </Animated.View>

            <Animated.View
              entering={FadeInDown.delay(100).duration(600)}
              style={styles.heroTextWrap}
            >
              <Text style={[styles.heroTitle, { color: colors.fg }]}>
                Animate with{"\n"}Tailwind classes
              </Text>
              <Text style={[styles.heroSub, { color: colors.fgMuted }]}>
                The same motionwind API you love on the web, now powered by
                Reanimated for buttery-smooth 60fps native animations.
              </Text>
            </Animated.View>

            {/* Feature pills */}
            <Animated.View
              entering={FadeInDown.delay(200).duration(600)}
              style={styles.pills}
            >
              {[
                "Reanimated 3",
                "NativeWind",
                "Spring Physics",
                "Gestures",
                "Layout Anim",
              ].map((label) => (
                <View
                  key={label}
                  style={[
                    styles.pill,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.pillText, { color: colors.fgMuted }]}>
                    {label}
                  </Text>
                </View>
              ))}
            </Animated.View>

            {/* Demo sections */}
            <View style={styles.demos}>
              <MotionwindDemo />
              <EntranceAnimations />
              <TapAnimations />
              <SpringAnimations />
              <EasingShowcase />
              <TransformShowcase />
              <DragAnimations />
              <RepeatAnimations />
              <StaggeredList />
              <LayoutAnimations />
            </View>

            {/* Footer */}
            <View style={[styles.footer, { borderTopColor: colors.border }]}>
              <Text style={[styles.footerText, { color: colors.fgMuted }]}>
                motionwind-react-native v0.1.0
              </Text>
              <Text style={[styles.footerSub, { color: colors.borderSubtle }]}>
                Built with Reanimated + Gesture Handler
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </GestureHandlerRootView>
    </ThemeContext.Provider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  scroll: { flex: 1 },
  content: { paddingBottom: 60 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logo: {
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -1,
  },
  badge: {
    fontSize: 11,
    fontWeight: "600",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    overflow: "hidden",
  },
  heroTextWrap: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 8,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: "800",
    letterSpacing: -1.5,
    lineHeight: 42,
  },
  heroSub: {
    fontSize: 15,
    marginTop: 12,
    lineHeight: 22,
    maxWidth: 320,
  },
  pills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  pillText: {
    fontSize: 12,
    fontWeight: "500",
  },
  demos: { paddingTop: 8 },
  footer: {
    alignItems: "center",
    paddingVertical: 40,
    marginHorizontal: 20,
    gap: 4,
    borderTopWidth: 1,
  },
  footerText: { fontSize: 13, fontWeight: "500" },
  footerSub: { fontSize: 11 },
});
