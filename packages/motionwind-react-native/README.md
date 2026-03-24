# motionwind-react-native

Animate React Native apps with Tailwind-like utility classes — powered by `react-native-reanimated`.

```tsx
import { mw } from "motionwind-react-native";

<mw.View className="animate-enter:opacity-0 animate-enter:y-20 animate-duration-500">
  <mw.Text className="animate-enter:opacity-0 animate-delay-200">
    Hello from motionwind!
  </mw.Text>
</mw.View>
```

Write `animate-*` classes. Get 60fps native animations. No boilerplate.

## Features

- **Same API as web** — `animate-hover:scale-110` on web, `animate-tap:scale-95` on mobile. One mental model.
- **Reanimated powered** — Animations run on the UI thread. Zero dropped frames.
- **NativeWind compatible** — Non-animation Tailwind classes pass through automatically.
- **Runtime parsing** — No Babel step needed. The `mw.*` proxy parses classes at runtime with an LRU cache.
- **Gesture support** — Tap, hover, focus, and viewport-triggered animations out of the box.
- **Spring physics** — `animate-spring`, `animate-stiffness-300`, `animate-damping-20`.
- **Drag interactions** — `animate-drag-both`, elastic bounds, snap-to-origin.

## Installation

### Expo

```bash
npx expo install react-native-reanimated react-native-gesture-handler
npm install motionwind-react-native
```

### Bare React Native

```bash
npm install motionwind-react-native react-native-reanimated react-native-gesture-handler
```

### Babel config

Add the Reanimated plugin (must be **last**):

```js
// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: ["react-native-reanimated/plugin"],
  };
};
```

Clear cache after setup:

```bash
npx expo start -c
```

## Quick start

```tsx
import { mw } from "motionwind-react-native";

// Fade-in on mount
<mw.View className="animate-enter:opacity-0 animate-enter:y-20 animate-duration-500">
  <mw.Text>Fades in and slides up</mw.Text>
</mw.View>

// Tap interaction
<mw.Pressable className="animate-tap:scale-95 animate-duration-150 bg-blue-500 p-4 rounded-xl">
  <mw.Text className="text-white font-bold">Press me</mw.Text>
</mw.Pressable>

// Spring animation
<mw.View className="animate-enter:scale-0 animate-spring animate-stiffness-300 animate-damping-15">
  <mw.Text>Bounces in</mw.Text>
</mw.View>
```

## Available components

Use `mw.*` to access animated versions of any React Native component:

| Component | Usage |
|---|---|
| `mw.View` | Animated View |
| `mw.Text` | Animated Text |
| `mw.Image` | Animated Image |
| `mw.Pressable` | Animated Pressable |
| `mw.ScrollView` | Animated ScrollView |
| `mw.FlatList` | Animated FlatList |
| `mw.TextInput` | Animated TextInput |
| `mw.TouchableOpacity` | Animated TouchableOpacity |
| `mw.SafeAreaView` | Animated SafeAreaView |

When no `animate-*` classes are present, components render as plain (non-animated) React Native elements for optimal performance.

## Gesture prefixes

| Prefix | Triggers when | RN handler |
|---|---|---|
| `animate-initial:` | Starting state (before enter) | — |
| `animate-enter:` | Component mounts | — |
| `animate-exit:` | Component unmounts | — |
| `animate-tap:` | Element is pressed | `onPressIn` / `onPressOut` |
| `animate-hover:` | Pointer enters (RN 0.71+) | `onHoverIn` / `onHoverOut` |
| `animate-focus:` | Element has focus | `onFocus` / `onBlur` |
| `animate-inview:` | Element enters viewport | `useInView` hook |

## Animatable properties

### Transforms

| Class | RN property |
|---|---|
| `scale-{0-100}` | `scale` (100 = 1.0) |
| `scale-x-{n}` / `scale-y-{n}` | `scaleX` / `scaleY` |
| `rotate-{n}` | `rotate` (auto-formatted as `"45deg"`) |
| `rotate-x-{n}` / `rotate-y-{n}` | `rotateX` / `rotateY` |
| `skew-x-{n}` / `skew-y-{n}` | `skewX` / `skewY` |
| `x-{n}` / `y-{n}` | `translateX` / `translateY` |

### Visual

| Class | RN property |
|---|---|
| `opacity-{0-100}` | `opacity` (100 = 1.0) |
| `bg-{color}` | `backgroundColor` |
| `text-{color}` | `color` |
| `border-{color}` | `borderColor` |

### Layout

| Class | RN property |
|---|---|
| `w-{n}` / `h-{n}` | `width` / `height` |
| `rounded-{n}` | `borderRadius` |
| `border-w-{n}` | `borderWidth` |
| `p-{n}` / `m-{n}` / `gap-{n}` | `padding` / `margin` / `gap` |
| `top-{n}` / `left-{n}` / `right-{n}` / `bottom-{n}` | Position |

### Typography

| Class | RN property |
|---|---|
| `text-size-{n}` | `fontSize` |
| `tracking-{n}` | `letterSpacing` |
| `leading-{n}` | `lineHeight` |

### Keyframe arrays

```tsx
<mw.View className="animate-enter:scale-[100,120,100] animate-repeat-infinite animate-duration-1000" />
```

## Transition configuration

| Class | Effect |
|---|---|
| `animate-duration-{ms}` | Animation duration (milliseconds) |
| `animate-delay-{ms}` | Start delay |
| `animate-spring` | Use spring physics |
| `animate-stiffness-{n}` | Spring stiffness |
| `animate-damping-{n}` | Spring damping |
| `animate-mass-{n}` | Spring mass (n/10) |
| `animate-ease-in` | Ease in |
| `animate-ease-out` | Ease out |
| `animate-ease-in-out` | Ease in-out |
| `animate-ease-linear` | Linear |
| `animate-ease-[x1,y1,x2,y2]` | Custom cubic-bezier |
| `animate-repeat-{n}` | Repeat N times |
| `animate-repeat-infinite` | Loop forever |
| `animate-repeat-reverse` | Alternate direction |

## Viewport configuration

| Class | Effect |
|---|---|
| `animate-once` | Trigger once then lock |
| `animate-amount-{n}` | Trigger at n% visibility |
| `animate-amount-all` | Trigger when fully visible |
| `animate-margin-{n}` | Add margin threshold |

## Drag configuration

| Class | Effect |
|---|---|
| `animate-drag-x` | Draggable on X-axis |
| `animate-drag-y` | Draggable on Y-axis |
| `animate-drag-both` | Draggable in both directions |
| `animate-drag-elastic-{n}` | Elastic coefficient (0-100) |
| `animate-drag-snap` | Snap to origin on release |
| `animate-drag-no-momentum` | Disable momentum |
| `animate-drag-constraint-t/b/l/r-{n}` | Drag bounds |

## Hooks

### useMotionwind

For custom animated components:

```tsx
import { useMotionwind } from "motionwind-react-native";

function MyComponent({ className }) {
  const { animatedStyle, handlers, parsed } = useMotionwind(className);

  return (
    <Animated.View style={[styles.container, animatedStyle]} {...handlers}>
      {/* content */}
    </Animated.View>
  );
}
```

Returns:
- `animatedStyle` — Reanimated animated style object
- `handlers` — Gesture event handlers (`onPressIn`, `onPressOut`, etc.)
- `parsed` — Full parsed result from class string
- `animateTo(style)` — Manually animate to a state
- `resetToBase()` — Reset to enter state

### useInView

Detect when a component enters the viewport:

```tsx
import { useInView } from "motionwind-react-native";

function MyComponent() {
  const { isInView, onLayout, viewRef } = useInView();

  return (
    <View ref={viewRef} onLayout={onLayout}>
      {isInView && <Text>I'm visible!</Text>}
    </View>
  );
}
```

## Web vs. Native differences

| Feature | Web (`motionwind-react`) | Native (`motionwind-react-native`) |
|---|---|---|
| Animation engine | Motion (Framer Motion) | react-native-reanimated |
| Styling | Tailwind CSS | NativeWind (optional) |
| `whileHover` | Mouse hover | `onHoverIn/Out` (RN 0.71+) |
| `whileTap` | Click/touch | `onPressIn/Out` |
| CSS filters | `blur()`, `brightness()` | Not supported (dropped silently) |
| CSS units | `vh`, `vw`, `rem`, `em` | Plain numbers (dp) |
| `x` / `y` | CSS translate | `translateX` / `translateY` |
| Rotate values | Number (degrees) | String (`"45deg"`) |
| Duration unit | Seconds | Milliseconds |

## Peer dependencies

| Package | Version |
|---|---|
| `react` | ^18.0.0 \|\| ^19.0.0 |
| `react-native` | >=0.72.0 |
| `react-native-reanimated` | ^3.0.0 \|\| ^4.0.0 |
| `nativewind` (optional) | ^4.0.0 |

## License

MIT
