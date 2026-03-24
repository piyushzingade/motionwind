import React, { forwardRef, useMemo } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  TouchableOpacity,
  TextInput,
  FlatList,
  SectionList,
  SafeAreaView,
  type ViewProps,
  type TextProps,
  type ImageProps,
  type ScrollViewProps,
  type PressableProps,
  type TouchableOpacityProps,
  type TextInputProps,
} from "react-native";
import Animated from "react-native-reanimated";
import { useMotionwind } from "./use-motionwind.js";
import { parseMotionClasses } from "./parser.js";

/**
 * Map of RN component names to their Animated equivalents.
 */
const ANIMATED_COMPONENTS: Record<string, React.ComponentType<any>> = {
  View: Animated.View,
  Text: Animated.Text,
  Image: Animated.Image,
  ScrollView: Animated.ScrollView,
  FlatList: Animated.FlatList,
  Pressable: Animated.createAnimatedComponent(Pressable),
  TouchableOpacity: Animated.createAnimatedComponent(TouchableOpacity),
  TextInput: Animated.createAnimatedComponent(TextInput),
  SafeAreaView: Animated.createAnimatedComponent(SafeAreaView),
};

/**
 * Plain (non-animated) RN components — used when no motion classes are present.
 */
const PLAIN_COMPONENTS: Record<string, React.ComponentType<any>> = {
  View,
  Text,
  Image,
  ScrollView,
  FlatList,
  SectionList,
  Pressable,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
};

interface MotionwindNativeProps {
  className?: string;
  style?: any;
  children?: React.ReactNode;
  [key: string]: any;
}

/**
 * Create a motionwind-animated React Native component.
 *
 * Parses `className` for `animate-*` classes:
 * - If motion classes found: wraps with Animated component + Reanimated styles
 * - If no motion classes: renders plain component, passes className to NativeWind
 */
function createMotionwindNativeComponent(componentName: string) {
  const MotionwindNativeComponent = forwardRef<any, MotionwindNativeProps>(
    function MotionwindNativeComponent(
      { className = "", style, ...rest },
      ref,
    ) {
      const { animatedStyle, handlers, parsed } = useMotionwind(className);

      if (!parsed.hasMotion) {
        // No motion classes — render plain component with NativeWind className
        const PlainComponent =
          PLAIN_COMPONENTS[componentName] ?? PLAIN_COMPONENTS.View!;
        return (
          <PlainComponent
            ref={ref}
            className={className}
            style={style}
            {...rest}
          />
        );
      }

      const AnimatedComponent =
        ANIMATED_COMPONENTS[componentName] ?? ANIMATED_COMPONENTS.View!;

      // Pass remaining NativeWind classes via className prop
      const nativewindClassName = parsed.nativewindClasses || undefined;

      return (
        <AnimatedComponent
          ref={ref}
          className={nativewindClassName}
          style={[style, animatedStyle]}
          {...handlers}
          {...rest}
        />
      );
    },
  );

  MotionwindNativeComponent.displayName = `mw.${componentName}`;
  return MotionwindNativeComponent;
}

type MwProxy = {
  [K in keyof typeof PLAIN_COMPONENTS]: ReturnType<
    typeof createMotionwindNativeComponent
  >;
} & Record<string, ReturnType<typeof createMotionwindNativeComponent>>;

/**
 * Runtime component proxy for React Native.
 *
 * Use `mw.View`, `mw.Text`, `mw.Pressable`, etc. with motionwind className strings.
 *
 * @example
 * ```tsx
 * import { mw } from "motionwind-react-native";
 *
 * <mw.View className="animate-enter:opacity-0 animate-enter:y-20 animate-duration-500">
 *   <mw.Text className="animate-enter:opacity-0 animate-delay-200">
 *     Hello from motionwind!
 *   </mw.Text>
 * </mw.View>
 *
 * <mw.Pressable className="animate-tap:scale-95 animate-duration-150 bg-blue-500 p-4 rounded-xl">
 *   <mw.Text className="text-white font-bold">Press me</mw.Text>
 * </mw.Pressable>
 * ```
 */
export const mw = new Proxy(
  {} as MwProxy,
  {
    get(target, prop: string) {
      if (typeof prop !== "string") return undefined;
      if (!target[prop]) {
        (target as Record<string, any>)[prop] =
          createMotionwindNativeComponent(prop);
      }
      return target[prop];
    },
  },
);
