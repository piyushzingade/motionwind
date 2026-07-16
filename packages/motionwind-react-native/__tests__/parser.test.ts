import { describe, it, expect, beforeEach } from "vitest";
import { parseMotionClasses, clearParserCache } from "../src/parser.js";

beforeEach(() => clearParserCache());

describe("parseMotionClasses (react-native)", () => {
  describe("passthrough", () => {
    it("passes through NativeWind classes untouched", () => {
      const result = parseMotionClasses("px-4 bg-blue-500 rounded-xl");
      expect(result.nativewindClasses).toBe("px-4 bg-blue-500 rounded-xl");
      expect(result.hasMotion).toBe(false);
    });
  });

  describe("transforms", () => {
    it("parses scale to a 0-1 value", () => {
      const result = parseMotionClasses("animate-tap:scale-95");
      expect(result.gestures.whileTap).toEqual({ scale: 0.95 });
    });

    it("maps x/y to translateX/translateY", () => {
      const result = parseMotionClasses(
        "animate-enter:x-20 animate-enter:y-30",
      );
      expect(result.gestures.animate).toEqual({
        translateX: 20,
        translateY: 30,
      });
    });

    it("emits degree strings for rotate", () => {
      const result = parseMotionClasses("animate-enter:rotate-45");
      expect(result.gestures.animate).toEqual({ rotate: "45deg" });
    });
  });

  describe("web-only filters are dropped", () => {
    const filters = [
      "animate-hover:blur-10",
      "animate-hover:grayscale-100",
      "animate-hover:sepia-50",
      "animate-hover:invert-100",
      "animate-hover:hue-rotate-90",
      "animate-hover:drop-shadow-[0_4px_8px_#000]",
    ];

    it.each(filters)("drops %s without producing motion", (cls) => {
      const result = parseMotionClasses(cls);
      expect(result.hasMotion).toBe(false);
      expect(result.gestures.whileHover).toBeUndefined();
      // The unrecognized token passes through to NativeWind.
      expect(result.nativewindClasses).toBe(cls);
    });

    it("keeps a real prop when combined with a dropped filter", () => {
      const result = parseMotionClasses(
        "animate-hover:scale-110 animate-hover:grayscale-100",
      );
      expect(result.hasMotion).toBe(true);
      expect(result.gestures.whileHover).toEqual({ scale: 1.1 });
      expect(result.nativewindClasses).toBe("animate-hover:grayscale-100");
    });
  });

  describe("scroll-linked animations", () => {
    it("maps x/y scroll values to translateX/translateY", () => {
      const result = parseMotionClasses(
        "animate-scroll:y-[0,-200] animate-scroll:x-[0,50]",
      );
      expect(result.hasMotion).toBe(true);
      expect(result.scroll.values).toEqual({
        translateY: [0, -200],
        translateX: [0, 50],
      });
    });

    it("keeps opacity ranges literal", () => {
      const result = parseMotionClasses("animate-scroll:opacity-[1,0]");
      expect(result.scroll.values).toEqual({ opacity: [1, 0] });
    });

    it("parses axis and container config", () => {
      const result = parseMotionClasses(
        "animate-scroll:scaleX-[0,1] animate-scroll-axis-x animate-scroll-container",
      );
      expect(result.scroll.values).toEqual({ scaleX: [0, 1] });
      expect(result.scroll.axis).toBe("x");
      expect(result.scroll.container).toBe(true);
    });
  });

  describe("named variants", () => {
    it("collects variant defs with RN key mapping", () => {
      const result = parseMotionClasses(
        "animate-variant-hidden:opacity-0 animate-variant-hidden:y-20 animate-variant-visible:opacity-100 animate-variant-visible:y-0",
      );
      expect(result.hasMotion).toBe(true);
      expect(result.variants).toEqual({
        hidden: { opacity: 0, translateY: 20 },
        visible: { opacity: 1, translateY: 0 },
      });
    });

    it("parses from/to/exit selectors", () => {
      const result = parseMotionClasses(
        "animate-from-hidden animate-to-visible animate-exit-hidden",
      );
      expect(result.variantState).toEqual({
        initial: "hidden",
        animate: "visible",
        exit: "hidden",
      });
    });
  });

  describe("shared v2 core", () => {
    it("expands built-in presets through motionwind-core", () => {
      const result = parseMotionClasses("animate-preset-button-press");
      expect(result.gestures.whileTap).toEqual({ scale: 0.95 });
      expect(result.transition).toMatchObject({
        type: "spring",
        stiffness: 420,
        damping: 24,
      });
    });

    it("adapts named config tokens to Reanimated milliseconds", () => {
      const result = parseMotionClasses(
        "animate-duration-fast animate-enter:opacity-100",
        {
          tokens: { durations: { fast: 160 } },
        },
      );
      expect(result.transition.duration).toBe(160);
    });

    it("reports capability gaps instead of silently consuming them", () => {
      const result = parseMotionClasses("animate-layout animate-drag-y");
      expect(result.diagnostics.map(({ code }) => code)).toEqual(
        expect.arrayContaining([
          "unsupported-native-layout",
          "unsupported-native-drag",
        ]),
      );
    });
  });
});
