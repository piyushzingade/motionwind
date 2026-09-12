import type { SharedStudioState, StageSize, Target } from "./types";
import { INITIAL_SHARED, STAGES, TAGS, TARGETS } from "./types";

export function encodeState(state: SharedStudioState): string {
  const { reduceMotion, ...values } = state;
  return new URLSearchParams({
    ...values,
    motion: reduceMotion ? "reduced" : "full",
  }).toString();
}

export function decodeState(hash: string): SharedStudioState | null {
  const params = new URLSearchParams(hash.replace(/^#/, ""));
  const classes = params.get("classes");
  if (!classes) return null;
  const target = params.get("target") as Target | null;
  const stage = params.get("stage") as StageSize | null;
  const tag = params.get("tag");
  return {
    classes,
    tag: TAGS.some((value) => value === tag) ? tag! : "div",
    text: params.get("text") ?? "",
    target: TARGETS.some(({ id }) => id === target) ? target! : "react",
    stage: STAGES.some(({ id }) => id === stage)
      ? stage!
      : INITIAL_SHARED.stage,
    reduceMotion: params.get("motion") === "reduced",
  };
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

export function replaceClass(
  classes: string,
  matcher: RegExp,
  next: string,
): string {
  return [...classes.split(/\s+/).filter((token) => !matcher.test(token)), next]
    .filter(Boolean)
    .join(" ");
}
