import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  interpolate,
  Extrapolation,
  Easing,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { DemoCard } from "./DemoCard";
import { useTheme } from "../theme";

const SCREEN_W = Dimensions.get("window").width;
const CARD_W = SCREEN_W - 80;

/**
 * Advanced: Chained gesture interaction.
 * A card that responds to pan with parallax layers, rotation tilt,
 * and connected follower elements that trail behind with spring physics.
 */

function ParallaxCard() {
  const { colors } = useTheme();
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const isPressed = useSharedValue(0);

  const pan = Gesture.Pan()
    .onStart(() => {
      isPressed.value = withTiming(1, { duration: 150 });
    })
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY;
    })
    .onEnd(() => {
      translateX.value = withSpring(0, { damping: 12, stiffness: 200 });
      translateY.value = withSpring(0, { damping: 12, stiffness: 200 });
      isPressed.value = withTiming(0, { duration: 300 });
    });

  // Main card: full movement + perspective tilt
  const cardStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(
      translateX.value,
      [-CARD_W / 2, 0, CARD_W / 2],
      [-12, 0, 12],
      Extrapolation.CLAMP,
    );
    const rotateX = interpolate(
      translateY.value,
      [-80, 0, 80],
      [8, 0, -8],
      Extrapolation.CLAMP,
    );
    return {
      transform: [
        { perspective: 800 },
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotateY: `${rotateY}deg` },
        { rotateX: `${rotateX}deg` },
        { scale: interpolate(isPressed.value, [0, 1], [1, 1.03]) },
      ],
    };
  });

  // Shadow: follows with lag, scales opposite
  const shadowStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value * 0.3 },
      { translateY: translateY.value * 0.3 + 12 },
      { scale: interpolate(isPressed.value, [0, 1], [0.92, 0.88]) },
    ],
    opacity: interpolate(isPressed.value, [0, 1], [0.15, 0.25]),
  }));

  // Follower dot 1: trails behind with more lag
  const f1Style = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value * 0.6 },
      { translateY: translateY.value * 0.6 },
      { scale: interpolate(isPressed.value, [0, 1], [1, 1.2]) },
    ],
    opacity: interpolate(isPressed.value, [0, 1], [0.4, 0.8]),
  }));

  // Follower dot 2: even more lag
  const f2Style = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value * 0.35 },
      { translateY: translateY.value * 0.35 },
      { scale: interpolate(isPressed.value, [0, 1], [1, 1.4]) },
    ],
    opacity: interpolate(isPressed.value, [0, 1], [0.25, 0.6]),
  }));

  return (
    <View style={styles.parallaxWrap}>
      {/* Shadow layer */}
      <Animated.View
        style={[
          styles.cardShadow,
          { backgroundColor: colors.fg },
          shadowStyle,
        ]}
      />

      {/* Follower dots */}
      <Animated.View
        style={[styles.follower, styles.follower1, { backgroundColor: colors.accent }, f1Style]}
      />
      <Animated.View
        style={[styles.follower, styles.follower2, { backgroundColor: colors.accent }, f2Style]}
      />

      {/* Main card */}
      <GestureDetector gesture={pan}>
        <Animated.View
          style={[
            styles.parallaxCard,
            {
              backgroundColor: colors.surfaceElevated,
              borderColor: colors.border,
            },
            cardStyle,
          ]}
        >
          <View style={[styles.cardAccent, { backgroundColor: colors.accent }]} />
          <Text style={[styles.cardTitle, { color: colors.fg }]}>
            Drag me around
          </Text>
          <Text style={[styles.cardBody, { color: colors.fgMuted }]}>
            3D perspective tilt + parallax shadow + trailing followers with spring physics
          </Text>

          {/* Inner floating elements */}
          <View style={styles.cardInner}>
            <View style={[styles.innerDot, { backgroundColor: `${colors.accent}30` }]}>
              <View style={[styles.innerDotCore, { backgroundColor: colors.accent }]} />
            </View>
            <View style={[styles.innerBar, { backgroundColor: `${colors.accent}20` }]} />
            <View style={[styles.innerBar, styles.innerBarShort, { backgroundColor: `${colors.accent}15` }]} />
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

export function GestureChain() {
  return (
    <DemoCard
      title="3D Gesture Card"
      subtitle="Perspective tilt + parallax shadow + spring followers"
    >
      <ParallaxCard />
    </DemoCard>
  );
}

const styles = StyleSheet.create({
  parallaxWrap: {
    width: "100%",
    height: 220,
    alignItems: "center",
    justifyContent: "center",
  },
  cardShadow: {
    position: "absolute",
    width: CARD_W - 40,
    height: 140,
    borderRadius: 20,
  },
  parallaxCard: {
    width: CARD_W - 20,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    overflow: "hidden",
  },
  cardAccent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  cardBody: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 16,
  },
  cardInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  innerDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  innerDotCore: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  innerBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
  },
  innerBarShort: {
    flex: 0.6,
  },
  follower: {
    position: "absolute",
    borderRadius: 999,
  },
  follower1: {
    width: 12,
    height: 12,
    top: 30,
    right: 50,
  },
  follower2: {
    width: 8,
    height: 8,
    bottom: 40,
    left: 60,
  },
});
