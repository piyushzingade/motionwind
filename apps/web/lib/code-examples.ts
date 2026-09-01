export const CODE_EXAMPLES = {
  hover: {
    title: "Hover & Tap",
    file: "Button.tsx",
    code: `// Spring-powered button
<button
  className="
    animate-hover:scale-110
    animate-tap:scale-95
    animate-spring
    rounded-xl bg-white px-6 py-3
  "
>
  Click me
</button>`,
  },
  scroll: {
    title: "Scroll Reveal",
    file: "Section.tsx",
    code: `// Fades in when scrolled into view
<div
  className="
    animate-initial:opacity-0
    animate-initial:y-20
    animate-inview:opacity-100
    animate-inview:y-0
    animate-duration-500
    animate-once
    p-6 rounded-xl
  "
>
  Hello world
</div>`,
  },
  spring: {
    title: "Spring Physics",
    file: "Card.tsx",
    code: `// Fine-tune physical motion
<Card
  className="
    animate-hover:rotate-6
    animate-hover:scale-110
    animate-spring
    animate-stiffness-200
    animate-damping-10
  "
>
  Bouncy card
</Card>`,
  },
  drag: {
    title: "Draggable",
    file: "DragBox.tsx",
    code: `// Drag with elastic snap-back
<div
  className="
    animate-drag-both
    animate-drag-elastic-30
    animate-drag-snap
    animate-hover:scale-105
    w-24 h-24 rounded-2xl
  "
>
  Drag me
</div>`,
  },
  loop: {
    title: "Infinite Loop",
    file: "Loader.tsx",
    code: `// Continuous spinning loader
<div
  className="
    animate-initial:rotate-0
    animate-enter:rotate-360
    animate-duration-2000
    animate-ease-linear
    animate-repeat-infinite
    w-10 h-10
  "
/>`,
  },
  component: {
    title: "Custom Component",
    file: "App.tsx",
    code: `// Works on any component — no mw.* needed
import { Card } from "@/ui/card"

<Card
  className="
    animate-hover:scale-105
    animate-tap:scale-95
    animate-spring
    p-6 rounded-2xl
  "
>
  shadcn, custom, anything.
</Card>`,
  },
  template: {
    title: "Template Literals",
    file: "List.tsx",
    code: `// Dynamic + static classes in one string
<div
  className={\`
    animate-initial:opacity-0
    animate-enter:opacity-100
    animate-duration-500
    \${isActive ? "bg-amber-500" : "bg-gray-800"}
    p-4 rounded-lg
  \`}
>
  {item.name}
</div>`,
  },
  compiled: {
    title: "Compiled Output",
    file: "output.js",
    code: `// What ships to production — zero parsing
import { motion } from "motion/react"

<motion.div
  className="p-4 rounded-lg"
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  viewport={{ once: true }}
>
  Hello world
</motion.div>`,
  },
  nextjs: {
    title: "Next.js Setup",
    file: "next.config.js",
    code: `// One line to configure
import withMotionwind from "motionwind-react/next"

export default withMotionwind({
  // your existing Next.js config
})

// Works with both Turbopack and webpack
// No --webpack flag needed`,
  },
  vite: {
    title: "Vite Setup",
    file: "vite.config.ts",
    code: `// Add before react() in plugins
import motionwind from "motionwind-react/vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [
    motionwind(),
    react()
  ]
})`,
  },
  syntax: {
    title: "Syntax Pattern",
    file: "examples.tsx",
    code: `// The universal pattern
// animate-{gesture}:{property}-{value}

// Gestures: hover, tap, focus, inview,
//           drag, initial, enter, exit

// Hover effect
<div className="animate-hover:scale-110" />

// Scroll reveal
<div className="
  animate-initial:opacity-0
  animate-inview:opacity-100
  animate-once
" />

// Exit animation
<div className="animate-exit:x-100pct" />`,
  },
  features: {
    title: "All Features",
    file: "features.tsx",
    code: `// Spring physics
<div className="
  animate-spring
  animate-stiffness-400
  animate-damping-15
  animate-bounce-20
" />

// Drag with constraints
<div className="
  animate-drag-both
  animate-drag-elastic-30
  animate-drag-snap
" />

// Keyframe arrays
<div className="
  animate-enter:scale-[100,120,100]
  animate-repeat-infinite
" />

// Arbitrary values
<div className="
  animate-hover:[backgroundColor=#4f46e5]
" />`,
  },
} as const;

export type CodeKey = keyof typeof CODE_EXAMPLES;
