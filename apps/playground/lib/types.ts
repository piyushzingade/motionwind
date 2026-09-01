import { MOTIONWIND_RECIPES } from "motionwind-react";

export type Target = "react" | "vue" | "javascript" | "react-native";
export type StageSize = "phone" | "tablet" | "desktop";

export interface StudioState {
  classes: string;
  tag: string;
  text: string;
  target: Target;
}

export const TAGS = ["div", "button", "span", "a", "section"] as const;

export const TARGETS: { id: Target; label: string }[] = [
  { id: "react", label: "React" },
  { id: "vue", label: "Vue" },
  { id: "javascript", label: "JavaScript" },
  { id: "react-native", label: "Native" },
];

export const STAGES: { id: StageSize; label: string; width: number }[] = [
  { id: "phone", label: "S", width: 340 },
  { id: "tablet", label: "M", width: 560 },
  { id: "desktop", label: "L", width: 900 },
];

export const PREVIEW_SKIN =
  "rounded-xl bg-[var(--color-accent)] px-6 py-3 font-semibold text-[var(--color-accent-fg)]";

export const INITIAL: StudioState = {
  classes: `${MOTIONWIND_RECIPES[0]!.classes} ${PREVIEW_SKIN}`,
  tag: "button",
  text: "Ship the interaction",
  target: "react",
};
