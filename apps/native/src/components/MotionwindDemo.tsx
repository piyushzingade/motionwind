import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { DemoCard } from "./DemoCard";

/**
 * This demo shows how the motionwind-react-native class syntax maps
 * to actual Reanimated animations — the same API as the web package.
 */

function ClassSyntaxExample({
  classString,
  description,
  children,
}: {
  classString: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.example}>
      <View style={styles.codeBlock}>
        <Text style={styles.codeText}>{classString}</Text>
      </View>
      <Text style={styles.description}>{description}</Text>
      <View style={styles.preview}>{children}</View>
    </View>
  );
}

function FadeUpBox() {
  const [key, setKey] = useState(0);
  return (
    <Pressable onPress={() => setKey((k) => k + 1)}>
      <Animated.View
        key={key}
        entering={FadeInDown.duration(500).springify().damping(12)}
        style={styles.demoBox}
      >
        <Text style={styles.demoBoxText}>Tap to replay</Text>
      </Animated.View>
    </Pressable>
  );
}

function TapScaleBox() {
  const scale = useSharedValue(1);
  const bg = useSharedValue(0);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    backgroundColor:
      bg.value > 0.5
        ? "rgba(99, 102, 241, 0.8)"
        : "rgba(99, 102, 241, 0.4)",
  }));

  return (
    <Pressable
      onPressIn={() => {
        scale.value = withSpring(0.92, { damping: 15 });
        bg.value = withTiming(1, { duration: 100 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 15 });
        bg.value = withTiming(0, { duration: 200 });
      }}
    >
      <Animated.View style={[styles.tapDemoBox, style]}>
        <Text style={styles.demoBoxText}>Press & hold</Text>
      </Animated.View>
    </Pressable>
  );
}

function SpringBox() {
  const [toggled, setToggled] = useState(false);
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  const toggle = () => {
    const next = !toggled;
    setToggled(next);
    translateY.value = withSpring(next ? -30 : 0, {
      stiffness: 400,
      damping: 10,
    });
    rotate.value = withSpring(next ? 180 : 0, {
      stiffness: 400,
      damping: 10,
    });
  };

  return (
    <Pressable onPress={toggle}>
      <Animated.View style={[styles.springDemoBox, style]}>
        <Text style={styles.demoBoxText}>↑</Text>
      </Animated.View>
    </Pressable>
  );
}

export function MotionwindDemo() {
  return (
    <DemoCard
      title="Motionwind Class Syntax"
      subtitle="Same API on web and native"
    >
      <ClassSyntaxExample
        classString='className="animate-enter:opacity-0 animate-enter:y-20 animate-duration-500"'
        description="Fade in + slide up on mount"
      >
        <FadeUpBox />
      </ClassSyntaxExample>

      <ClassSyntaxExample
        classString='className="animate-tap:scale-92 animate-spring animate-damping-15"'
        description="Scale down on press with spring physics"
      >
        <TapScaleBox />
      </ClassSyntaxExample>

      <ClassSyntaxExample
        classString='className="animate-spring animate-stiffness-400 animate-damping-10"'
        description="Bouncy spring with high stiffness, low damping"
      >
        <SpringBox />
      </ClassSyntaxExample>
    </DemoCard>
  );
}

const styles = StyleSheet.create({
  example: {
    width: "100%",
    marginBottom: 20,
  },
  codeBlock: {
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 6,
  },
  codeText: {
    color: "#a78bfa",
    fontSize: 11,
    fontFamily: "monospace",
  },
  description: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 12,
    marginBottom: 12,
  },
  preview: {
    alignItems: "center",
  },
  demoBox: {
    backgroundColor: "rgba(99, 102, 241, 0.4)",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(99, 102, 241, 0.3)",
  },
  tapDemoBox: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(99, 102, 241, 0.3)",
  },
  springDemoBox: {
    backgroundColor: "#10b981",
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  demoBoxText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
});
