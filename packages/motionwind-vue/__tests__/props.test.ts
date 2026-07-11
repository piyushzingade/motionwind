import { describe, it, expect, beforeEach } from "vitest";
import { parseMotionClasses, clearParserCache } from "motionwind-core";
import { buildMotionProps, stripInteractive } from "../src/props.js";

beforeEach(() => clearParserCache());

describe("stripInteractive (reduced motion)", () => {
  it("removes gesture/entrance props but keeps animate + transition", () => {
    const parsed = parseMotionClasses(
      "animate-hover:scale-110 animate-tap:scale-90 animate-initial:opacity-0 animate-enter:opacity-100 animate-duration-300",
    );
    const stripped = stripInteractive(buildMotionProps(parsed));
    expect(stripped.whileHover).toBeUndefined();
    expect(stripped.whilePress).toBeUndefined();
    expect(stripped.initial).toBeUndefined();
    expect(stripped.animate).toEqual({ opacity: 1 });
    expect(stripped.transition).toEqual({ duration: 0.3 });
  });
});

describe("buildMotionProps (vue)", () => {
  it("maps hover/tap gestures + spring transition", () => {
    const parsed = parseMotionClasses(
      "px-4 animate-hover:scale-110 animate-tap:scale-90 animate-spring",
    );
    const props = buildMotionProps(parsed);
    expect(props.whileHover).toEqual({ scale: 1.1 });
    // motion-v names the tap gesture `whilePress` (not `whileTap`).
    expect(props.whilePress).toEqual({ scale: 0.9 });
    expect(props.whileTap).toBeUndefined();
    expect(props.transition).toEqual({ type: "spring" });
  });

  it("maps enter animation + duration", () => {
    const parsed = parseMotionClasses(
      "animate-initial:opacity-0 animate-enter:opacity-100 animate-duration-300",
    );
    const props = buildMotionProps(parsed);
    expect(props.initial).toEqual({ opacity: 0 });
    expect(props.animate).toEqual({ opacity: 1 });
    expect(props.transition).toEqual({ duration: 0.3 });
  });

  it("maps drag config", () => {
    const parsed = parseMotionClasses("animate-drag-both animate-drag-elastic-50");
    const props = buildMotionProps(parsed);
    expect(props.drag).toBe(true);
    expect(props.dragElastic).toBe(0.5);
  });

  it("maps named variants + string state selectors", () => {
    const parsed = parseMotionClasses(
      "animate-variant-hidden:opacity-0 animate-variant-visible:opacity-100 animate-from-hidden animate-to-visible",
    );
    const props = buildMotionProps(parsed);
    expect(props.variants).toEqual({
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    });
    expect(props.initial).toBe("hidden");
    expect(props.animate).toBe("visible");
  });

  it("lets a variant state string win over an object gesture on the same prop", () => {
    const parsed = parseMotionClasses(
      "animate-enter:opacity-100 animate-variant-visible:opacity-100 animate-to-visible",
    );
    const props = buildMotionProps(parsed);
    expect(props.animate).toBe("visible");
  });
});
