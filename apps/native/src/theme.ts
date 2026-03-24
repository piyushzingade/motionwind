import React, { createContext, useContext } from "react";

/** Docs-matching color tokens */
export const light = {
  bg: "#fafaf9",
  fg: "#171717",
  fgMuted: "#64646e",
  accent: "#4d7c0f",
  accentHover: "#3f6212",
  accentFg: "#ffffff",
  border: "#e4e4e0",
  borderSubtle: "#f0f0ec",
  surface: "#f5f5f2",
  surfaceElevated: "#ffffff",
  shadow: "rgba(0,0,0,0.06)",
  codeBg: "#f6f6f2",
  selection: "rgba(77,124,15,0.12)",
} as const;

export const dark = {
  bg: "#0a0a0f",
  fg: "#f0f0f0",
  fgMuted: "#8a8a9a",
  accent: "#c8ff2e",
  accentHover: "#b8ef1e",
  accentFg: "#0a0a0f",
  border: "#1e1e2a",
  borderSubtle: "#141420",
  surface: "#0f0f18",
  surfaceElevated: "#16161f",
  shadow: "rgba(0,0,0,0.5)",
  codeBg: "#0c0c14",
  selection: "rgba(200,255,46,0.18)",
} as const;

export type ThemeColors = typeof light;
export type ThemeMode = "light" | "dark";

export interface ThemeContextValue {
  mode: ThemeMode;
  colors: ThemeColors;
  toggle: () => void;
}

export const ThemeContext = createContext<ThemeContextValue>({
  mode: "dark",
  colors: dark,
  toggle: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}
