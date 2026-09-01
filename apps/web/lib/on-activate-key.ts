import type { KeyboardEvent as ReactKeyboardEvent } from "react";

export function onActivateKey(fn: () => void) {
  return (e: ReactKeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      fn();
    }
  };
}
