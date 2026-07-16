"use client";

import React from "react";
import { MotionConfig, motion, useScroll, useTransform } from "motion/react";
import type { MotionProps } from "motion/react";
import {
  parseMotionClasses,
  type MotionwindConfig,
  type ParsedResult,
} from "motionwind-core";

type HTMLTag = keyof React.JSX.IntrinsicElements;

type MotionwindProps<T extends HTMLTag> = React.ComponentPropsWithRef<T> & {
  className?: string;
};

const MotionwindConfigContext = React.createContext<
  MotionwindConfig | undefined
>(undefined);

const reducedMotionDeclarations = `
  [data-motionwind-motion] {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transform: none !important;
    translate: none !important;
    rotate: none !important;
    scale: none !important;
    transition-duration: 0.01ms !important;
  }
`;

function reducedMotionStyles(
  policy: MotionwindConfig["reducedMotion"],
): string {
  if (policy === "never") return "";
  if (policy === "always") return reducedMotionDeclarations;
  return `@media (prefers-reduced-motion: reduce) {${reducedMotionDeclarations}}`;
}

export function MotionwindProvider({
  config,
  children,
}: {
  config: MotionwindConfig;
  children: React.ReactNode;
}) {
  const reducedMotion = config.reducedMotion ?? "user";
  return (
    <MotionwindConfigContext.Provider value={config}>
      {reducedMotion !== "never" ? (
        <style data-motionwind-reduced-motion={reducedMotion}>
          {reducedMotionStyles(reducedMotion)}
        </style>
      ) : null}
      <MotionConfig reducedMotion={reducedMotion}>{children}</MotionConfig>
    </MotionwindConfigContext.Provider>
  );
}

// Bounded by the finite set of HTML tags (~100), but cap at 200 as a safety measure
const COMPONENT_CACHE_MAX = 200;
const componentCache = new Map<string, React.ComponentType<MotionProps>>();

function getMotionComponent(tag: string): React.ComponentType<MotionProps> {
  const cached = componentCache.get(tag);
  if (cached) return cached;

  const component = (
    motion as unknown as Record<string, React.ComponentType<MotionProps>>
  )[tag];
  if (component) {
    if (componentCache.size >= COMPONENT_CACHE_MAX) {
      const firstKey = componentCache.keys().next().value;
      if (firstKey !== undefined) componentCache.delete(firstKey);
    }
    componentCache.set(tag, component);
    return component;
  }

  // Fallback: use motion.div
  const fallback = motion.div as React.ComponentType<MotionProps>;
  if (componentCache.size >= COMPONENT_CACHE_MAX) {
    const firstKey = componentCache.keys().next().value;
    if (firstKey !== undefined) componentCache.delete(firstKey);
  }
  componentCache.set(tag, fallback);
  return fallback;
}

/**
 * Apply the non-scroll parsed props (gestures, transition, viewport, drag,
 * layout, variants) onto a motion props object. Shared by the static and
 * scroll-linked render paths.
 */
function applyParsedProps(
  motionProps: Record<string, unknown>,
  parsed: ParsedResult,
): void {
  // The provider uses this stable marker to suppress transform-based motion
  // when reduced motion is requested. The compiler emits the same marker.
  motionProps["data-motionwind-motion"] = "";

  // Gesture props — but a variant state selector (string) takes precedence over
  // an object value for the same lifecycle prop.
  for (const [key, value] of Object.entries(parsed.gestures)) {
    if (
      (key === "initial" && parsed.variantState.initial) ||
      (key === "animate" && parsed.variantState.animate) ||
      (key === "exit" && parsed.variantState.exit)
    ) {
      continue;
    }
    motionProps[key] = value;
  }

  if (Object.keys(parsed.transition).length > 0) {
    motionProps.transition = parsed.transition;
  }

  if (Object.keys(parsed.viewport).length > 0) {
    motionProps.viewport = parsed.viewport;
  }

  // Drag config
  if (parsed.dragConfig.drag !== undefined)
    motionProps.drag = parsed.dragConfig.drag;
  if (parsed.dragConfig.dragElastic !== undefined)
    motionProps.dragElastic = parsed.dragConfig.dragElastic;
  if (parsed.dragConfig.dragSnapToOrigin !== undefined)
    motionProps.dragSnapToOrigin = parsed.dragConfig.dragSnapToOrigin;
  if (parsed.dragConfig.dragMomentum !== undefined)
    motionProps.dragMomentum = parsed.dragConfig.dragMomentum;
  if (parsed.dragConfig.dragDirectionLock !== undefined)
    motionProps.dragDirectionLock = parsed.dragConfig.dragDirectionLock;
  if (parsed.dragConfig.dragConstraints !== undefined)
    motionProps.dragConstraints = parsed.dragConfig.dragConstraints;

  // Layout config
  if (parsed.layoutConfig.layout !== undefined)
    motionProps.layout = parsed.layoutConfig.layout;
  if (parsed.layoutConfig.layoutId !== undefined)
    motionProps.layoutId = parsed.layoutConfig.layoutId;
  if (parsed.layoutConfig.layoutScroll !== undefined)
    motionProps.layoutScroll = parsed.layoutConfig.layoutScroll;
  if (parsed.layoutConfig.layoutRoot !== undefined)
    motionProps.layoutRoot = parsed.layoutConfig.layoutRoot;

  // Named variants
  if (Object.keys(parsed.variants).length > 0)
    motionProps.variants = parsed.variants;
  if (parsed.variantState.initial)
    motionProps.initial = parsed.variantState.initial;
  if (parsed.variantState.animate)
    motionProps.animate = parsed.variantState.animate;
  if (parsed.variantState.exit) motionProps.exit = parsed.variantState.exit;
}

interface ScrollMotionProps {
  component: React.ComponentType<MotionProps>;
  parsed: ParsedResult;
  rest: Record<string, unknown>;
}

/**
 * Renders a scroll-linked motion element. Sets up `useScroll` (tracking either
 * this element or the page) and maps its progress onto style values via
 * `useTransform`. Rendered with a `key` of the className so the hook count is
 * stable across the component's lifetime.
 */
const ScrollMotion = React.forwardRef<Element, ScrollMotionProps>(
  function ScrollMotion({ component: Component, parsed, rest }, ref) {
    const localRef = React.useRef<Element | null>(null);
    const setRef = React.useCallback(
      (node: Element | null) => {
        localRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref)
          (ref as React.MutableRefObject<Element | null>).current = node;
      },
      [ref],
    );

    const { scroll } = parsed;
    const scrollOptions: Record<string, unknown> = { axis: scroll.axis };
    if (!scroll.container) {
      scrollOptions.target = localRef;
      if (scroll.offset) scrollOptions.offset = scroll.offset;
    }
    const { scrollXProgress, scrollYProgress } = useScroll(scrollOptions);
    const progress = scroll.axis === "x" ? scrollXProgress : scrollYProgress;

    const style: Record<string, unknown> = {
      ...(rest.style as Record<string, unknown> | undefined),
    };
    for (const [key, range] of Object.entries(scroll.values)) {
      const input = range.map((_, i) =>
        range.length === 1 ? 0 : i / (range.length - 1),
      );
      // The hook count is fixed per mount (keyed by className at the call site),
      // so looping here is safe despite the rules-of-hooks lint.
      // eslint-disable-next-line react-hooks/rules-of-hooks
      style[key] = useTransform(progress, input, range);
    }

    const motionProps: Record<string, unknown> = {
      ...rest,
      ref: setRef,
      style,
    };
    if (parsed.tailwindClasses) motionProps.className = parsed.tailwindClasses;
    applyParsedProps(motionProps, parsed);

    return React.createElement(Component, motionProps as MotionProps);
  },
);

function createMotionwindComponent<T extends HTMLTag>(tag: T) {
  const MotionwindComponent = React.forwardRef<Element, MotionwindProps<T>>(
    function MotionwindComponent(props, ref) {
      const config = React.useContext(MotionwindConfigContext);
      const { className = "", ...rest } = props;
      const parsed = parseMotionClasses(className, config);

      if (!parsed.hasMotion) {
        // No motion classes, render plain element
        const Tag = tag as string;
        return React.createElement(Tag, { className, ref, ...rest });
      }

      // Scroll-linked animations need hooks — delegate to ScrollMotion, keyed by
      // className so its internal useTransform count stays stable.
      if (Object.keys(parsed.scroll.values).length > 0) {
        return React.createElement(ScrollMotion, {
          key: className,
          component: getMotionComponent(tag as string),
          parsed,
          rest,
          ref,
        });
      }

      const Component = getMotionComponent(tag);

      const motionProps: Record<string, unknown> = {
        ...rest,
        ref,
      };

      if (parsed.tailwindClasses) {
        motionProps.className = parsed.tailwindClasses;
      }

      applyParsedProps(motionProps, parsed);

      return React.createElement(Component, motionProps as MotionProps);
    },
  );

  MotionwindComponent.displayName = `mw.${tag}`;
  return MotionwindComponent;
}

type AnyComponent = React.ElementType;
const customComponentCache = new WeakMap<object, unknown>();

function createCustomMotionwindComponent<T extends AnyComponent>(Component: T) {
  if (typeof Component === "string") {
    throw new Error(`[motionwind] Use mw.${Component} for intrinsic elements.`);
  }
  const key = Component as object;
  const cached = customComponentCache.get(key);
  if (cached)
    return cached as React.ComponentType<React.ComponentPropsWithRef<T>>;

  const MotionComponent = motion.create(
    Component,
  ) as React.ComponentType<MotionProps>;
  const MotionwindCustom = React.forwardRef<
    unknown,
    React.ComponentPropsWithoutRef<T>
  >(function MotionwindCustom(props, ref) {
    const config = React.useContext(MotionwindConfigContext);
    const { className = "", ...rest } =
      props as React.ComponentPropsWithoutRef<T> & {
        className?: string;
      };
    const parsed = parseMotionClasses(className, config);

    if (!parsed.hasMotion) {
      const PlainComponent = Component as React.ElementType;
      return React.createElement(PlainComponent, { ...rest, className, ref });
    }

    if (Object.keys(parsed.scroll.values).length > 0) {
      return React.createElement(ScrollMotion, {
        key: className,
        component: MotionComponent,
        parsed,
        rest,
        ref: ref as React.Ref<Element>,
      });
    }

    const motionProps: Record<string, unknown> = { ...rest, ref };
    if (parsed.tailwindClasses) motionProps.className = parsed.tailwindClasses;
    applyParsedProps(motionProps, parsed);
    return React.createElement(MotionComponent, motionProps as MotionProps);
  });
  const componentMetadata = Component as {
    displayName?: string;
    name?: string;
  };
  const componentName =
    componentMetadata.displayName ?? componentMetadata.name ?? "Component";
  MotionwindCustom.displayName = `mw.create(${componentName})`;
  customComponentCache.set(key, MotionwindCustom);
  return MotionwindCustom as React.ComponentType<
    React.ComponentPropsWithRef<T>
  >;
}

/**
 * Runtime fallback for dynamic classNames and scroll-linked animations.
 * Use `mw.div`, `mw.button`, etc. like `motion.div` but with
 * motionwind class parsing at runtime.
 *
 * @example
 * ```tsx
 * import { mw } from "motionwind-react";
 *
 * <mw.button className={`animate-hover:scale-110 ${isActive ? 'bg-blue-500' : 'bg-gray-500'}`}>
 *   Click
 * </mw.button>
 * ```
 */
type MotionwindIntrinsicComponents = {
  [T in HTMLTag]: ReturnType<typeof createMotionwindComponent<T>>;
};

export type MotionwindProxy = MotionwindIntrinsicComponents & {
  create: typeof createCustomMotionwindComponent;
};

export const mw = new Proxy({} as MotionwindProxy, {
  get(_target, prop: string) {
    if (typeof prop !== "string") return undefined;
    if (prop === "create") return createCustomMotionwindComponent;
    const components = _target as unknown as Record<
      string,
      ReturnType<typeof createMotionwindComponent>
    >;
    if (!components[prop]) {
      components[prop] = createMotionwindComponent(prop as HTMLTag);
    }
    return components[prop];
  },
});
