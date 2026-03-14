import {
  CompletionItem,
  CompletionItemKind,
  InsertTextFormat,
  MarkupKind,
} from "vscode-languageserver/node.js";

/**
 * Pre-computed completion items for all motionwind classes.
 */

// --- Gesture prefix completions ---

export const gestureCompletions: CompletionItem[] = [
  {
    label: "animate-hover:",
    kind: CompletionItemKind.Enum,
    insertText: "animate-hover:",
    insertTextFormat: InsertTextFormat.PlainText,
    detail: "whileHover gesture",
    documentation: {
      kind: MarkupKind.Markdown,
      value: "Animate while the element is hovered.\n\n**Motion prop:** `whileHover`",
    },
  },
  {
    label: "animate-tap:",
    kind: CompletionItemKind.Enum,
    insertText: "animate-tap:",
    insertTextFormat: InsertTextFormat.PlainText,
    detail: "whileTap gesture",
    documentation: {
      kind: MarkupKind.Markdown,
      value: "Animate while the element is pressed/tapped.\n\n**Motion prop:** `whileTap`",
    },
  },
  {
    label: "animate-focus:",
    kind: CompletionItemKind.Enum,
    insertText: "animate-focus:",
    insertTextFormat: InsertTextFormat.PlainText,
    detail: "whileFocus gesture",
    documentation: {
      kind: MarkupKind.Markdown,
      value: "Animate while the element is focused.\n\n**Motion prop:** `whileFocus`",
    },
  },
  {
    label: "animate-inview:",
    kind: CompletionItemKind.Enum,
    insertText: "animate-inview:",
    insertTextFormat: InsertTextFormat.PlainText,
    detail: "whileInView gesture",
    documentation: {
      kind: MarkupKind.Markdown,
      value: "Animate while the element is in the viewport.\n\n**Motion prop:** `whileInView`",
    },
  },
  {
    label: "animate-drag:",
    kind: CompletionItemKind.Enum,
    insertText: "animate-drag:",
    insertTextFormat: InsertTextFormat.PlainText,
    detail: "whileDrag gesture",
    documentation: {
      kind: MarkupKind.Markdown,
      value: "Animate while the element is being dragged.\n\n**Motion prop:** `whileDrag`",
    },
  },
  {
    label: "animate-initial:",
    kind: CompletionItemKind.Enum,
    insertText: "animate-initial:",
    insertTextFormat: InsertTextFormat.PlainText,
    detail: "initial state",
    documentation: {
      kind: MarkupKind.Markdown,
      value: "Set the initial state before animation.\n\n**Motion prop:** `initial`",
    },
  },
  {
    label: "animate-enter:",
    kind: CompletionItemKind.Enum,
    insertText: "animate-enter:",
    insertTextFormat: InsertTextFormat.PlainText,
    detail: "animate (enter) state",
    documentation: {
      kind: MarkupKind.Markdown,
      value: "Animate to this state on mount.\n\n**Motion prop:** `animate`",
    },
  },
  {
    label: "animate-exit:",
    kind: CompletionItemKind.Enum,
    insertText: "animate-exit:",
    insertTextFormat: InsertTextFormat.PlainText,
    detail: "exit state",
    documentation: {
      kind: MarkupKind.Markdown,
      value: "Animate to this state on unmount (requires AnimatePresence).\n\n**Motion prop:** `exit`",
    },
  },
];

// --- Property completions (shown after gesture prefix) ---

function propItem(
  label: string,
  snippet: string,
  detail: string,
  doc: string,
): CompletionItem {
  return {
    label,
    kind: CompletionItemKind.Property,
    insertText: snippet,
    insertTextFormat: InsertTextFormat.Snippet,
    detail,
    documentation: { kind: MarkupKind.Markdown, value: doc },
  };
}

export const propertyCompletions: CompletionItem[] = [
  // Transform
  propItem("scale-", "scale-${1:110}", "scale", "Scale transform.\n\n`scale-110` → `{ scale: 1.1 }`"),
  propItem("scale-x-", "scale-x-${1:110}", "scaleX", "Scale X axis.\n\n`scale-x-110` → `{ scaleX: 1.1 }`"),
  propItem("scale-y-", "scale-y-${1:110}", "scaleY", "Scale Y axis.\n\n`scale-y-110` → `{ scaleY: 1.1 }`"),
  propItem("scale-z-", "scale-z-${1:110}", "scaleZ", "Scale Z axis.\n\n`scale-z-110` → `{ scaleZ: 1.1 }`"),
  propItem("rotate-", "rotate-${1:45}", "rotate", "Rotation in degrees.\n\n`rotate-45` → `{ rotate: 45 }`"),
  propItem("rotate-x-", "rotate-x-${1:45}", "rotateX", "Rotate around X axis.\n\n`rotate-x-45` → `{ rotateX: 45 }`"),
  propItem("rotate-y-", "rotate-y-${1:45}", "rotateY", "Rotate around Y axis.\n\n`rotate-y-45` → `{ rotateY: 45 }`"),
  propItem("x-", "x-${1:20}", "x (translateX)", "Translate along X axis.\n\n`x-20` → `{ x: 20 }`\n\nSupports units: `x-50pct` → `\"50%\"`, `x-auto`"),
  propItem("y-", "y-${1:20}", "y (translateY)", "Translate along Y axis.\n\n`y-20` → `{ y: 20 }`"),
  propItem("z-", "z-${1:20}", "z (translateZ)", "Translate along Z axis.\n\n`z-20` → `{ z: 20 }`"),
  propItem("skew-", "skew-${1:12}", "skew", "Skew transform.\n\n`skew-12` → `{ skew: 12 }`"),
  propItem("skew-x-", "skew-x-${1:12}", "skewX", "Skew X axis.\n\n`skew-x-12` → `{ skewX: 12 }`"),
  propItem("skew-y-", "skew-y-${1:12}", "skewY", "Skew Y axis.\n\n`skew-y-12` → `{ skewY: 12 }`"),
  propItem("origin-x-", "origin-x-${1:50}", "originX", "Transform origin X (0-100).\n\n`origin-x-50` → `{ originX: 0.5 }`"),
  propItem("origin-y-", "origin-y-${1:50}", "originY", "Transform origin Y (0-100).\n\n`origin-y-50` → `{ originY: 0.5 }`"),
  propItem("origin-z-", "origin-z-${1:100}", "originZ", "Transform origin Z.\n\n`origin-z-100` → `{ originZ: 100 }`"),
  propItem("perspective-", "perspective-${1:800}", "perspective", "3D perspective.\n\n`perspective-800` → `{ perspective: 800 }`"),

  // Visual
  propItem("opacity-", "opacity-${1:0}", "opacity", "Opacity (0-100).\n\n`opacity-0` → `{ opacity: 0 }`"),
  propItem("blur-", "blur-${1:10}", "filter: blur", "Blur filter.\n\n`blur-10` → `{ filter: \"blur(10px)\" }`"),
  propItem("brightness-", "brightness-${1:150}", "filter: brightness", "Brightness filter.\n\n`brightness-150` → `{ filter: \"brightness(1.5)\" }`"),
  propItem("contrast-", "contrast-${1:150}", "filter: contrast", "Contrast filter.\n\n`contrast-150` → `{ filter: \"contrast(1.5)\" }`"),
  propItem("saturate-", "saturate-${1:150}", "filter: saturate", "Saturate filter.\n\n`saturate-150` → `{ filter: \"saturate(1.5)\" }`"),
  propItem("backdrop-blur-", "backdrop-blur-${1:10}", "backdropFilter: blur", "Backdrop blur.\n\n`backdrop-blur-10` → `{ backdropFilter: \"blur(10px)\" }`"),

  // Dimensions
  propItem("w-", "w-${1:100}", "width", "Width.\n\n`w-100` → `{ width: 100 }`\n\nSupports: `w-auto`, `w-50pct`"),
  propItem("h-", "h-${1:100}", "height", "Height.\n\n`h-100` → `{ height: 100 }`"),
  propItem("rounded-", "rounded-${1:8}", "borderRadius", "Border radius.\n\n`rounded-8` → `{ borderRadius: 8 }`"),

  // Position
  propItem("top-", "top-${1:0}", "top", "Top position.\n\n`top-0` → `{ top: 0 }`"),
  propItem("left-", "left-${1:0}", "left", "Left position.\n\n`left-0` → `{ left: 0 }`"),
  propItem("right-", "right-${1:0}", "right", "Right position.\n\n`right-0` → `{ right: 0 }`"),
  propItem("bottom-", "bottom-${1:0}", "bottom", "Bottom position.\n\n`bottom-0` → `{ bottom: 0 }`"),

  // Spacing
  propItem("p-", "p-${1:16}", "padding", "Padding.\n\n`p-16` → `{ padding: 16 }`"),
  propItem("m-", "m-${1:16}", "margin", "Margin.\n\n`m-16` → `{ margin: 16 }`"),
  propItem("gap-", "gap-${1:8}", "gap", "Gap.\n\n`gap-8` → `{ gap: 8 }`"),

  // Typography
  propItem("text-size-", "text-size-${1:16}", "fontSize", "Font size.\n\n`text-size-16` → `{ fontSize: 16 }`"),
  propItem("tracking-", "tracking-${1:2}", "letterSpacing", "Letter spacing.\n\n`tracking-2` → `{ letterSpacing: 2 }`"),
  propItem("leading-", "leading-${1:24}", "lineHeight", "Line height.\n\n`leading-24` → `{ lineHeight: 24 }`"),

  // Border
  propItem("border-w-", "border-w-${1:2}", "borderWidth", "Border width.\n\n`border-w-2` → `{ borderWidth: 2 }`"),

  // Color
  propItem("bg-#", "bg-#${1:000000}", "backgroundColor", "Background color.\n\n`bg-#ff0000` → `{ backgroundColor: \"#ff0000\" }`"),
  propItem("text-#", "text-#${1:000000}", "color", "Text color.\n\n`text-#ff0000` → `{ color: \"#ff0000\" }`"),
  propItem("border-#", "border-#${1:000000}", "borderColor", "Border color.\n\n`border-#ff0000` → `{ borderColor: \"#ff0000\" }`"),

  // SVG
  propItem("path-length-", "path-length-${1:1}", "pathLength", "SVG path length.\n\n`path-length-1` → `{ pathLength: 1 }`"),
  propItem("path-offset-", "path-offset-${1:0}", "pathOffset", "SVG path offset.\n\n`path-offset-0` → `{ pathOffset: 0 }`"),
  propItem("path-spacing-", "path-spacing-${1:1}", "pathSpacing", "SVG path spacing.\n\n`path-spacing-1` → `{ pathSpacing: 1 }`"),

  // Arbitrary
  propItem("[=]", "[${1:key}=${2:value}]", "arbitrary value", "Arbitrary CSS property.\n\n`[key=value]` → `{ key: value }`"),

  // Keyframe array
  propItem("scale-[,]", "scale-[${1:100,110,100}]", "keyframe array", "Keyframe array.\n\n`scale-[100,110,100]` → `{ scale: [1, 1.1, 1] }`"),
];

// --- Transition config completions ---

function configItem(
  label: string,
  snippet: string,
  detail: string,
  doc: string,
): CompletionItem {
  return {
    label: `animate-${label}`,
    kind: CompletionItemKind.Value,
    insertText: `animate-${snippet}`,
    insertTextFormat: InsertTextFormat.Snippet,
    detail,
    documentation: { kind: MarkupKind.Markdown, value: doc },
  };
}

export const transitionCompletions: CompletionItem[] = [
  configItem("duration-", "duration-${1:300}", "transition duration", "Duration in ms.\n\n`animate-duration-300` → `transition: { duration: 0.3 }`"),
  configItem("delay-", "delay-${1:100}", "transition delay", "Delay in ms.\n\n`animate-delay-100` → `transition: { delay: 0.1 }`"),
  configItem("delay-children-", "delay-children-${1:100}", "stagger delay for children", "Delay before children start.\n\n`animate-delay-children-100` → `transition: { delayChildren: 0.1 }`"),
  configItem("ease-in", "ease-in", "easeIn", "Ease in curve.\n\n`animate-ease-in` → `transition: { ease: \"easeIn\" }`"),
  configItem("ease-out", "ease-out", "easeOut", "Ease out curve.\n\n`animate-ease-out` → `transition: { ease: \"easeOut\" }`"),
  configItem("ease-in-out", "ease-in-out", "easeInOut", "Ease in-out curve.\n\n`animate-ease-in-out` → `transition: { ease: \"easeInOut\" }`"),
  configItem("ease-linear", "ease-linear", "linear", "Linear easing.\n\n`animate-ease-linear` → `transition: { ease: \"linear\" }`"),
  configItem("ease-circ-in", "ease-circ-in", "circIn", "Circular ease in.\n\n`animate-ease-circ-in` → `transition: { ease: \"circIn\" }`"),
  configItem("ease-circ-out", "ease-circ-out", "circOut", "Circular ease out."),
  configItem("ease-circ-in-out", "ease-circ-in-out", "circInOut", "Circular ease in-out."),
  configItem("ease-back-in", "ease-back-in", "backIn", "Back ease in (overshoot)."),
  configItem("ease-back-out", "ease-back-out", "backOut", "Back ease out (overshoot)."),
  configItem("ease-back-in-out", "ease-back-in-out", "backInOut", "Back ease in-out."),
  configItem("ease-anticipate", "ease-anticipate", "anticipate", "Anticipate easing."),
  configItem("ease-steps-", "ease-steps-${1:4}", "stepped easing", "Stepped easing.\n\n`animate-ease-steps-4` → `transition: { ease: \"steps(4)\" }`"),
  configItem("ease-[,,,]", "ease-[${1:0.42},${2:0},${3:0.58},${4:1}]", "custom cubic-bezier", "Custom cubic-bezier.\n\n`animate-ease-[0.42,0,0.58,1]` → `transition: { ease: [0.42, 0, 0.58, 1] }`"),
  configItem("spring", "spring", "spring physics", "Spring animation.\n\n`animate-spring` → `transition: { type: \"spring\" }`"),
  configItem("stiffness-", "stiffness-${1:100}", "spring stiffness", "Spring stiffness.\n\n`animate-stiffness-100` → `transition: { stiffness: 100 }`"),
  configItem("damping-", "damping-${1:10}", "spring damping", "Spring damping.\n\n`animate-damping-10` → `transition: { damping: 10 }`"),
  configItem("bounce-", "bounce-${1:25}", "spring bounce", "Bounce (0-100).\n\n`animate-bounce-25` → `transition: { bounce: 0.25 }`"),
  configItem("mass-", "mass-${1:10}", "spring mass", "Mass (in tenths).\n\n`animate-mass-10` → `transition: { mass: 1 }`"),
  configItem("repeat-", "repeat-${1:2}", "repeat count", "Repeat count.\n\n`animate-repeat-2` → `transition: { repeat: 2 }`"),
  configItem("repeat-infinite", "repeat-infinite", "infinite repeat", "Repeat forever.\n\n`animate-repeat-infinite` → `transition: { repeat: Infinity }`"),
  configItem("repeat-reverse", "repeat-reverse", "reverse repeat", "Reverse on repeat.\n\n→ `transition: { repeatType: \"reverse\" }`"),
  configItem("repeat-mirror", "repeat-mirror", "mirror repeat", "Mirror on repeat.\n\n→ `transition: { repeatType: \"mirror\" }`"),
  configItem("repeat-delay-", "repeat-delay-${1:500}", "repeat delay", "Delay between repeats.\n\n`animate-repeat-delay-500` → `transition: { repeatDelay: 0.5 }`"),
  configItem("stagger-", "stagger-${1:50}", "stagger children", "Stagger children timing.\n\n`animate-stagger-50` → `transition: { staggerChildren: 0.05 }`"),
  configItem("stagger-reverse", "stagger-reverse", "reverse stagger", "Reverse stagger direction.\n\n→ `transition: { staggerDirection: -1 }`"),
  configItem("when-before", "when-before", "animate before children", "Animate parent before children.\n\n→ `transition: { when: \"beforeChildren\" }`"),
  configItem("when-after", "when-after", "animate after children", "Animate parent after children.\n\n→ `transition: { when: \"afterChildren\" }`"),
  configItem("rest-speed-", "rest-speed-${1:2}", "rest speed threshold", "Spring rest speed.\n\n`animate-rest-speed-2` → `transition: { restSpeed: 2 }`"),
  configItem("rest-delta-", "rest-delta-${1:1}", "rest delta threshold", "Spring rest delta.\n\n`animate-rest-delta-1` → `transition: { restDelta: 1 }`"),
  configItem("times-[,]", "times-[${1:0,0.5,1}]", "keyframe times", "Keyframe timing array.\n\n`animate-times-[0,0.5,1]` → `transition: { times: [0, 0.5, 1] }`"),
];

// --- Viewport config completions ---

export const viewportCompletions: CompletionItem[] = [
  configItem("once", "once", "trigger once", "Only trigger animation once.\n\n`animate-once` → `viewport: { once: true }`"),
  configItem("amount-all", "amount-all", "full visibility", "Require full element visibility.\n\n`animate-amount-all` → `viewport: { amount: \"all\" }`"),
  configItem("amount-", "amount-${1:50}", "visibility amount", "Required visibility (0-100).\n\n`animate-amount-50` → `viewport: { amount: 0.5 }`"),
  configItem("margin-", "margin-${1:100}", "viewport margin", "Viewport margin in px.\n\n`animate-margin-100` → `viewport: { margin: \"100px\" }`"),
];

// --- Drag config completions ---

export const dragCompletions: CompletionItem[] = [
  configItem("drag-x", "drag-x", "drag horizontal", "Enable horizontal dragging.\n\n`animate-drag-x` → `drag=\"x\"`"),
  configItem("drag-y", "drag-y", "drag vertical", "Enable vertical dragging.\n\n`animate-drag-y` → `drag=\"y\"`"),
  configItem("drag-both", "drag-both", "drag both axes", "Enable dragging on both axes.\n\n`animate-drag-both` → `drag={true}`"),
  configItem("drag-elastic-", "drag-elastic-${1:50}", "drag elasticity", "Drag elasticity (0-100).\n\n`animate-drag-elastic-50` → `dragElastic={0.5}`"),
  configItem("drag-snap", "drag-snap", "snap to origin", "Snap back to origin.\n\n`animate-drag-snap` → `dragSnapToOrigin={true}`"),
  configItem("drag-no-momentum", "drag-no-momentum", "disable momentum", "Disable momentum.\n\n`animate-drag-no-momentum` → `dragMomentum={false}`"),
  configItem("drag-lock", "drag-lock", "direction lock", "Lock drag to one direction.\n\n`animate-drag-lock` → `dragDirectionLock={true}`"),
  configItem("drag-constraint-t-", "drag-constraint-t-${1:0}", "top constraint", "Top drag constraint.\n\n`animate-drag-constraint-t-0` → `dragConstraints: { top: 0 }`"),
  configItem("drag-constraint-l-", "drag-constraint-l-${1:0}", "left constraint", "Left drag constraint."),
  configItem("drag-constraint-r-", "drag-constraint-r-${1:0}", "right constraint", "Right drag constraint."),
  configItem("drag-constraint-b-", "drag-constraint-b-${1:0}", "bottom constraint", "Bottom drag constraint."),
];

// --- Layout config completions ---

export const layoutCompletions: CompletionItem[] = [
  configItem("layout", "layout", "layout animation", "Enable layout animation.\n\n`animate-layout` → `layout={true}`"),
  configItem("layout-position", "layout-position", "position layout", "Animate only position.\n\n`animate-layout-position` → `layout=\"position\"`"),
  configItem("layout-size", "layout-size", "size layout", "Animate only size.\n\n`animate-layout-size` → `layout=\"size\"`"),
  configItem("layout-preserve", "layout-preserve", "preserve aspect", "Preserve aspect ratio.\n\n`animate-layout-preserve` → `layout=\"preserve-aspect\"`"),
  configItem("layout-scroll", "layout-scroll", "layout scroll", "Enable layout scroll.\n\n`animate-layout-scroll` → `layoutScroll={true}`"),
  configItem("layout-root", "layout-root", "layout root", "Mark as layout root.\n\n`animate-layout-root` → `layoutRoot={true}`"),
  configItem("layout-id-", "layout-id-${1:name}", "layout ID", "Shared layout ID.\n\n`animate-layout-id-hero` → `layoutId=\"hero\"`"),
];

/** All config completions combined (transition + viewport + drag + layout) */
export const allConfigCompletions: CompletionItem[] = [
  ...transitionCompletions,
  ...viewportCompletions,
  ...dragCompletions,
  ...layoutCompletions,
];
