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
];

export const BUILT_IN_PRESETS = Object.fromEntries(
  MOTIONWIND_RECIPES.map((recipe) => [recipe.id, definePreset(recipe.classes)]),
) as Record<string, string>;

export function getRecipe(id: string): MotionwindRecipe | undefined {
  return MOTIONWIND_RECIPES.find((recipe) => recipe.id === id);
}
