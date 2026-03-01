import { describe, it, expect, beforeEach } from "vitest";
import { parseMotionClasses, clearParserCache } from "../src/parser.js";

beforeEach(() => {
  clearParserCache();
});

describe("parseMotionClasses", () => {
  describe("passthrough", () => {
    it("passes through pure Tailwind classes untouched", () => {
      const result = parseMotionClasses("px-4 bg-blue-500 hover:text-white");
      expect(result.tailwindClasses).toBe("px-4 bg-blue-500 hover:text-white");
      expect(result.hasMotion).toBe(false);
    });

    it("passes through Tailwind animate-spin and animate-pulse", () => {
      const result = parseMotionClasses("animate-spin animate-pulse");
      expect(result.tailwindClasses).toBe("animate-spin animate-pulse");
      expect(result.hasMotion).toBe(false);
    });

    it("handles empty string", () => {
      const result = parseMotionClasses("");
      expect(result.tailwindClasses).toBe("");
      expect(result.hasMotion).toBe(false);
    });
  });

  describe("gesture: scale", () => {
    it("parses animate-hover:scale-110", () => {
      const result = parseMotionClasses("animate-hover:scale-110");
      expect(result.gestures.whileHover).toEqual({ scale: 1.1 });
      expect(result.hasMotion).toBe(true);
    });

    it("parses animate-tap:scale-90", () => {
      const result = parseMotionClasses("animate-tap:scale-90");
      expect(result.gestures.whileTap).toEqual({ scale: 0.9 });
    });

    it("parses scale-x and scale-y", () => {
      const result = parseMotionClasses(
        "animate-hover:scale-x-150 animate-hover:scale-y-50",
      );
      expect(result.gestures.whileHover).toEqual({ scaleX: 1.5, scaleY: 0.5 });
    });
  });

  describe("gesture: translate", () => {
    it("parses x and y", () => {
      const result = parseMotionClasses(
        "animate-hover:x-20 animate-hover:y-100",
      );
      expect(result.gestures.whileHover).toEqual({ x: 20, y: 100 });
    });

    it("parses negative values", () => {
      const result = parseMotionClasses("animate-hover:-x-20");
      expect(result.gestures.whileHover).toEqual({ x: -20 });
    });
  });

  describe("gesture: rotate", () => {
    it("parses rotate", () => {
      const result = parseMotionClasses("animate-hover:rotate-45");
      expect(result.gestures.whileHover).toEqual({ rotate: 45 });
    });

    it("parses negative rotate", () => {
      const result = parseMotionClasses("animate-hover:-rotate-90");
      expect(result.gestures.whileHover).toEqual({ rotate: -90 });
    });

    it("parses rotateX and rotateY", () => {
      const result = parseMotionClasses(
        "animate-hover:rotate-x-180 animate-hover:rotate-y-90",
      );
      expect(result.gestures.whileHover).toEqual({ rotateX: 180, rotateY: 90 });
    });
  });

  describe("gesture: opacity", () => {
    it("parses opacity-0", () => {
      const result = parseMotionClasses("animate-initial:opacity-0");
      expect(result.gestures.initial).toEqual({ opacity: 0 });
    });

    it("parses opacity-100", () => {
      const result = parseMotionClasses("animate-enter:opacity-100");
      expect(result.gestures.animate).toEqual({ opacity: 1 });
    });
  });

  describe("gesture: skew", () => {
    it("parses skew-x and skew-y", () => {
      const result = parseMotionClasses(
        "animate-hover:skew-x-12 animate-hover:skew-y-6",
      );
      expect(result.gestures.whileHover).toEqual({ skewX: 12, skewY: 6 });
    });
  });

  describe("gesture: filter", () => {
    it("parses blur", () => {
      const result = parseMotionClasses("animate-hover:blur-10");
      expect(result.gestures.whileHover).toEqual({ filter: "blur(10px)" });
    });

    it("parses brightness", () => {
      const result = parseMotionClasses("animate-hover:brightness-150");
      expect(result.gestures.whileHover).toEqual({
        filter: "brightness(1.5)",
      });
    });

    it("parses contrast", () => {
      const result = parseMotionClasses("animate-hover:contrast-200");
      expect(result.gestures.whileHover).toEqual({ filter: "contrast(2)" });
    });

    it("parses saturate", () => {
      const result = parseMotionClasses("animate-hover:saturate-0");
      expect(result.gestures.whileHover).toEqual({ filter: "saturate(0)" });
    });
  });

  describe("gesture: dimensions", () => {
    it("parses width and height", () => {
      const result = parseMotionClasses(
        "animate-hover:w-200 animate-hover:h-100",
      );
      expect(result.gestures.whileHover).toEqual({ width: 200, height: 100 });
    });

    it("parses rounded", () => {
      const result = parseMotionClasses("animate-hover:rounded-16");
      expect(result.gestures.whileHover).toEqual({ borderRadius: 16 });
    });
  });

  describe("arbitrary values", () => {
    it("parses arbitrary string value", () => {
      const result = parseMotionClasses(
        "animate-hover:[backgroundColor=#4f46e5]",
      );
      expect(result.gestures.whileHover).toEqual({
        backgroundColor: "#4f46e5",
      });
    });

    it("parses arbitrary numeric value", () => {
      const result = parseMotionClasses("animate-enter:[pathLength=1]");
      expect(result.gestures.animate).toEqual({ pathLength: 1 });
    });

    it("parses arbitrary value with special chars", () => {
      const result = parseMotionClasses(
        "animate-hover:[boxShadow=0_10px_20px_rgba(0,0,0,0.2)]",
      );
      expect(result.gestures.whileHover).toEqual({
        boxShadow: "0_10px_20px_rgba(0,0,0,0.2)",
      });
    });
  });

  describe("all gesture types", () => {
    it("parses whileFocus", () => {
      const result = parseMotionClasses("animate-focus:scale-105");
      expect(result.gestures.whileFocus).toEqual({ scale: 1.05 });
    });

    it("parses whileInView", () => {
      const result = parseMotionClasses("animate-inview:opacity-100");
      expect(result.gestures.whileInView).toEqual({ opacity: 1 });
    });

    it("parses whileDrag", () => {
      const result = parseMotionClasses("animate-drag:scale-105");
      expect(result.gestures.whileDrag).toEqual({ scale: 1.05 });
    });

    it("parses initial", () => {
      const result = parseMotionClasses("animate-initial:opacity-0");
      expect(result.gestures.initial).toEqual({ opacity: 0 });
    });

    it("parses animate (enter)", () => {
      const result = parseMotionClasses("animate-enter:opacity-100");
      expect(result.gestures.animate).toEqual({ opacity: 1 });
    });

    it("parses exit", () => {
      const result = parseMotionClasses("animate-exit:opacity-0");
      expect(result.gestures.exit).toEqual({ opacity: 0 });
    });
  });

  describe("transition config", () => {
    it("parses duration", () => {
      const result = parseMotionClasses("animate-duration-300");
      expect(result.transition.duration).toBe(0.3);
    });

    it("parses delay", () => {
      const result = parseMotionClasses("animate-delay-500");
      expect(result.transition.delay).toBe(0.5);
    });

    it("parses easing", () => {
      expect(parseMotionClasses("animate-ease-in").transition.ease).toBe(
        "easeIn",
      );
      expect(parseMotionClasses("animate-ease-out").transition.ease).toBe(
        "easeOut",
      );
      expect(parseMotionClasses("animate-ease-in-out").transition.ease).toBe(
        "easeInOut",
      );
      expect(parseMotionClasses("animate-ease-linear").transition.ease).toBe(
        "linear",
      );
    });

    it("parses spring", () => {
      const result = parseMotionClasses("animate-spring");
      expect(result.transition.type).toBe("spring");
    });

    it("parses stiffness", () => {
      const result = parseMotionClasses("animate-stiffness-400");
      expect(result.transition.stiffness).toBe(400);
    });

    it("parses damping", () => {
      const result = parseMotionClasses("animate-damping-20");
      expect(result.transition.damping).toBe(20);
    });

    it("parses bounce", () => {
      const result = parseMotionClasses("animate-bounce-50");
      expect(result.transition.bounce).toBe(0.5);
    });

    it("parses mass", () => {
      const result = parseMotionClasses("animate-mass-10");
      expect(result.transition.mass).toBe(1);
    });

    it("parses repeat", () => {
      const result = parseMotionClasses("animate-repeat-3");
      expect(result.transition.repeat).toBe(3);
    });

    it("parses repeat-infinite", () => {
      const result = parseMotionClasses("animate-repeat-infinite");
      expect(result.transition.repeat).toBe(Infinity);
    });
  });

  describe("viewport config", () => {
    it("parses animate-once", () => {
      const result = parseMotionClasses("animate-once");
      expect(result.viewport.once).toBe(true);
    });

    it("parses animate-amount-all", () => {
      const result = parseMotionClasses("animate-amount-all");
      expect(result.viewport.amount).toBe("all");
    });

    it("parses animate-margin", () => {
      const result = parseMotionClasses("animate-margin-100");
      expect(result.viewport.margin).toBe("100px");
    });
  });

  describe("drag config", () => {
    it("parses drag-x", () => {
      const result = parseMotionClasses("animate-drag-x");
      expect(result.dragConfig.drag).toBe("x");
    });

    it("parses drag-y", () => {
      const result = parseMotionClasses("animate-drag-y");
      expect(result.dragConfig.drag).toBe("y");
    });

    it("parses drag-both", () => {
      const result = parseMotionClasses("animate-drag-both");
      expect(result.dragConfig.drag).toBe(true);
    });

    it("parses drag-elastic", () => {
      const result = parseMotionClasses("animate-drag-elastic-50");
      expect(result.dragConfig.dragElastic).toBe(0.5);
    });
  });

  describe("mixed classes", () => {
    it("separates Tailwind from motionwind classes", () => {
      const result = parseMotionClasses(
        "px-6 py-3 bg-indigo-600 text-white rounded-lg animate-hover:scale-110 animate-tap:scale-90 animate-spring animate-stiffness-400",
      );
      expect(result.tailwindClasses).toBe(
        "px-6 py-3 bg-indigo-600 text-white rounded-lg",
      );
      expect(result.gestures.whileHover).toEqual({ scale: 1.1 });
      expect(result.gestures.whileTap).toEqual({ scale: 0.9 });
      expect(result.transition.type).toBe("spring");
      expect(result.transition.stiffness).toBe(400);
      expect(result.hasMotion).toBe(true);
    });

    it("handles complex scroll-reveal pattern", () => {
      const result = parseMotionClasses(
        "animate-initial:opacity-0 animate-initial:y-20 animate-inview:opacity-100 animate-inview:y-0 animate-once animate-duration-500",
      );
      expect(result.gestures.initial).toEqual({ opacity: 0, y: 20 });
      expect(result.gestures.whileInView).toEqual({ opacity: 1, y: 0 });
      expect(result.viewport.once).toBe(true);
      expect(result.transition.duration).toBe(0.5);
    });

    it("accumulates multiple properties on same gesture", () => {
      const result = parseMotionClasses(
        "animate-hover:scale-110 animate-hover:rotate-5 animate-hover:y-10",
      );
      expect(result.gestures.whileHover).toEqual({
        scale: 1.1,
        rotate: 5,
        y: 10,
      });
    });
  });

  describe("caching", () => {
    it("returns same result for same input", () => {
      const r1 = parseMotionClasses("animate-hover:scale-110");
      const r2 = parseMotionClasses("animate-hover:scale-110");
      expect(r1).toBe(r2); // same reference
    });
  });
});
