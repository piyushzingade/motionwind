export type GestureKey =
  | "whileHover"
  | "whileTap"
  | "whileFocus"
  | "whileInView"
  | "whileDrag"
  | "initial"
  | "animate"
  | "exit";

export type AnimatableValues = Record<
  string,
  string | number | (string | number)[]
>;

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
  dragConstraints?: {
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
  };
}

export interface LayoutConfig {
  layout?: boolean | "position" | "size" | "preserve-aspect";
  layoutId?: string;
  layoutScroll?: boolean;
  layoutRoot?: boolean;
}

export interface ScrollConfig {
  /** Which scroll axis drives progress. Default "y". */
  axis: "x" | "y";
  /** Track the window/root scroll instead of the element's own position. */
  container: boolean;
  /** `useScroll` offset, e.g. ["start end", "end start"]. */
  offset?: [string, string];
  /** Map of motion style property → literal output range across scroll progress [0,1]. */
  values: Record<string, number[]>;
}

/** Named variant target states, keyed by variant name (e.g. "hidden", "visible"). */
export type VariantMap = Record<string, AnimatableValues>;

/** Which variant name is active for each of Motion's lifecycle props. */
export interface VariantState {
  initial?: string;
  animate?: string;
  exit?: string;
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
  /** Scroll-linked animation configuration (progress-driven style values) */
  scroll: ScrollConfig;
  /** Named variant target states */
  variants: VariantMap;
  /** Active variant state selectors (initial/animate/exit as variant names) */
  variantState: VariantState;
  /** Whether any motion classes were found */
  hasMotion: boolean;
  /** Non-fatal parser and plugin diagnostics. */
  diagnostics: import("./config.js").MotionwindDiagnostic[];
}
