"use client";

import { useDeferredValue, useMemo } from "react";
import { MOTIONWIND_RECIPES } from "motionwind-react";
import { parseMotionClasses } from "motionwind-react";
import { generateMotionCode } from "motionwind-react/tooling";
import { highlightCode } from "./highlight";
import { numericToken } from "./utils";
import type { StudioState } from "./types";

export function useGeneratedCode(editor: StudioState) {
  const deferredClasses = useDeferredValue(editor.classes);

  const parsed = useMemo(
    () => parseMotionClasses(deferredClasses),
    [deferredClasses],
  );

  const generated = useMemo(
    () =>
      generateMotionCode(editor.tag, deferredClasses, {
        text: editor.text || "Content",
        target: editor.target,
      }),
    [deferredClasses, editor.tag, editor.target, editor.text],
  );

  const highlighted = useMemo(() => highlightCode(generated), [generated]);

  const duration = numericToken(editor.classes, "animate-duration-", 300);
  const delay = numericToken(editor.classes, "animate-delay-", 0);
  const stiffness = numericToken(editor.classes, "animate-stiffness-", 300);
  const damping = numericToken(editor.classes, "animate-damping-", 24);

  const activeRecipe = MOTIONWIND_RECIPES.find((recipe) =>
    editor.classes.startsWith(recipe.classes),
  );

  const selectedAdapter =
    editor.target === "javascript" ? "vanilla" : editor.target;

  const recipeSupportsTarget =
    !activeRecipe ||
    activeRecipe.adapters.includes(
      selectedAdapter as "react" | "vue" | "vanilla" | "react-native",
    );

  return {
    parsed,
    generated,
    highlighted,
    duration,
    delay,
    stiffness,
    damping,
    activeRecipe,
    recipeSupportsTarget,
  };
}
