export type GestureKey =
  | "whileHover"
  | "whileTap"
  | "whileFocus"
  | "whileInView"
  | "whileDrag"
  | "initial"
  | "animate"
  | "exit";

export type AnimatableValues = Record<string, string | number | (string | number)[]>;

export interface TransitionConfig {
  type?: "spring" | "tween" | "inertia";
  duration?: number;
  delay?: number;
  ease?: string | number[];
  stiffness?: number;
  damping?: number;
  bounce?: number;
  mass?: number;
  repeat?: number;
  repeatType?: "loop" | "reverse" | "mirror";
  repeatDelay?: number;
  staggerChildren?: number;
  staggerDirection?: 1 | -1;
  delayChildren?: number;
  when?: "beforeChildren" | "afterChildren" | false;
  restSpeed?: number;
  restDelta?: number;
  times?: number[];
}

export interface ViewportConfig {
  once?: boolean;
  amount?: "some" | "all" | number;
  margin?: string;
}

export interface DragConfig {
  drag?: boolean | "x" | "y";
  dragElastic?: number;
  dragSnapToOrigin?: boolean;
  dragMomentum?: boolean;
  dragDirectionLock?: boolean;
  dragConstraints?: { top?: number; left?: number; right?: number; bottom?: number };
}

export interface LayoutConfig {
  layout?: boolean | "position" | "size" | "preserve-aspect";
  layoutId?: string;
  layoutScroll?: boolean;
  layoutRoot?: boolean;
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
  /** Layout animation configuration */
  layoutConfig: LayoutConfig;
  /** Whether any motion classes were found */
  hasMotion: boolean;
}
