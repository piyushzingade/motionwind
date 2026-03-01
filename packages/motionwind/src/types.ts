export type GestureKey =
  | "whileHover"
  | "whileTap"
  | "whileFocus"
  | "whileInView"
  | "whileDrag"
  | "initial"
  | "animate"
  | "exit";

export type AnimatableValues = Record<string, string | number>;

export interface TransitionConfig {
  type?: "spring" | "tween" | "inertia";
  duration?: number;
  delay?: number;
  ease?: string;
  stiffness?: number;
  damping?: number;
  bounce?: number;
  mass?: number;
  repeat?: number;
}

export interface ViewportConfig {
  once?: boolean;
  amount?: "some" | "all";
  margin?: string;
}

export interface DragConfig {
  drag?: boolean | "x" | "y";
  dragElastic?: number;
}

export interface ParsedResult {
  /** Tailwind classes that pass through untouched */
  tailwindClasses: string;
  /** Gesture props mapped to their animatable values */
  gestures: Partial<Record<GestureKey, AnimatableValues>>;
  /** Transition configuration */
  transition: TransitionConfig;
  /** Viewport configuration for whileInView */
  viewport: ViewportConfig;
  /** Drag configuration */
  dragConfig: DragConfig;
  /** Whether any motion classes were found */
  hasMotion: boolean;
}
