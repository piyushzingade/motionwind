import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { DemoCard } from "./DemoCard";
import { useTheme } from "../theme";

function ClassSyntaxExample({
  classString,
  description,
  children,
}: {
  classString: string;
  description: string;
  children: React.ReactNode;
}) {
  const { colors } = useTheme();
  return (
    <View style={styles.example}>
      <View style={[styles.codeBlock, { backgroundColor: colors.codeBg, borderColor: colors.border }]}>
        <Text style={[styles.codeText, { color: colors.accent }]}>{classString}</Text>
      </View>
      <Text style={[styles.description, { color: colors.fgMuted }]}>{description}</Text>
      <View style={styles.preview}>{children}</View>
    </View>
  );
}

function FadeUpBox() {
  const { colors } = useTheme();
  const [key, setKey] = useState(0);
  return (
    <Pressable onPress={() => setKey((k) => k + 1)}>
      <Animated.View
        key={key}
        entering={FadeInDown.duration(500).springify().damping(12)}
        style={[styles.demoBox, { backgroundColor: `${colors.accent}30`, borderColor: `${colors.accent}40` }]}
      >
        <Text style={[styles.demoBoxText, { color: colors.fg }]}>Tap to replay</Text>
      </Animated.View>
    </Pressable>
  );
}

function TapScaleBox() {
  const { colors } = useTheme();
  const scale = useSharedValue(1);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPressIn={() => { scale.value = withSpring(0.92, { damping: 15 }); }}
      onPressOut={() => { scale.value = withSpring(1, { damping: 15 }); }}
    >
      <Animated.View style={[styles.demoBox, { backgroundColor: `${colors.accent}30`, borderColor: `${colors.accent}40` }, style]}>
        <Text style={[styles.demoBoxText, { color: colors.fg }]}>Press & hold</Text>
      </Animated.View>
    </Pressable>
  );
}

function SpringBox() {
  const { colors } = useTheme();
  const [toggled, setToggled] = useState(false);
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { rotate: `${rotate.value}deg` }],
  }));

  const toggle = () => {
    const next = !toggled;
    setToggled(next);
    translateY.value = withSpring(next ? -30 : 0, { stiffness: 400, damping: 10 });
    rotate.value = withSpring(next ? 180 : 0, { stiffness: 400, damping: 10 });
  };

  return (
    <Pressable onPress={toggle}>
      <Animated.View style={[styles.springDemoBox, { backgroundColor: colors.accent }, style]}>
        <Text style={[styles.demoBoxText, { color: colors.accentFg, fontSize: 18 }]}>↑</Text>
      </Animated.View>
    </Pressable>
  );
}

export function MotionwindDemo() {
  return (
    <DemoCard title="Motionwind Class Syntax" subtitle="Same API on web and native">
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
  example: { width: "100%", marginBottom: 20 },
  codeBlock: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 6,
    borderWidth: 1,
  },
  codeText: { fontSize: 11, fontFamily: "monospace" },
  description: { fontSize: 12, marginBottom: 12 },
  preview: { alignItems: "center" },
  demoBox: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    borderWidth: 1,
  },
  springDemoBox: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  demoBoxText: { fontSize: 13, fontWeight: "600", textAlign: "center" },
});
