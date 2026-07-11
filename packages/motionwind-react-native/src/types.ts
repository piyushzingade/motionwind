/**
 * Gesture keys supported in React Native via Reanimated.
 * Note: "whileHover" and "whileFocus" are not natively available on mobile,
 * but we support them for cross-platform codebases (they become no-ops on native).
 */
export type GestureKey =
  | "whileHover"
  | "whileTap"
  | "whileFocus"
  | "whileInView"
  | "initial"
  | "animate"
  | "exit";

/** Map of property names to animated values */
export type AnimatableValues = Record<
  string,
  string | number | (string | number)[]
>;

/** Transition configuration for Reanimated */
export interface TransitionConfig {
  type?: "spring" | "timing";
  duration?: number;
  delay?: number;
  /** Reanimated easing function name */
  easing?:
    | "linear"
    | "easeIn"
    | "easeOut"
    | "easeInOut"
    | "circIn"
    | "circOut"
    | "circInOut"
    | "backIn"
    | "backOut"
    | "backInOut"
    | number[];
  stiffness?: number;
  damping?: number;
  mass?: number;
  overshootClamping?: boolean;
  restDisplacementThreshold?: number;
  restSpeedThreshold?: number;
  repeat?: number;
  repeatReverse?: boolean;
  staggerChildren?: number;
  staggerDirection?: 1 | -1;
  delayChildren?: number;
}

/** Viewport config — maps to onLayout visibility detection on native */
export interface ViewportConfig {
  once?: boolean;
  amount?: "some" | "all" | number;
  margin?: number;
}

/** Drag configuration for PanGesture */
export interface DragConfig {
  drag?: boolean | "x" | "y";
  dragElastic?: number;
  dragSnapToOrigin?: boolean;
  dragMomentum?: boolean;
  dragConstraints?: {
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
  };
}

/**
 * RN-specific animatable style properties.
 * These are the properties that can be animated with Reanimated.
 */
export interface NativeAnimatableStyle {
  // Transform
  translateX?: number;
  translateY?: number;
  scale?: number;
  scaleX?: number;
  scaleY?: number;
  rotate?: string;
  rotateX?: string;
  rotateY?: string;
  rotateZ?: string;
  skewX?: string;
  skewY?: string;

  // Layout
  width?: number | string;
  height?: number | string;
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
  padding?: number;
  margin?: number;
  borderRadius?: number;
  borderWidth?: number;
  gap?: number;

  // Visual
  opacity?: number;
  backgroundColor?: string;
  color?: string;
  borderColor?: string;

  // Typography
  fontSize?: number;
  letterSpacing?: number;
  lineHeight?: number;
}

/** Scroll-linked animation configuration (progress-driven style values) */
export interface ScrollConfig {
  /** Which scroll axis drives progress. Default "y". */
  axis: "x" | "y";
  /** Track a parent scroll container's progress (via mw.ScrollView). */
  container: boolean;
  /** Offset hint (kept for parity with web; advisory on native). */
  offset?: [string, string];
  /** Map of RN style property → literal output range across scroll progress [0,1]. */
  values: Record<string, number[]>;
}

/** Named variant target states, keyed by variant name. */
export type VariantMap = Record<string, NativeAnimatableStyle>;

/** Which variant name is active for each lifecycle prop. */
export interface VariantState {
  initial?: string;
  animate?: string;
  exit?: string;
}

/** Parsed result from motionwind class string, adapted for React Native */
export interface ParsedResult {
  /** NativeWind/Tailwind classes that pass through untouched */
  nativewindClasses: string;
  /** Gesture props mapped to their animatable values */
  gestures: Partial<Record<GestureKey, NativeAnimatableStyle>>;
  /** Transition configuration */
  transition: TransitionConfig;
  /** Viewport detection configuration */
  viewport: ViewportConfig;
  /** Drag configuration */
  dragConfig: DragConfig;
  /** Scroll-linked animation configuration */
  scroll: ScrollConfig;
  /** Named variant target states */
  variants: VariantMap;
  /** Active variant state selectors (initial/animate/exit as variant names) */
  variantState: VariantState;
  /** Whether any motion classes were found */
  hasMotion: boolean;
}
