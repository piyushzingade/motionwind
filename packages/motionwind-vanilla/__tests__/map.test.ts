import { describe, it, expect, beforeEach } from "vitest";
import { parseMotionClasses, clearParserCache } from "motionwind-core";
import { toAnimateOptions, baseValues, subset } from "../src/map.js";

beforeEach(() => clearParserCache());

describe("toAnimateOptions", () => {
  it("projects transition config onto animate() options", () => {
    const { transition } = parseMotionClasses(
      "animate-spring animate-duration-300 animate-stiffness-400 animate-delay-100",
    );
    expect(toAnimateOptions(transition)).toEqual({
      type: "spring",
      duration: 0.3,
      stiffness: 400,
      delay: 0.1,
    });
  });

  it("drops orchestration-only keys that don't apply to a single element", () => {
    const { transition } = parseMotionClasses(
      "animate-duration-200 animate-stagger-100 animate-when-before",
    );
    const opts = toAnimateOptions(transition);
    expect(opts).toEqual({ duration: 0.2 });
    expect(opts.staggerChildren).toBeUndefined();
    expect(opts.when).toBeUndefined();
  });
});

describe("baseValues", () => {
  it("resets hover keys to enter/initial/default", () => {
    const parsed = parseMotionClasses(
      "animate-enter:opacity-100 animate-hover:scale-110 animate-hover:opacity-50",
    );
    const base = baseValues(parsed);
    // opacity has an enter value (1); scale falls back to the default (1)
    expect(base.opacity).toBe(1);
    expect(base.scale).toBe(1);
  });

  it("uses initial when there's no enter value", () => {
    const parsed = parseMotionClasses(
      "animate-initial:x-0 animate-hover:x-20",
    );
    expect(baseValues(parsed).x).toBe(0);
  });
});

describe("subset", () => {
  it("picks only the keys present in the shape", () => {
    expect(subset({ scale: 1, opacity: 1, x: 0 }, { scale: 1.1 })).toEqual({
      scale: 1,
    });
  });
});
