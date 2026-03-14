"use client";

import React from "react";
import { motion } from "motion/react";
import type { MotionProps } from "motion/react";
import { parseMotionClasses } from "./parser.js";
import type { GestureKey } from "./types.js";

type HTMLTag = keyof React.JSX.IntrinsicElements;

type MotionwindProps<T extends HTMLTag> = React.ComponentPropsWithRef<T> & {
  className?: string;
};

const componentCache = new Map<string, React.ComponentType<MotionProps>>();

function getMotionComponent(tag: string): React.ComponentType<MotionProps> {
  const cached = componentCache.get(tag);
  if (cached) return cached;

  const component = (motion as unknown as Record<string, React.ComponentType<MotionProps>>)[tag];
  if (component) {
    componentCache.set(tag, component);
    return component;
  }

  // Fallback: use motion.div
  const fallback = motion.div as React.ComponentType<MotionProps>;
  componentCache.set(tag, fallback);
  return fallback;
}

function createMotionwindComponent<T extends HTMLTag>(tag: T) {
  const MotionwindComponent = React.forwardRef<Element, MotionwindProps<T>>(
    function MotionwindComponent(props, ref) {
      const { className = "", ...rest } = props;
      const parsed = parseMotionClasses(className);

      if (!parsed.hasMotion) {
        // No motion classes, render plain element
        const Tag = tag as string;
        return React.createElement(Tag, { className, ref, ...rest });
      }

      const Component = getMotionComponent(tag);

      const motionProps: Record<string, unknown> = {
        ...rest,
        ref,
      };

      if (parsed.tailwindClasses) {
        motionProps.className = parsed.tailwindClasses;
      }

      // Add gesture props
      for (const [key, value] of Object.entries(parsed.gestures)) {
        motionProps[key as GestureKey] = value;
      }

      // Add transition
      if (Object.keys(parsed.transition).length > 0) {
        motionProps.transition = parsed.transition;
      }

      // Add viewport
      if (Object.keys(parsed.viewport).length > 0) {
        motionProps.viewport = parsed.viewport;
      }

      // Add drag config
      if (parsed.dragConfig.drag !== undefined) {
        motionProps.drag = parsed.dragConfig.drag;
      }
      if (parsed.dragConfig.dragElastic !== undefined) {
        motionProps.dragElastic = parsed.dragConfig.dragElastic;
      }
      if (parsed.dragConfig.dragSnapToOrigin !== undefined) {
        motionProps.dragSnapToOrigin = parsed.dragConfig.dragSnapToOrigin;
      }
      if (parsed.dragConfig.dragMomentum !== undefined) {
        motionProps.dragMomentum = parsed.dragConfig.dragMomentum;
      }
      if (parsed.dragConfig.dragDirectionLock !== undefined) {
        motionProps.dragDirectionLock = parsed.dragConfig.dragDirectionLock;
      }
      if (parsed.dragConfig.dragConstraints !== undefined) {
        motionProps.dragConstraints = parsed.dragConfig.dragConstraints;
      }

      // Add layout config
      if (parsed.layoutConfig.layout !== undefined) {
        motionProps.layout = parsed.layoutConfig.layout;
      }
      if (parsed.layoutConfig.layoutId !== undefined) {
        motionProps.layoutId = parsed.layoutConfig.layoutId;
      }
      if (parsed.layoutConfig.layoutScroll !== undefined) {
        motionProps.layoutScroll = parsed.layoutConfig.layoutScroll;
      }
      if (parsed.layoutConfig.layoutRoot !== undefined) {
        motionProps.layoutRoot = parsed.layoutConfig.layoutRoot;
      }

      return React.createElement(Component, motionProps as MotionProps);
    },
  );

  MotionwindComponent.displayName = `mw.${tag}`;
  return MotionwindComponent;
}

/**
 * Runtime fallback for dynamic classNames.
 * Use `mw.div`, `mw.button`, etc. like `motion.div` but with
 * motionwind class parsing at runtime.
 *
 * @example
 * ```tsx
 * import { mw } from "motionwind";
 *
 * <mw.button className={`animate-hover:scale-110 ${isActive ? 'bg-blue-500' : 'bg-gray-500'}`}>
 *   Click
 * </mw.button>
 * ```
 */
export const mw = new Proxy({} as Record<string, ReturnType<typeof createMotionwindComponent>>, {
  get(_target, prop: string) {
    if (typeof prop !== "string") return undefined;
    if (!_target[prop]) {
      _target[prop] = createMotionwindComponent(prop as HTMLTag);
    }
    return _target[prop];
  },
});
