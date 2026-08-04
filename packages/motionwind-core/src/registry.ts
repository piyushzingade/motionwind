import type { GestureKey } from "./types.js";

export type SyntaxCategory =
  | "gesture"
  | "property"
  | "transition"
  | "viewport"
  | "scroll"
  | "drag"
  | "layout"
  | "variant"
  | "preset"
  | "modifier";

export type Platform = "react" | "vue" | "vanilla" | "react-native";

/** Machine-readable syntax metadata shared by docs, editors and diagnostics. */
export interface SyntaxDefinition {
  id: string;
  category: SyntaxCategory;
  label: string;
  snippet: string;
  description: string;
  motionKey?: string;
  platforms?: Platform[];
}

const ALL: Platform[] = ["react", "vue", "vanilla", "react-native"];
const WEB: Platform[] = ["react", "vue", "vanilla"];

const gesture = (
  id: string,
  motionKey: GestureKey,
  description: string,
): SyntaxDefinition => ({
  id: `gesture.${id}`,
  category: "gesture",
  label: `animate-${id}:`,
  snippet: `animate-${id}:`,
  description,
  motionKey,
  platforms: ALL,
});

export const GESTURE_DEFINITIONS = [
  gesture("hover", "whileHover", "Animate while an element is hovered."),
  gesture("tap", "whileTap", "Animate while an element is pressed."),
  gesture("focus", "whileFocus", "Animate while an element has focus."),
  gesture("inview", "whileInView", "Animate while an element is in view."),
  gesture("drag", "whileDrag", "Animate while an element is dragged."),
  gesture("initial", "initial", "Set the state before an animation begins."),
  gesture("enter", "animate", "Animate to a state when an element enters."),
  gesture("exit", "exit", "Animate to a state when an element exits."),
] as const satisfies readonly SyntaxDefinition[];

/**
 * Modifier prefixes that wrap an inner class token and control conditional
 * application based on the user's motion preference media query.
 */
export const MODIFIER_DEFINITIONS: readonly SyntaxDefinition[] = [
  {
    id: "modifier.motion-reduce",
    category: "modifier",
    label: "motion-reduce:",
    snippet: "motion-reduce:",
    description:
      "Apply the wrapped class only when `prefers-reduced-motion: reduce` is active.",
    platforms: WEB,
  },
  {
    id: "modifier.motion-safe",
    category: "modifier",
    label: "motion-safe:",
    snippet: "motion-safe:",
    description:
      "Apply the wrapped class only when `prefers-reduced-motion: no-preference` is active.",
    platforms: WEB,
  },
];

const property = (
  label: string,
  snippet: string,
  motionKey: string,
  description: string,
  platforms: Platform[] = ALL,
): SyntaxDefinition => ({
  id: `property.${label.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "")}`,
  category: "property",
  label,
  snippet,
  motionKey,
  description,
  platforms,
});

export const PROPERTY_DEFINITIONS = [
  property(
    "scale-",
    "scale-${1:110}",
    "scale",
    "Scale (100 is the resting value).",
  ),
  property("scale-x-", "scale-x-${1:110}", "scaleX", "Scale on the x axis."),
  property("scale-y-", "scale-y-${1:110}", "scaleY", "Scale on the y axis."),
  property(
    "scale-z-",
    "scale-z-${1:110}",
    "scaleZ",
    "Scale on the z axis.",
    WEB,
  ),
  property("rotate-", "rotate-${1:45}", "rotate", "Rotate in degrees."),
  property(
    "rotate-x-",
    "rotate-x-${1:45}",
    "rotateX",
    "Rotate around the x axis.",
  ),
  property(
    "rotate-y-",
    "rotate-y-${1:45}",
    "rotateY",
    "Rotate around the y axis.",
  ),
  property("x-", "x-${1:20}", "x", "Translate on the x axis."),
  property("y-", "y-${1:20}", "y", "Translate on the y axis."),
  property("z-", "z-${1:20}", "z", "Translate on the z axis.", WEB),
  // z-{0,10,20,30,40,50,auto} maps to zIndex (Tailwind-standard values)
  {
    id: "property.z-zIndex",
    category: "property",
    label: "z-",
    snippet: "z-${1|0,10,20,30,40,50,auto|}",
    motionKey: "zIndex",
    description:
      "Animate z-index (Tailwind values: 0, 10, 20, 30, 40, 50, auto). Non-standard values translate on the z axis instead.",
    platforms: WEB,
  },
  property("skew-x-", "skew-x-${1:12}", "skewX", "Skew on the x axis."),
  property("skew-y-", "skew-y-${1:12}", "skewY", "Skew on the y axis."),
  property(
    "origin-x-",
    "origin-x-${1:50}",
    "originX",
    "Set the x transform origin.",
    WEB,
  ),
  property(
    "origin-y-",
    "origin-y-${1:50}",
    "originY",
    "Set the y transform origin.",
    WEB,
  ),
  property(
    "perspective-",
    "perspective-${1:800}",
    "perspective",
    "Set 3D perspective.",
    WEB,
  ),
  property("opacity-", "opacity-${1:0}", "opacity", "Animate opacity (0–100)."),
  property("blur-", "blur-${1:10}", "filter", "Animate CSS blur.", WEB),
  property(
    "brightness-",
    "brightness-${1:120}",
    "filter",
    "Animate CSS brightness.",
    WEB,
  ),
  property(
    "contrast-",
    "contrast-${1:120}",
    "filter",
    "Animate CSS contrast.",
    WEB,
  ),
  property(
    "saturate-",
    "saturate-${1:120}",
    "filter",
    "Animate CSS saturation.",
    WEB,
  ),
  property(
    "grayscale-",
    "grayscale-${1:100}",
    "filter",
    "Animate CSS grayscale.",
    WEB,
  ),
  property(
    "backdrop-blur-",
    "backdrop-blur-${1:10}",
    "backdropFilter",
    "Animate backdrop blur.",
    WEB,
  ),
  property("w-", "w-${1:100}", "width", "Animate width."),
  property("h-", "h-${1:100}", "height", "Animate height."),
  property(
    "rounded-",
    "rounded-${1:12}",
    "borderRadius",
    "Animate border radius.",
  ),
  property(
    "rounded-tl-",
    "rounded-tl-${1:12}",
    "borderTopLeftRadius",
    "Animate top-left border radius.",
  ),
  property(
    "rounded-tr-",
    "rounded-tr-${1:12}",
    "borderTopRightRadius",
    "Animate top-right border radius.",
  ),
  property(
    "rounded-bl-",
    "rounded-bl-${1:12}",
    "borderBottomLeftRadius",
    "Animate bottom-left border radius.",
  ),
  property(
    "rounded-br-",
    "rounded-br-${1:12}",
    "borderBottomRightRadius",
    "Animate bottom-right border radius.",
  ),
  property("top-", "top-${1:0}", "top", "Animate top position."),
  property("left-", "left-${1:0}", "left", "Animate left position."),
  property("right-", "right-${1:0}", "right", "Animate right position."),
  property("bottom-", "bottom-${1:0}", "bottom", "Animate bottom position."),
  property("p-", "p-${1:16}", "padding", "Animate padding."),
  property("m-", "m-${1:16}", "margin", "Animate margin."),
  property("gap-", "gap-${1:8}", "gap", "Animate gap."),
  property("text-size-", "text-size-${1:16}", "fontSize", "Animate font size."),
  property(
    "tracking-",
    "tracking-${1:1}",
    "letterSpacing",
    "Animate letter spacing.",
  ),
  property("leading-", "leading-${1:24}", "lineHeight", "Animate line height."),
  property(
    "border-w-",
    "border-w-${1:2}",
    "borderWidth",
    "Animate border width.",
  ),
  property(
    "bg-#",
    "bg-#${1:c8ff2e}",
    "backgroundColor",
    "Animate background color.",
  ),
  property("text-#", "text-#${1:ffffff}", "color", "Animate text color."),
  property(
    "border-#",
    "border-#${1:c8ff2e}",
    "borderColor",
    "Animate border color.",
  ),
  property(
    "path-length-",
    "path-length-${1:1}",
    "pathLength",
    "Animate SVG path length.",
    WEB,
  ),
  property(
    "text-shadow-[",
    "text-shadow-[${1:value}]",
    "textShadow",
    "Animate text shadow (arbitrary value; underscores become spaces).",
    WEB,
  ),
  property(
    "[=]",
    "[${1:property}=${2:value}]",
    "arbitrary",
    "Animate an allow-listed arbitrary value.",
    WEB,
  ),
] as const satisfies readonly SyntaxDefinition[];

const config = (
  category: Exclude<SyntaxCategory, "gesture" | "property">,
  label: string,
  snippet: string,
  description: string,
  platforms: Platform[] = ALL,
): SyntaxDefinition => ({
  id: `${category}.${label}`,
  category,
  label: `animate-${label}`,
  snippet: `animate-${snippet}`,
  description,
  platforms,
});

export const CONFIG_DEFINITIONS = [
  config(
    "transition",
    "duration-",
    "duration-${1:300}",
    "Duration in milliseconds.",
  ),
  config("transition", "delay-", "delay-${1:100}", "Delay in milliseconds."),
  config("transition", "ease-in", "ease-in", "Ease into the animation."),
  config("transition", "ease-out", "ease-out", "Ease out of the animation."),
  config("transition", "ease-in-out", "ease-in-out", "Ease in and out."),
  config("transition", "ease-linear", "ease-linear", "Use linear easing."),
  config("transition", "spring", "spring", "Use spring physics."),
  config("transition", "stiffness-", "stiffness-${1:300}", "Spring stiffness."),
  config("transition", "damping-", "damping-${1:24}", "Spring damping."),
  config("transition", "bounce-", "bounce-${1:20}", "Spring bounce (0–100)."),
  config("transition", "mass-", "mass-${1:10}", "Spring mass in tenths."),
  config("transition", "repeat-", "repeat-${1:2}", "Repeat count."),
  config("transition", "repeat-infinite", "repeat-infinite", "Repeat forever."),
  config(
    "transition",
    "repeat-reverse",
    "repeat-reverse",
    "Reverse each repetition.",
  ),
  config(
    "transition",
    "stagger-",
    "stagger-${1:60}",
    "Stagger children in milliseconds.",
  ),
  config(
    "transition",
    "delay-children-",
    "delay-children-${1:100}",
    "Delay child animations.",
  ),
  config("viewport", "once", "once", "Run an in-view animation once."),
  config("viewport", "amount-", "amount-${1:50}", "Required visible amount."),
  config(
    "viewport",
    "margin-",
    "margin-${1:100}",
    "Viewport margin in pixels.",
  ),
  config(
    "scroll",
    "scroll-axis-x",
    "scroll-axis-x",
    "Use horizontal scroll progress.",
    WEB,
  ),
  config(
    "scroll",
    "scroll-container",
    "scroll-container",
    "Track the page scroll container.",
    WEB,
  ),
  config("drag", "drag-x", "drag-x", "Enable horizontal drag.", [
    "react",
    "vue",
    "react-native",
  ]),
  config("drag", "drag-y", "drag-y", "Enable vertical drag.", [
    "react",
    "vue",
    "react-native",
  ]),
  config("drag", "drag-both", "drag-both", "Enable drag on both axes.", [
    "react",
    "vue",
    "react-native",
  ]),
  config(
    "drag",
    "drag-elastic-",
    "drag-elastic-${1:50}",
    "Set drag elasticity.",
    ["react", "vue", "react-native"],
  ),
  config("drag", "drag-snap", "drag-snap", "Snap drag to its origin.", [
    "react",
    "vue",
    "react-native",
  ]),
  config("layout", "layout", "layout", "Animate layout changes.", [
    "react",
    "vue",
  ]),
  config(
    "layout",
    "layout-position",
    "layout-position",
    "Animate layout position.",
    ["react", "vue"],
  ),
  config("layout", "layout-size", "layout-size", "Animate layout size.", [
    "react",
    "vue",
  ]),
  config(
    "layout",
    "layout-id-",
    "layout-id-${1:shared}",
    "Set a shared layout id.",
    ["react", "vue"],
  ),
  config(
    "variant",
    "from-",
    "from-${1:hidden}",
    "Select the initial named variant.",
    ["react", "vue", "react-native"],
  ),
  config(
    "variant",
    "to-",
    "to-${1:visible}",
    "Select the active named variant.",
    ["react", "vue", "react-native"],
  ),
  config(
    "preset",
    "preset-",
    "preset-${1:button-press}",
    "Apply a configured animation preset.",
  ),
] as const satisfies readonly SyntaxDefinition[];

export const MOTIONWIND_SYNTAX_REGISTRY: readonly SyntaxDefinition[] = [
  ...GESTURE_DEFINITIONS,
  ...MODIFIER_DEFINITIONS,
  ...PROPERTY_DEFINITIONS,
  ...CONFIG_DEFINITIONS,
];

export const GESTURE_MAP = Object.fromEntries(
  GESTURE_DEFINITIONS.map((definition) => [
    definition.label.slice("animate-".length, -1),
    definition.motionKey,
  ]),
) as Record<string, GestureKey>;

export const GESTURE_KEYS = new Set(Object.keys(GESTURE_MAP));

export const EASING_MAP: Record<string, string> = {
  "ease-in": "easeIn",
  "ease-out": "easeOut",
  "ease-in-out": "easeInOut",
  "ease-linear": "linear",
  "ease-circ-in": "circIn",
  "ease-circ-out": "circOut",
  "ease-circ-in-out": "circInOut",
  "ease-back-in": "backIn",
  "ease-back-out": "backOut",
  "ease-back-in-out": "backInOut",
  "ease-anticipate": "anticipate",
};

export function getSyntaxDefinitions(
  category?: SyntaxCategory,
): readonly SyntaxDefinition[] {
  return category
    ? MOTIONWIND_SYNTAX_REGISTRY.filter(
        (definition) => definition.category === category,
      )
    : MOTIONWIND_SYNTAX_REGISTRY;
}
