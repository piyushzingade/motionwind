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
  "rounded-xl bg-acid px-6 py-3 font-semibold text-black";

export function getInitial(): StudioState {
  return {
    classes: `animate-hover:scale-105 animate-tap:scale-95 animate-spring ${PREVIEW_SKIN}`,
    tag: "button",
    text: "Ship the interaction",
    target: "react",
  };
}
