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
  type LayoutChangeEvent,
} from "react-native";
import Animated, {
  useAnimatedRef,
  useScrollViewOffset,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { useMotionwind } from "./use-motionwind.js";
import { parseMotionClasses } from "./parser.js";
import { MotionwindVariantContext } from "./variant-context.js";
import {
  MotionwindScrollContext,
  type ScrollContextValue,
} from "./scroll-context.js";

/**
 * Cast to access Animated.View, Animated.Text, etc. which exist at runtime
 * but are missing from the TypeScript definitions in some reanimated versions.
 */
const Anim = Animated as any;
const createAnimated = Anim.createAnimatedComponent as (
  component: React.ComponentType<any>,
) => React.ComponentType<any>;

/**
 * Map of RN component names to their Animated equivalents.
 */
const ANIMATED_COMPONENTS: Record<string, React.ComponentType<any>> = {
  View: Anim.View ?? createAnimated(View),
  Text: Anim.Text ?? createAnimated(Text),
  Image: Anim.Image ?? createAnimated(Image),
  ScrollView: Anim.ScrollView ?? createAnimated(ScrollView),
  FlatList: Anim.FlatList ?? createAnimated(FlatList),
  Pressable: createAnimated(Pressable),
  TouchableOpacity: createAnimated(TouchableOpacity),
  TextInput: createAnimated(TextInput),
  SafeAreaView: createAnimated(SafeAreaView),
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

/** Assign a node to multiple refs (callback or object refs). */
function assignRef(ref: React.Ref<unknown> | undefined, node: unknown): void {
  if (!ref) return;
  if (typeof ref === "function") ref(node);
  else (ref as React.MutableRefObject<unknown>).current = node;
}

/**
 * A ScrollView that publishes its normalized scroll progress (0→1) to descendant
 * `mw.*` elements using `animate-scroll:*` classes. Powered by Reanimated's
 * `useScrollViewOffset`.
 *
 * NOTE: React Native scroll-linked support is experimental and validated via
 * type-checking + unit tests; verify on-device before relying on it.
 */
const MotionScrollView = forwardRef<any, MotionwindNativeProps>(
  function MotionScrollView(props, ref) {
    const {
      children,
      horizontal,
      onLayout,
      onContentSizeChange,
      ...rest
    } = props;

    const aref = useAnimatedRef();
    // aref attaches to the Animated.ScrollView below; the cast satisfies
    // useScrollViewOffset's stricter ref type.
    const offset = useScrollViewOffset(
      aref as unknown as Parameters<typeof useScrollViewOffset>[0],
    );
    const layoutSize = useSharedValue(0);
    const contentSize = useSharedValue(0);

    const progress = useDerivedValue(() => {
      const max = contentSize.value - layoutSize.value;
      if (max <= 0) return 0;
      const p = offset.value / max;
      return p < 0 ? 0 : p > 1 ? 1 : p;
    });

    const ctx = useMemo<ScrollContextValue>(
      () => (horizontal ? { progressX: progress } : { progressY: progress }),
      [horizontal, progress],
    );

    const AnimatedScrollView = ANIMATED_COMPONENTS.ScrollView!;

    return (
      <MotionwindScrollContext.Provider value={ctx}>
        <AnimatedScrollView
          ref={(node: any) => {
            assignRef(aref, node);
            assignRef(ref, node);
          }}
          horizontal={horizontal}
          onLayout={(e: LayoutChangeEvent) => {
            layoutSize.value = horizontal
              ? e.nativeEvent.layout.width
              : e.nativeEvent.layout.height;
            onLayout?.(e);
          }}
          onContentSizeChange={(w: number, h: number) => {
            contentSize.value = horizontal ? w : h;
            onContentSizeChange?.(w, h);
          }}
          {...rest}
        >
          {children}
        </AnimatedScrollView>
      </MotionwindScrollContext.Provider>
    );
  },
);

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
      { className = "", style, children, ...rest },
      ref,
    ) {
      const { animatedStyle, handlers, parsed, variantProvide } =
        useMotionwind(className);

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
          >
            {children}
          </PlainComponent>
        );
      }

      const AnimatedComponent =
        ANIMATED_COMPONENTS[componentName] ?? ANIMATED_COMPONENTS.View!;

      // Pass remaining NativeWind classes via className prop
      const nativewindClassName = parsed.nativewindClasses || undefined;

      // When this element selects a variant state, propagate it to descendants.
      const content = variantProvide ? (
        <MotionwindVariantContext.Provider value={variantProvide}>
          {children}
        </MotionwindVariantContext.Provider>
      ) : (
        children
      );

      return (
        <AnimatedComponent
          ref={ref}
          className={nativewindClassName}
          style={[style, animatedStyle]}
          {...handlers}
          {...rest}
        >
          {content}
        </AnimatedComponent>
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
        // mw.ScrollView provides scroll progress to descendants for
        // animate-scroll:* classes, in addition to normal class support.
        (target as Record<string, any>)[prop] =
          prop === "ScrollView"
            ? MotionScrollView
            : createMotionwindNativeComponent(prop);
      }
      return target[prop];
    },
  },
);
