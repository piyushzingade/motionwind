import { Text } from "react-native";
import { defineConfig, MotionwindProvider, mw } from "motionwind-react-native";

const config = defineConfig({
  adapter: "react-native",
  reducedMotion: "user",
  strict: true,
});

export default function App() {
  return (
    <MotionwindProvider config={config}>
      <mw.Pressable
        testID="motionwind-e2e"
        accessibilityRole="button"
        className="animate-hover:scale-105 animate-tap:scale-95 animate-focus:scale-102 animate-duration-80"
      >
        <Text>Motionwind + Expo</Text>
      </mw.Pressable>
      <mw.View
        testID="motionwind-variant"
        className="animate-variant-hidden:opacity-0 animate-variant-visible:opacity-100 animate-from-hidden animate-to-visible animate-duration-80"
      >
        <Text>Variant</Text>
      </mw.View>
    </MotionwindProvider>
  );
}
