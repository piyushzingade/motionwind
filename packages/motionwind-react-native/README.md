# motionwind-react-native v2 beta

The Reanimated adapter for the shared Motionwind utility language. React Native
support is beta in v2: supported behavior is tested and every capability gap
returns an actionable diagnostic.

```bash
npx expo install react-native-reanimated react-native-gesture-handler
npm install motionwind-react-native@2 nativewind motionwind-core@2
```

Configure the Reanimated Babel plugin required by your installed Reanimated
version, keep it last, and clear Metro's cache. Runtime class parsing does not
remove this Reanimated build requirement.

```tsx
import { defineConfig, MotionwindProvider, mw } from "motionwind-react-native";

const config = defineConfig({
  adapter: "react-native",
  strict: true,
  reducedMotion: "user",
});

export default function App() {
  return (
    <MotionwindProvider config={config}>
      <mw.Pressable
        accessibilityRole="button"
        className="animate-tap:scale-95 animate-spring"
      >
        <mw.Text>Press me</mw.Text>
      </mw.Pressable>
    </MotionwindProvider>
  );
}
```

## Component map

Animated mappings exist for `mw.View`, `mw.Text`, `mw.Image`, `mw.ScrollView`,
`mw.FlatList`, `mw.Pressable`, and `mw.TextInput`. Unknown names fall back to a
View and are not a custom-component API.

## V2 capabilities

| Feature                                     | Status                                                    |
| ------------------------------------------- | --------------------------------------------------------- |
| Initial/enter, timing, springs              | Beta                                                      |
| Tap, hover, focus handlers                  | Beta; depends on native component/platform events         |
| Named variants                              | Beta                                                      |
| Scroll-linked values inside `mw.ScrollView` | Beta                                                      |
| Reduced motion                              | Beta                                                      |
| Drag                                        | Direct Gesture Handler/Reanimated API; diagnostic emitted |
| Layout transitions                          | Direct Reanimated API; diagnostic emitted                 |
| In-view classes                             | Direct visibility orchestration; diagnostic emitted       |
| SVG and web-only properties                 | Direct native API; diagnostic emitted                     |
| Exit orchestration                          | Application-controlled unmount                            |

```tsx
const parsed = parseMotionClasses(
  "animate-drag-x animate-inview:opacity-100 animate-blur-10",
);

// parsed.diagnostics identifies every unsupported native capability.
```

`useMotionwind` exposes animated style, supported handlers, parsed output,
`animateTo`, `resetToBase`, and variant propagation data. `useInView` is a simple
on-layout estimate, not continuous scroll visibility.

Full native guide: https://motionwind.xyz/docs/react-native

MIT
