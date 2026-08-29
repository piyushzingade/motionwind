import { definePreset } from "./config.js";

export interface MotionwindRecipe {
  id: string;
  name: string;
  description: string;
  category: "interaction" | "entrance" | "layout" | "loading" | "scroll";
  classes: string;
  accessibility: string;
  adapters: readonly ("react" | "vue" | "vanilla" | "react-native")[];
  maintainer: string;
  version: string;
  compatibleCore: string;
  bundleImpact: string;
  source: string;
}

const COMMUNITY_METADATA = {
  maintainer: "motionwind/core",
  version: "1.0.0",
  compatibleCore: ">=2.0.0 <3",
  bundleImpact: "Preset only; no runtime code added.",
} as const;

const source = (id: string) =>
  `https://github.com/piyushzingade/motionwind/tree/main/registry/recipes/${id}.json`;

export const MOTIONWIND_RECIPES: readonly MotionwindRecipe[] = [
  {
    id: "button-press",
    name: "Button press",
    description: "A compact spring response for primary actions.",
    category: "interaction",
    classes:
      "animate-hover:scale-105 animate-tap:scale-95 animate-spring animate-stiffness-420 animate-damping-24",
    accessibility:
      "Preserves keyboard focus and does not communicate state through motion alone.",
    adapters: ["react", "vue", "vanilla", "react-native"],
    ...COMMUNITY_METADATA,
    source: source("button-press"),
  },
  {
    id: "dialog-enter",
    name: "Dialog entrance",
    description: "Fade and lift a dialog into place without excessive travel.",
    category: "entrance",
    classes:
      "animate-initial:opacity-0 animate-initial:y-12 animate-enter:opacity-100 animate-enter:y-0 animate-duration-240 animate-ease-out",
    accessibility:
      "Pair with a focus trap and disable transform movement for reduced-motion users.",
    adapters: ["react", "vue", "vanilla", "react-native"],
    ...COMMUNITY_METADATA,
    source: source("dialog-enter"),
  },
  {
    id: "list-stagger",
    name: "List stagger",
    description: "A restrained stagger for newly revealed collections.",
    category: "entrance",
    classes: "animate-stagger-55 animate-delay-children-40 animate-when-before",
    accessibility:
      "Keep the list readable before and after animation; avoid repeated autoplay.",
    adapters: ["react", "vue"],
    ...COMMUNITY_METADATA,
    source: source("list-stagger"),
  },
  {
    id: "page-reveal",
    name: "Page reveal",
    description: "A single-run opacity and vertical reveal for page sections.",
    category: "scroll",
    classes:
      "animate-initial:opacity-0 animate-initial:y-24 animate-inview:opacity-100 animate-inview:y-0 animate-once animate-duration-480 animate-ease-out",
    accessibility:
      "Content remains in document order and visible when reduced motion is requested.",
    adapters: ["react", "vue", "vanilla"],
    ...COMMUNITY_METADATA,
    source: source("page-reveal"),
  },
  {
    id: "loading-orbit",
    name: "Loading orbit",
    description:
      "A continuous linear rotation for non-blocking progress indicators.",
    category: "loading",
    classes:
      "animate-enter:rotate-360 animate-repeat-infinite animate-duration-900 animate-ease-linear",
    accessibility:
      "Add an accessible status label and stop the loop when loading completes.",
    adapters: ["react", "vue", "vanilla", "react-native"],
    ...COMMUNITY_METADATA,
    source: source("loading-orbit"),
  },
  {
    id: "menu-pop",
    name: "Menu pop",
    description: "A fast scale-and-fade entrance for contextual menus.",
    category: "entrance",
    classes:
      "animate-initial:opacity-0 animate-initial:scale-95 animate-enter:opacity-100 animate-enter:scale-100 animate-duration-160 animate-ease-out",
    accessibility:
      "Move focus into the menu, return it on close, and preserve arrow-key navigation.",
    adapters: ["react", "vue", "vanilla", "react-native"],
    ...COMMUNITY_METADATA,
    source: source("menu-pop"),
  },
  {
    id: "accordion-reveal",
    name: "Accordion reveal",
    description: "A layout-aware reveal for expandable disclosure content.",
    category: "layout",
    classes:
      "animate-layout-size animate-initial:opacity-0 animate-enter:opacity-100 animate-duration-220 animate-ease-out",
    accessibility:
      "Use a native button with aria-expanded and keep content reachable without animation.",
    adapters: ["react", "vue"],
    ...COMMUNITY_METADATA,
    source: source("accordion-reveal"),
  },
  {
    id: "tab-indicator",
    name: "Tab indicator",
    description: "A shared-layout spring for an active tab indicator.",
    category: "layout",
    classes:
      "animate-layout-id-active-tab animate-spring animate-stiffness-440 animate-damping-34",
    accessibility:
      "Pair with tablist semantics, roving focus, and an independent selected-state cue.",
    adapters: ["react", "vue"],
    ...COMMUNITY_METADATA,
    source: source("tab-indicator"),
  },
  {
    id: "toast-enter",
    name: "Toast entrance",
    description: "A short horizontal slide for non-blocking notifications.",
    category: "entrance",
    classes:
      "animate-initial:opacity-0 animate-initial:x-24 animate-enter:opacity-100 animate-enter:x-0 animate-duration-240 animate-ease-out",
    accessibility:
      "Use an appropriate live region and provide enough time to read or dismiss the toast.",
    adapters: ["react", "vue", "vanilla", "react-native"],
    ...COMMUNITY_METADATA,
    source: source("toast-enter"),
  },
  {
    id: "sortable-item",
    name: "Sortable item",
    description:
      "Layout animation and vertical drag feedback for reorderable lists.",
    category: "interaction",
    classes:
      "animate-layout-position animate-drag-y animate-drag-snap animate-drag:scale-103 animate-spring animate-stiffness-360 animate-damping-28",
    accessibility:
      "Provide keyboard reordering controls and announce the new item position.",
    adapters: ["react", "vue"],
    ...COMMUNITY_METADATA,
    source: source("sortable-item"),
  },
  {
    id: "svg-line-loader",
    name: "SVG line loader",
    description: "Draw and repeat an SVG path for compact progress feedback.",
    category: "loading",
    classes:
      "animate-initial:path-length-0 animate-enter:path-length-1 animate-duration-900 animate-ease-in-out animate-repeat-infinite animate-repeat-reverse",
    accessibility:
      "Give the SVG a status label and stop repeating when the operation completes.",
    adapters: ["react", "vue", "vanilla"],
    ...COMMUNITY_METADATA,
    source: source("svg-line-loader"),
  },
  {
    id: "scroll-progress",
    name: "Scroll progress",
    description: "Map page scroll progress to a horizontal scale indicator.",
    category: "scroll",
    classes: "animate-scroll:scaleX-[0,1] animate-scroll-container",
    accessibility:
      "Treat the indicator as supplemental; expose document progress in text when it matters.",
    adapters: ["react", "vanilla"],
    ...COMMUNITY_METADATA,
    source: source("scroll-progress"),
  },
  {
    id: "flip-card",
    name: "Flip card",
    description:
      "A 3-D card that rotates 180 degrees around the Y axis on hover.",
    category: "interaction",
    classes:
      "animate-hover:rotate-y-180 animate-duration-480 animate-ease-in-out",
    accessibility:
      "Pair with a separate back face and keep both sides keyboard-accessible.",
    adapters: ["react", "vue", "vanilla"],
    ...COMMUNITY_METADATA,
    source: source("flip-card"),
  },
  {
    id: "marquee",
    name: "Marquee",
    description:
      "A continuously looping horizontal scroll for text or image strips.",
    category: "entrance",
    classes:
      "animate-initial:x-100pct animate-enter:-x-100pct animate-repeat-infinite animate-ease-linear animate-duration-4000",
    accessibility:
      "Pause the marquee on focus or hover; do not convey critical information through motion alone.",
    adapters: ["react", "vue", "vanilla"],
    ...COMMUNITY_METADATA,
    source: source("marquee"),
  },
  {
    id: "magnetic-button",
    name: "Magnetic button",
    description:
      "A subtle spring scale that draws attention on hover without moving the element.",
    category: "interaction",
    classes:
      "animate-hover:scale-103 animate-spring animate-stiffness-280 animate-damping-22",
    accessibility:
      "Do not use scale change as the only indicator of an interactive element.",
    adapters: ["react", "vue", "vanilla"],
    ...COMMUNITY_METADATA,
    source: source("magnetic-button"),
  },
  {
    id: "drawer",
    name: "Drawer",
    description:
      "A side panel that slides in from the edge and returns on exit.",
    category: "entrance",
    classes:
      "animate-initial:x-100pct animate-enter:x-0 animate-exit:x-100pct animate-duration-320 animate-ease-out",
    accessibility:
      "Trap focus inside the drawer, return focus on close, and support Escape to dismiss.",
    adapters: ["react", "vue", "vanilla", "react-native"],
    ...COMMUNITY_METADATA,
    source: source("drawer"),
  },
  {
    id: "tooltip-pop",
    name: "Tooltip pop",
    description: "A small scale-and-fade entrance for contextual tooltips.",
    category: "entrance",
    classes:
      "animate-initial:opacity-0 animate-initial:scale-75 animate-enter:opacity-100 animate-enter:scale-100 animate-duration-160 animate-ease-back-out",
    accessibility:
      "Use role='tooltip', aria-describedby, and ensure the tooltip is dismissible without a mouse.",
    adapters: ["react", "vue", "vanilla", "react-native"],
    ...COMMUNITY_METADATA,
    source: source("tooltip-pop"),
  },
  {
    id: "skeleton-pulse",
    name: "Skeleton pulse",
    description:
      "A pulsing opacity loop for placeholder content while data loads.",
    category: "loading",
    classes:
      "animate-initial:opacity-100 animate-enter:opacity-40 animate-repeat-infinite animate-repeat-reverse animate-duration-800 animate-ease-in-out",
    accessibility:
      "Announce loading state with aria-busy; remove skeleton when content arrives.",
    adapters: ["react", "vue", "vanilla", "react-native"],
    ...COMMUNITY_METADATA,
    source: source("skeleton-pulse"),
  },
  {
    id: "shimmer-load",
    name: "Shimmer load",
    description:
      "A left-to-right gradient shimmer applied to a loading overlay.",
    category: "loading",
    classes:
      "animate-initial:-x-100pct animate-enter:x-100pct animate-repeat-infinite animate-duration-1200 animate-ease-in-out",
    accessibility:
      "Place the shimmer on a decorative overlay; expose loading status through accessible text.",
    adapters: ["react", "vue", "vanilla"],
    ...COMMUNITY_METADATA,
    source: source("shimmer-load"),
  },
  {
    id: "card-hover",
    name: "Card hover",
    description:
      "A spring lift and upward nudge for interactive cards on hover.",
    category: "interaction",
    classes:
      "animate-hover:scale-103 animate-hover:y--4 animate-spring animate-stiffness-380 animate-damping-26",
    accessibility:
      "Ensure focus styles are visible and the hover state is not the only interactive cue.",
    adapters: ["react", "vue", "vanilla"],
    ...COMMUNITY_METADATA,
    source: source("card-hover"),
  },
  {
    id: "number-counter",
    name: "Number counter",
    description:
      "A fade and rise entrance for statistic values triggered when they scroll into view.",
    category: "scroll",
    classes:
      "animate-initial:opacity-0 animate-initial:y-12 animate-inview:opacity-100 animate-inview:y-0 animate-once animate-duration-400 animate-ease-out",
    accessibility:
      "Present the final value in document order and avoid conveying meaning through counting motion.",
    adapters: ["react", "vue", "vanilla"],
    ...COMMUNITY_METADATA,
    source: source("number-counter"),
  },
  {
    id: "progress-bar",
    name: "Progress bar",
    description:
      "An animated width fill for a progress bar triggered on scroll into view.",
    category: "scroll",
    classes:
      "animate-initial:w-0 animate-inview:w-100pct animate-once animate-duration-800 animate-ease-out",
    accessibility:
      "Use a native progress element or role='progressbar' with aria-valuenow to expose state.",
    adapters: ["react", "vue", "vanilla"],
    ...COMMUNITY_METADATA,
    source: source("progress-bar"),
  },
  {
    id: "ripple",
    name: "Ripple",
    description:
      "A radial scale-and-fade burst that emanates from a tap point.",
    category: "interaction",
    classes:
      "animate-initial:scale-0 animate-initial:opacity-100 animate-enter:scale-400 animate-enter:opacity-0 animate-duration-500 animate-ease-out",
    accessibility:
      "Use the ripple as a purely decorative effect and do not rely on it to communicate state.",
    adapters: ["react", "vue", "vanilla"],
    ...COMMUNITY_METADATA,
    source: source("ripple"),
  },
  {
    id: "blob-morph",
    name: "Blob morph",
    description:
      "An organic border-radius keyframe loop for fluid decorative shapes.",
    category: "loading",
    classes:
      "animate-enter:rounded-[0,30,60,30,0] animate-repeat-infinite animate-duration-3000 animate-ease-in-out animate-repeat-reverse",
    accessibility:
      "Use only for decorative elements; apply aria-hidden to prevent interference with screen readers.",
    adapters: ["react", "vue", "vanilla"],
    ...COMMUNITY_METADATA,
    source: source("blob-morph"),
  },
  {
    id: "ticker",
    name: "Ticker",
    description:
      "A stock- or news-style ticker where items enter from the right and exit to the left.",
    category: "entrance",
    classes:
      "animate-initial:x-100pct animate-enter:x-0 animate-exit:-x-100pct animate-duration-500 animate-ease-out animate-stagger-150",
    accessibility:
      "Provide a way to pause the ticker and make all content available in a static list.",
    adapters: ["react", "vue", "vanilla"],
    ...COMMUNITY_METADATA,
    source: source("ticker"),
  },
  {
    id: "popover-reveal",
    name: "Popover reveal",
    description:
      "A short downward fade-in for anchored popovers and dropdowns.",
    category: "entrance",
    classes:
      "animate-initial:opacity-0 animate-initial:y--8 animate-enter:opacity-100 animate-enter:y-0 animate-duration-180 animate-ease-out",
    accessibility:
      "Move focus into the popover on open and return it to the trigger on close.",
    adapters: ["react", "vue", "vanilla", "react-native"],
    ...COMMUNITY_METADATA,
    source: source("popover-reveal"),
  },
  {
    id: "stepper",
    name: "Stepper",
    description: "Sequential staggered entrances for step-indicator items.",
    category: "entrance",
    classes:
      "animate-initial:opacity-0 animate-initial:scale-80 animate-enter:opacity-100 animate-enter:scale-100 animate-stagger-80 animate-delay-children-100 animate-duration-200 animate-ease-back-out",
    accessibility:
      "Announce the current step and total steps; keep step content readable without animation.",
    adapters: ["react", "vue", "vanilla", "react-native"],
    ...COMMUNITY_METADATA,
    source: source("stepper"),
  },
  {
    id: "notification-stack",
    name: "Notification stack",
    description: "Staggered upward entrances for stacked notification cards.",
    category: "entrance",
    classes:
      "animate-initial:opacity-0 animate-initial:y--20 animate-enter:opacity-100 animate-enter:y-0 animate-stagger-80 animate-duration-260 animate-ease-back-out",
    accessibility:
      "Use a live region with aria-live='polite' and provide enough time to read each notification.",
    adapters: ["react", "vue", "vanilla", "react-native"],
    ...COMMUNITY_METADATA,
    source: source("notification-stack"),
  },
  {
    id: "drag-reorder",
    name: "Drag reorder",
    description:
      "Vertical drag with layout animation for reorderable list items.",
    category: "interaction",
    classes:
      "animate-drag-y animate-layout-position animate-drag:scale-102 animate-spring animate-stiffness-320 animate-damping-30",
    accessibility:
      "Provide keyboard controls for reordering and announce the new position after a drop.",
    adapters: ["react", "vue"],
    ...COMMUNITY_METADATA,
    source: source("drag-reorder"),
  },
  {
    id: "parallax-scroll",
    name: "Parallax scroll",
    description:
      "Map scroll progress to a Y translation so a layer moves at a different speed.",
    category: "scroll",
    classes: "animate-scroll:y-[-50,50] animate-scroll-container",
    accessibility:
      "Respect prefers-reduced-motion; parallax depth cues must not convey meaning exclusively.",
    adapters: ["react", "vanilla"],
    ...COMMUNITY_METADATA,
    source: source("parallax-scroll"),
  },
];

export const BUILT_IN_PRESETS = Object.fromEntries(
  MOTIONWIND_RECIPES.map((recipe) => [recipe.id, definePreset(recipe.classes)]),
) as Record<string, string>;

export function getRecipe(id: string): MotionwindRecipe | undefined {
  return MOTIONWIND_RECIPES.find((recipe) => recipe.id === id);
}
