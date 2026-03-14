import type { ReactNode } from "react";

interface SidebarItem {
  title: string;
  url: string;
  icon?: ReactNode;
}

interface SidebarGroup {
  title: string;
  items: SidebarItem[];
}

export interface SidebarConfig {
  gettingStarted: SidebarGroup[];
  animations: SidebarGroup[];
  reference: SidebarGroup[];
}

export const SIDEBAR_ITEMS: SidebarConfig = {
  gettingStarted: [
    {
      title: "Getting Started",
      items: [
        { title: "Introduction", url: "/docs" },
        { title: "Getting Started", url: "/docs/getting-started" },
        { title: "Installation", url: "/docs/installation" },
        { title: "Syntax", url: "/docs/syntax" },
      ],
    },
  ],
  animations: [
    {
      title: "Animations",
      items: [
        { title: "Basic Properties", url: "/docs/animations/basic-properties" },
        { title: "Transforms", url: "/docs/animations/transforms" },
        { title: "Gestures", url: "/docs/animations/gestures" },
        { title: "Scroll", url: "/docs/animations/scroll" },
        { title: "Enter & Exit", url: "/docs/animations/enter-exit" },
        { title: "Physics", url: "/docs/animations/physics" },
        { title: "Keyframes", url: "/docs/animations/keyframes" },
        { title: "Layout", url: "/docs/animations/layout" },
        { title: "Variants", url: "/docs/animations/variants" },
        { title: "SVG", url: "/docs/animations/svg" },
        { title: "Drag", url: "/docs/animations/drag" },
        { title: "Advanced Effects", url: "/docs/animations/advanced-effects" },
      ],
    },
  ],
  reference: [
    {
      title: "Reference",
      items: [
        { title: "API", url: "/docs/api" },
        { title: "Framework Setup", url: "/docs/framework-setup" },
        { title: "LLM Documentation", url: "/docs/llms" },
      ],
    },
  ],
};
