import {
  MOTIONWIND_SYNTAX_REGISTRY,
  analyzeClassName,
  parseMotionClasses,
  sortMotionClasses,
} from "motionwind-core";
import { generateMotionCode } from "motionwind-react/tooling";

export function validateClasses(className: string) {
  const parsed = parseMotionClasses(className);
  const analysis = analyzeClassName(className);
  return {
    valid: analysis.unknown.length === 0,
    unknown: analysis.unknown,
    duplicates: analysis.duplicates,
    diagnostics: parsed.diagnostics,
    parsed,
  };
}

export function explainClasses(className: string) {
  const tokens = className.split(/\s+/).filter(Boolean);
  return tokens.map((token) => {
    const parsed = parseMotionClasses(token);
    return {
      token,
      recognized: parsed.hasMotion || !token.startsWith("animate-"),
      motion: parsed.hasMotion ? parsed : undefined,
      passthrough: parsed.tailwindClasses || undefined,
    };
  });
}

export function optimizeClasses(className: string) {
  const analysis = analyzeClassName(className);
  return {
    className: sortMotionClasses(className),
    duplicates: analysis.duplicates,
    unknown: analysis.unknown,
  };
}

export function generateExample(input: {
  className: string;
  tag?: string;
  text?: string;
  target?: "react" | "vue" | "javascript" | "react-native";
}) {
  return generateMotionCode(input.tag ?? "div", input.className, {
    text: input.text,
    target: input.target,
  });
}

export function syntaxManifest() {
  return MOTIONWIND_SYNTAX_REGISTRY;
}
