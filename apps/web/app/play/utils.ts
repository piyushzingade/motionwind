import type { Target, StudioState } from "./types";
import { TARGETS } from "./types";

export function encodeState(state: StudioState): string {
  return new URLSearchParams(Object.entries(state)).toString();
}

export function decodeState(hash: string): StudioState | null {
  const params = new URLSearchParams(hash.replace(/^#/, ""));
  const classes = params.get("classes");
  if (!classes) return null;
  const target = params.get("target") as Target | null;
  return {
    classes,
    tag: params.get("tag") ?? "div",
    text: params.get("text") ?? "",
    target: TARGETS.some(({ id }) => id === target) ? target! : "react",
  };
}

export function replaceClass(
  classes: string,
  matcher: RegExp,
  next: string,
): string {
  return [...classes.split(/\s+/).filter((token) => !matcher.test(token)), next]
    .filter(Boolean)
    .join(" ");
}

export function numericToken(
  classes: string,
  prefix: string,
  fallback: number,
): number {
  const token = classes.split(/\s+/).find((value) => value.startsWith(prefix));
  const value = token ? Number(token.slice(prefix.length)) : NaN;
  return Number.isFinite(value) ? value : fallback;
}
