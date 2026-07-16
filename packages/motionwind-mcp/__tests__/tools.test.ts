import { describe, expect, it } from "vitest";
import {
  generateExample,
  optimizeClasses,
  validateClasses,
} from "../src/tools.js";

describe("Motionwind MCP tools", () => {
  it("validates known and unknown classes", () => {
    expect(validateClasses("animate-hover:scale-110").valid).toBe(true);
    expect(validateClasses("animate-nope:value").valid).toBe(false);
  });

  it("sorts classes using the shared registry", () => {
    expect(
      optimizeClasses("p-4 animate-spring animate-hover:scale-110").className,
    ).toBe("animate-hover:scale-110 animate-spring p-4");
  });

  it("generates Vue code", () => {
    expect(
      generateExample({
        className: "animate-enter:opacity-100",
        target: "vue",
      }),
    ).toContain("motionwind-vue");
  });
});
