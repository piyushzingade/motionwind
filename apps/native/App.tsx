import React from "react";
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
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="light-content" backgroundColor="#0f0f1a" />
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
            <Text style={styles.logo}>motionwind</Text>
            <Text style={styles.badge}>react-native</Text>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(100).duration(600)}
            style={styles.heroTextWrap}
          >
            <Text style={styles.heroTitle}>
              Animate with{"\n"}Tailwind classes
            </Text>
            <Text style={styles.heroSub}>
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
              <View key={label} style={styles.pill}>
                <Text style={styles.pillText}>{label}</Text>
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
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              motionwind-react-native v0.1.0
            </Text>
            <Text style={styles.footerSub}>
              Built with Reanimated + Gesture Handler
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#0f0f1a",
  },
  safe: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: 60,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  logo: {
    fontSize: 24,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: -1,
  },
  badge: {
    fontSize: 11,
    fontWeight: "600",
    color: "#818cf8",
    backgroundColor: "rgba(99, 102, 241, 0.12)",
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
    color: "#ffffff",
    letterSpacing: -1.5,
    lineHeight: 42,
  },
  heroSub: {
    fontSize: 15,
    color: "rgba(255,255,255,0.4)",
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
    backgroundColor: "rgba(255,255,255,0.05)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  pillText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 12,
    fontWeight: "500",
  },
  demos: {
    paddingTop: 8,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 4,
  },
  footerText: {
    color: "rgba(255,255,255,0.2)",
    fontSize: 13,
    fontWeight: "500",
  },
  footerSub: {
    color: "rgba(255,255,255,0.1)",
    fontSize: 11,
  },
});
