import type { ParsedResult } from "motionwind-core";

/**
 * Map a ParsedResult into a Motion-for-Vue props object. Motion for Vue mirrors
 * Framer Motion's prop names (whileHover, initial, animate, transition, …), so
 * this is a straight, framework-neutral projection of the parsed structure.
 *
 * Note: scroll-linked (`animate-scroll:*`) is not yet mapped here — it needs
 * useScroll/useTransform composables and is a follow-up for the Vue adapter.
 */
export function buildMotionProps(
  parsed: ParsedResult,
): Record<string, unknown> {
  const props: Record<string, unknown> = {};

  // Gesture props — a variant state selector (string) wins over an object value
  // for the same lifecycle prop (initial/animate/exit). Motion for Vue names the
  // tap gesture `whilePress`, so remap it from the parser's `whileTap`.
  for (const [key, value] of Object.entries(parsed.gestures)) {
    if (
      (key === "initial" && parsed.variantState.initial) ||
      (key === "animate" && parsed.variantState.animate) ||
      (key === "exit" && parsed.variantState.exit)
    ) {
      continue;
    }
    const propName = key === "whileTap" ? "whilePress" : key;
    props[propName] = value;
  }

  if (Object.keys(parsed.transition).length > 0)
    props.transition = parsed.transition;
  if (Object.keys(parsed.viewport).length > 0)
    props.inViewOptions = parsed.viewport;

  // Drag
  if (parsed.dragConfig.drag !== undefined) props.drag = parsed.dragConfig.drag;
  if (parsed.dragConfig.dragElastic !== undefined)
    props.dragElastic = parsed.dragConfig.dragElastic;
  if (parsed.dragConfig.dragSnapToOrigin !== undefined)
    props.dragSnapToOrigin = parsed.dragConfig.dragSnapToOrigin;
  if (parsed.dragConfig.dragMomentum !== undefined)
    props.dragMomentum = parsed.dragConfig.dragMomentum;
  if (parsed.dragConfig.dragDirectionLock !== undefined)
    props.dragDirectionLock = parsed.dragConfig.dragDirectionLock;
  if (parsed.dragConfig.dragConstraints !== undefined)
    props.dragConstraints = parsed.dragConfig.dragConstraints;

  // Layout
  if (parsed.layoutConfig.layout !== undefined)
    props.layout = parsed.layoutConfig.layout;
  if (parsed.layoutConfig.layoutId !== undefined)
    props.layoutId = parsed.layoutConfig.layoutId;
  if (parsed.layoutConfig.layoutScroll !== undefined)
    props.layoutScroll = parsed.layoutConfig.layoutScroll;
  if (parsed.layoutConfig.layoutRoot !== undefined)
    props.layoutRoot = parsed.layoutConfig.layoutRoot;

  // Named variants
  if (Object.keys(parsed.variants).length > 0) props.variants = parsed.variants;
  if (parsed.variantState.initial) props.initial = parsed.variantState.initial;
  if (parsed.variantState.animate) props.animate = parsed.variantState.animate;
  if (parsed.variantState.exit) props.exit = parsed.variantState.exit;

  return props;
}

/** Interactive/entrance props stripped when the user prefers reduced motion. */
const INTERACTIVE_PROPS = [
  "whileHover",
  "whilePress",
  "whileInView",
  "whileFocus",
  "whileDrag",
  "initial",
] as const;

/**
 * Remove gesture/entrance props so an element renders in its resting state with
 * no motion — used for `prefers-reduced-motion`.
 */
export function stripInteractive(
  props: Record<string, unknown>,
): Record<string, unknown> {
  const out = { ...props };
  for (const key of INTERACTIVE_PROPS) delete out[key];
  return out;
}
