export interface SidebarItem {
  title: string;
  url: string;
}

export interface SidebarGroup {
  title: string;
  items: SidebarItem[];
}

export interface SidebarSection {
  gettingStarted: SidebarGroup[];
  animations: SidebarGroup[];
  reference: SidebarGroup[];
}

export const PLAYGROUND_SIDEBAR: SidebarSection = {
  gettingStarted: [
    {
      title: "Getting Started",
      items: [
        { title: "Introduction", url: "/playground" },
        { title: "Installation", url: "/playground/installation" },
        { title: "Quick Start", url: "/playground/quick-start" },
      ],
    },
  ],
  animations: [
    {
      title: "Gestures",
      items: [
        { title: "Hover & Tap", url: "/playground/hover-tap" },
        { title: "Focus", url: "/playground/focus" },
        { title: "Drag", url: "/playground/drag" },
      ],
    },
    {
      title: "Transitions",
      items: [
        { title: "Spring Physics", url: "/playground/spring" },
        { title: "Duration & Easing", url: "/playground/duration" },
        { title: "Stiffness & Damping", url: "/playground/stiffness-damping" },
      ],
    },
    {
      title: "Scroll & View",
      items: [
        { title: "Scroll Reveal", url: "/playground/scroll-reveal" },
        { title: "In View", url: "/playground/in-view" },
        { title: "Once", url: "/playground/once" },
      ],
    },
    {
      title: "Enter & Exit",
      items: [
        { title: "Initial State", url: "/playground/initial" },
        { title: "Enter Animation", url: "/playground/enter" },
        { title: "Exit Animation", url: "/playground/exit" },
      ],
    },
    {
      title: "Layout",
      items: [
        { title: "Layout Animation", url: "/playground/layout" },
        { title: "Shared Layout", url: "/playground/shared-layout" },
        { title: "Animate Presence", url: "/playground/animate-presence" },
      ],
    },
  ],
  reference: [
    {
      title: "Reference",
      items: [
        { title: "All Prefixes", url: "/playground/prefixes" },
        { title: "All Properties", url: "/playground/properties" },
        { title: "Arbitrary Values", url: "/playground/arbitrary" },
      ],
    },
    {
      title: "Frameworks",
      items: [
        { title: "React", url: "/playground/frameworks/react" },
        { title: "Vue", url: "/playground/frameworks/vue" },
        { title: "Vanilla JS", url: "/playground/frameworks/vanilla" },
        { title: "React Native", url: "/playground/frameworks/react-native" },
      ],
    },
    {
      title: "Setup",
      items: [
        { title: "Next.js", url: "/playground/setup/nextjs" },
        { title: "Vite", url: "/playground/setup/vite" },
        { title: "Webpack", url: "/playground/setup/webpack" },
      ],
    },
  ],
};
