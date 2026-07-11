import { defineComponent, h, type Component, type VNode } from "vue";
import { motion } from "motion-v";
import { parseMotionClasses } from "motionwind-core";
import { buildMotionProps, stripInteractive } from "./props.js";

// motion-v exposes a component per tag (motion.div, motion.button, …).
const motionTags = motion as unknown as Record<string, Component>;

function resolveMotionComponent(tag: string): Component {
  if (!motionTags || typeof motionTags !== "object") {
    throw new Error(
      "[motionwind-vue] Motion for Vue is unavailable. Install the peer dependency: npm install motion-v",
    );
  }
  const comp = motionTags[tag] ?? motionTags.div;
  if (!comp) {
    throw new Error(
      `[motionwind-vue] motion-v has no component for <${tag}>. Use a standard HTML tag.`,
    );
  }
  return comp;
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

let warnedScroll = false;
function warnScroll(tag: string): void {
  if (
    warnedScroll ||
    typeof process === "undefined" ||
    process.env?.NODE_ENV === "production"
  ) {
    return;
  }
  warnedScroll = true;
  console.warn(
    `[motionwind-vue] scroll-linked classes (animate-scroll:*) aren't supported ` +
      `in the Vue adapter yet; ignoring on <${tag}>. Use useScroll from motion-v directly.`,
  );
}

/** Shared render path for <Motionwind> and the mw.* proxy components. */
function renderMotion(
  tag: string,
  attrs: Record<string, unknown>,
  children: VNode[] | undefined,
): VNode {
  const className = typeof attrs.class === "string" ? attrs.class : "";
  const { class: _class, ...restAttrs } = attrs;
  const parsed = parseMotionClasses(className);

  if (!parsed.hasMotion) {
    return h(tag, { class: className || undefined, ...restAttrs }, children);
  }

  if (Object.keys(parsed.scroll.values).length > 0) warnScroll(tag);

  let motionProps = buildMotionProps(parsed);
  if (prefersReducedMotion()) motionProps = stripInteractive(motionProps);

  return h(
    resolveMotionComponent(tag),
    { class: parsed.tailwindClasses || undefined, ...motionProps, ...restAttrs },
    children,
  );
}

/**
 * `<Motionwind as="div" class="animate-hover:scale-110">` — parses the class
 * string and renders the matching Motion-for-Vue component with mapped props.
 * Non-motion classes pass through as the element's `class`.
 */
export const Motionwind = defineComponent({
  name: "Motionwind",
  inheritAttrs: false,
  props: {
    as: { type: String, default: "div" },
  },
  setup(props, { slots, attrs }) {
    return () =>
      renderMotion(props.as, attrs as Record<string, unknown>, slots.default?.());
  },
});

const componentCache = new Map<string, Component>();

function createTagComponent(tag: string): Component {
  const cached = componentCache.get(tag);
  if (cached) return cached;
  const comp = defineComponent({
    name: `mw.${tag}`,
    inheritAttrs: false,
    setup(_props, { slots, attrs }) {
      return () =>
        renderMotion(tag, attrs as Record<string, unknown>, slots.default?.());
    },
  });
  componentCache.set(tag, comp);
  return comp;
}

/**
 * Component proxy: `mw.div`, `mw.button`, … for render-function / JSX usage.
 *
 * @example
 * ```ts
 * import { mw } from "motionwind-vue";
 * h(mw.button, { class: "animate-hover:scale-110" }, () => "Click");
 * ```
 */
export const mw = new Proxy(
  {} as Record<string, Component>,
  {
    get(_target, tag: string) {
      if (typeof tag !== "string") return undefined;
      return createTagComponent(tag);
    },
  },
);
