import { createContext, use } from "react";

/**
 * Semantic color tokens for the native app, mirroring the web/docs design
 * system. Both palettes conform to `ThemeColors`, so either can be assigned
 * wherever a theme is expected (no literal-type mismatch between light/dark).
 */
export interface ThemeColors {
  bg: string;
  fg: string;
  fgMuted: string;
  accent: string;
  accentHover: string;
  accentFg: string;
  border: string;
  borderSubtle: string;
  surface: string;
  surfaceElevated: string;
  shadow: string;
  codeBg: string;
  selection: string;
}

export type ThemeMode = "light" | "dark";

/** Docs-matching color tokens */
export const light: ThemeColors = {
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
};

export const dark: ThemeColors = {
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
};

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
  return use(ThemeContext);
}
