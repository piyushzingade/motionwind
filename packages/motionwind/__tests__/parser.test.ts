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

    it("combines multiple filter functions", () => {
      const result = parseMotionClasses(
        "animate-hover:blur-10 animate-hover:brightness-150",
      );
      expect(result.gestures.whileHover).toEqual({
        filter: "blur(10px) brightness(1.5)",
      });
    });

    it("combines three filter functions", () => {
      const result = parseMotionClasses(
        "animate-hover:blur-5 animate-hover:brightness-120 animate-hover:contrast-150",
      );
      expect(result.gestures.whileHover).toEqual({
        filter: "blur(5px) brightness(1.2) contrast(1.5)",
      });
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

  describe("keyframe arrays", () => {
    it("parses scale keyframes", () => {
      const result = parseMotionClasses("animate-enter:scale-[100,150,100]");
      expect(result.gestures.animate).toEqual({ scale: [1, 1.5, 1] });
    });

    it("parses opacity keyframes", () => {
      const result = parseMotionClasses("animate-enter:opacity-[0,100,50]");
      expect(result.gestures.animate).toEqual({ opacity: [0, 1, 0.5] });
    });

    it("parses x keyframes (non-scale, no normalization)", () => {
      const result = parseMotionClasses("animate-enter:x-[0,100,0]");
      expect(result.gestures.animate).toEqual({ x: [0, 100, 0] });
    });

    it("parses y keyframes", () => {
      const result = parseMotionClasses("animate-enter:y-[0,20,0]");
      expect(result.gestures.animate).toEqual({ y: [0, 20, 0] });
    });

    it("parses rotate keyframes", () => {
      const result = parseMotionClasses("animate-enter:rotate-[0,360]");
      expect(result.gestures.animate).toEqual({ rotate: [0, 360] });
    });

    it("parses scale-x keyframes", () => {
      const result = parseMotionClasses("animate-hover:scale-x-[100,150,100]");
      expect(result.gestures.whileHover).toEqual({ scaleX: [1, 1.5, 1] });
    });
  });

  describe("custom cubic-bezier", () => {
    it("parses animate-ease-[n,n,n,n]", () => {
      const result = parseMotionClasses("animate-ease-[0.17,0.67,0.83,0.67]");
      expect(result.transition.ease).toEqual([0.17, 0.67, 0.83, 0.67]);
    });

    it("rejects invalid cubic-bezier (not 4 values)", () => {
      const result = parseMotionClasses("animate-ease-[0.17,0.67,0.83]");
      expect(result.transition.ease).toBeUndefined();
    });
  });

  describe("layout config", () => {
    it("parses animate-layout", () => {
      const result = parseMotionClasses("animate-layout");
      expect(result.layoutConfig.layout).toBe(true);
      expect(result.hasMotion).toBe(true);
    });

    it("parses animate-layout-position", () => {
      const result = parseMotionClasses("animate-layout-position");
      expect(result.layoutConfig.layout).toBe("position");
    });

    it("parses animate-layout-size", () => {
      const result = parseMotionClasses("animate-layout-size");
      expect(result.layoutConfig.layout).toBe("size");
    });

    it("parses animate-layout-preserve", () => {
      const result = parseMotionClasses("animate-layout-preserve");
      expect(result.layoutConfig.layout).toBe("preserve-aspect");
    });

    it("parses animate-layout-id-{name}", () => {
      const result = parseMotionClasses("animate-layout-id-hero");
      expect(result.layoutConfig.layoutId).toBe("hero");
    });

    it("parses layout with layoutId together", () => {
      const result = parseMotionClasses("animate-layout animate-layout-id-card");
      expect(result.layoutConfig.layout).toBe(true);
      expect(result.layoutConfig.layoutId).toBe("card");
    });
  });

  describe("stagger and delay children", () => {
    it("parses animate-stagger-{ms}", () => {
      const result = parseMotionClasses("animate-stagger-100");
      expect(result.transition.staggerChildren).toBe(0.1);
    });

    it("parses animate-delay-children-{ms}", () => {
      const result = parseMotionClasses("animate-delay-children-200");
      expect(result.transition.delayChildren).toBe(0.2);
    });
  });

  describe("repeatType and repeatDelay", () => {
    it("parses animate-repeat-reverse", () => {
      const result = parseMotionClasses("animate-repeat-reverse");
      expect(result.transition.repeatType).toBe("reverse");
    });

    it("parses animate-repeat-mirror", () => {
      const result = parseMotionClasses("animate-repeat-mirror");
      expect(result.transition.repeatType).toBe("mirror");
    });

    it("parses animate-repeat-delay-{ms}", () => {
      const result = parseMotionClasses("animate-repeat-delay-500");
      expect(result.transition.repeatDelay).toBe(0.5);
    });

    it("parses full repeat pattern", () => {
      const result = parseMotionClasses(
        "animate-repeat-infinite animate-repeat-reverse animate-repeat-delay-1000",
      );
      expect(result.transition.repeat).toBe(Infinity);
      expect(result.transition.repeatType).toBe("reverse");
      expect(result.transition.repeatDelay).toBe(1);
    });
  });

  describe("SVG path properties", () => {
    it("parses path-length", () => {
      const result = parseMotionClasses("animate-enter:path-length-1");
      expect(result.gestures.animate).toEqual({ pathLength: 1 });
    });

    it("parses path-offset", () => {
      const result = parseMotionClasses("animate-enter:path-offset-0");
      expect(result.gestures.animate).toEqual({ pathOffset: 0 });
    });

    it("parses path-spacing", () => {
      const result = parseMotionClasses("animate-enter:path-spacing-1");
      expect(result.gestures.animate).toEqual({ pathSpacing: 1 });
    });

    it("parses SVG draw animation pattern", () => {
      const result = parseMotionClasses(
        "animate-initial:path-length-0 animate-enter:path-length-1 animate-duration-2000",
      );
      expect(result.gestures.initial).toEqual({ pathLength: 0 });
      expect(result.gestures.animate).toEqual({ pathLength: 1 });
      expect(result.transition.duration).toBe(2);
    });
  });

  describe("color properties", () => {
    it("parses bg-#hex as backgroundColor", () => {
      const result = parseMotionClasses("animate-hover:bg-#ff0000");
      expect(result.gestures.whileHover).toEqual({ backgroundColor: "#ff0000" });
    });

    it("parses text-#hex as color", () => {
      const result = parseMotionClasses("animate-hover:text-#ffffff");
      expect(result.gestures.whileHover).toEqual({ color: "#ffffff" });
    });

    it("parses border-#hex as borderColor", () => {
      const result = parseMotionClasses("animate-hover:border-#00ff00");
      expect(result.gestures.whileHover).toEqual({ borderColor: "#00ff00" });
    });
  });

  describe("drag snap and momentum", () => {
    it("parses animate-drag-snap", () => {
      const result = parseMotionClasses("animate-drag-snap");
      expect(result.dragConfig.dragSnapToOrigin).toBe(true);
    });

    it("parses animate-drag-no-momentum", () => {
      const result = parseMotionClasses("animate-drag-no-momentum");
      expect(result.dragConfig.dragMomentum).toBe(false);
    });

    it("parses full drag config", () => {
      const result = parseMotionClasses(
        "animate-drag-both animate-drag-elastic-30 animate-drag-snap animate-drag-no-momentum",
      );
      expect(result.dragConfig).toEqual({
        drag: true,
        dragElastic: 0.3,
        dragSnapToOrigin: true,
        dragMomentum: false,
      });
    });
  });

  describe("z-axis", () => {
    it("parses z value", () => {
      const result = parseMotionClasses("animate-hover:z-50");
      expect(result.gestures.whileHover).toEqual({ z: 50 });
    });

    it("parses negative z value", () => {
      const result = parseMotionClasses("animate-hover:-z-100");
      expect(result.gestures.whileHover).toEqual({ z: -100 });
    });
  });

  describe("box shadow", () => {
    it("parses shadow-[value]", () => {
      const result = parseMotionClasses("animate-hover:shadow-[0px_10px_30px_rgba(0,0,0,0.3)]");
      expect(result.gestures.whileHover).toEqual({
        boxShadow: "0px_10px_30px_rgba(0,0,0,0.3)",
      });
    });
  });

  describe("viewport amount numeric", () => {
    it("parses animate-amount-50 as 0.5", () => {
      const result = parseMotionClasses("animate-amount-50");
      expect(result.viewport.amount).toBe(0.5);
    });

    it("parses animate-amount-100 as 1", () => {
      const result = parseMotionClasses("animate-amount-100");
      expect(result.viewport.amount).toBe(1);
    });
  });

  describe("string unit values", () => {
    it("parses x with percent: x-100pct → '100%'", () => {
      const result = parseMotionClasses("animate-enter:x-100pct");
      expect(result.gestures.animate).toEqual({ x: "100%" });
    });

    it("parses negative percent: -x-50pct → '-50%'", () => {
      const result = parseMotionClasses("animate-enter:-x-50pct");
      expect(result.gestures.animate).toEqual({ x: "-50%" });
    });

    it("parses y-50vh", () => {
      const result = parseMotionClasses("animate-enter:y-50vh");
      expect(result.gestures.animate).toEqual({ y: "50vh" });
    });

    it("parses x-2rem", () => {
      const result = parseMotionClasses("animate-hover:x-2rem");
      expect(result.gestures.whileHover).toEqual({ x: "2rem" });
    });

    it("parses w-auto", () => {
      const result = parseMotionClasses("animate-enter:w-auto");
      expect(result.gestures.animate).toEqual({ width: "auto" });
    });

    it("parses h-100pct", () => {
      const result = parseMotionClasses("animate-enter:h-100pct");
      expect(result.gestures.animate).toEqual({ height: "100%" });
    });

    it("parses x-100vw", () => {
      const result = parseMotionClasses("animate-exit:x-100vw");
      expect(result.gestures.exit).toEqual({ x: "100vw" });
    });

    it("parses x with em", () => {
      const result = parseMotionClasses("animate-hover:x-3em");
      expect(result.gestures.whileHover).toEqual({ x: "3em" });
    });

    it("parses x-20px (explicit px)", () => {
      const result = parseMotionClasses("animate-hover:x-20px");
      expect(result.gestures.whileHover).toEqual({ x: "20px" });
    });
  });

  describe("new easing functions", () => {
    it("parses circIn", () => {
      expect(parseMotionClasses("animate-ease-circ-in").transition.ease).toBe("circIn");
    });

    it("parses circOut", () => {
      expect(parseMotionClasses("animate-ease-circ-out").transition.ease).toBe("circOut");
    });

    it("parses circInOut", () => {
      expect(parseMotionClasses("animate-ease-circ-in-out").transition.ease).toBe("circInOut");
    });

    it("parses backIn", () => {
      expect(parseMotionClasses("animate-ease-back-in").transition.ease).toBe("backIn");
    });

    it("parses backOut", () => {
      expect(parseMotionClasses("animate-ease-back-out").transition.ease).toBe("backOut");
    });

    it("parses backInOut", () => {
      expect(parseMotionClasses("animate-ease-back-in-out").transition.ease).toBe("backInOut");
    });

    it("parses anticipate", () => {
      expect(parseMotionClasses("animate-ease-anticipate").transition.ease).toBe("anticipate");
    });

    it("parses steps(n)", () => {
      expect(parseMotionClasses("animate-ease-steps-5").transition.ease).toBe("steps(5)");
    });
  });

  describe("originX/originY/originZ and perspective", () => {
    it("parses origin-x-50 → 0.5", () => {
      const result = parseMotionClasses("animate-hover:origin-x-50");
      expect(result.gestures.whileHover).toEqual({ originX: 0.5 });
    });

    it("parses origin-y-0", () => {
      const result = parseMotionClasses("animate-hover:origin-y-0");
      expect(result.gestures.whileHover).toEqual({ originY: 0 });
    });

    it("parses origin-z-100", () => {
      const result = parseMotionClasses("animate-hover:origin-z-100");
      expect(result.gestures.whileHover).toEqual({ originZ: 100 });
    });

    it("parses perspective-800", () => {
      const result = parseMotionClasses("animate-hover:perspective-800");
      expect(result.gestures.whileHover).toEqual({ perspective: 800 });
    });
  });

  describe("scaleZ and skew", () => {
    it("parses scale-z-150", () => {
      const result = parseMotionClasses("animate-hover:scale-z-150");
      expect(result.gestures.whileHover).toEqual({ scaleZ: 1.5 });
    });

    it("parses skew-12 (uniform)", () => {
      const result = parseMotionClasses("animate-hover:skew-12");
      expect(result.gestures.whileHover).toEqual({ skew: 12 });
    });
  });

  describe("staggerDirection and when", () => {
    it("parses animate-stagger-reverse", () => {
      const result = parseMotionClasses("animate-stagger-reverse");
      expect(result.transition.staggerDirection).toBe(-1);
    });

    it("parses animate-when-before", () => {
      const result = parseMotionClasses("animate-when-before");
      expect(result.transition.when).toBe("beforeChildren");
    });

    it("parses animate-when-after", () => {
      const result = parseMotionClasses("animate-when-after");
      expect(result.transition.when).toBe("afterChildren");
    });
  });

  describe("restSpeed, restDelta, times", () => {
    it("parses rest-speed", () => {
      const result = parseMotionClasses("animate-rest-speed-0.01");
      expect(result.transition.restSpeed).toBe(0.01);
    });

    it("parses rest-delta", () => {
      const result = parseMotionClasses("animate-rest-delta-0.01");
      expect(result.transition.restDelta).toBe(0.01);
    });

    it("parses times-[0,0.5,1]", () => {
      const result = parseMotionClasses("animate-times-[0,0.5,1]");
      expect(result.transition.times).toEqual([0, 0.5, 1]);
    });
  });

  describe("layoutScroll and layoutRoot", () => {
    it("parses animate-layout-scroll", () => {
      const result = parseMotionClasses("animate-layout-scroll");
      expect(result.layoutConfig.layoutScroll).toBe(true);
    });

    it("parses animate-layout-root", () => {
      const result = parseMotionClasses("animate-layout-root");
      expect(result.layoutConfig.layoutRoot).toBe(true);
    });
  });

  describe("dragDirectionLock and dragConstraints", () => {
    it("parses animate-drag-lock", () => {
      const result = parseMotionClasses("animate-drag-lock");
      expect(result.dragConfig.dragDirectionLock).toBe(true);
    });

    it("parses drag-constraint-t-100", () => {
      const result = parseMotionClasses("animate-drag-constraint-t-100");
      expect(result.dragConfig.dragConstraints).toEqual({ top: 100 });
    });

    it("parses all drag constraints", () => {
      const result = parseMotionClasses(
        "animate-drag-constraint-t-0 animate-drag-constraint-l-0 animate-drag-constraint-r-200 animate-drag-constraint-b-200",
      );
      expect(result.dragConfig.dragConstraints).toEqual({
        top: 0,
        left: 0,
        right: 200,
        bottom: 200,
      });
    });
  });

  describe("backdropFilter", () => {
    it("parses backdrop-blur", () => {
      const result = parseMotionClasses("animate-hover:backdrop-blur-10");
      expect(result.gestures.whileHover).toEqual({ backdropFilter: "blur(10px)" });
    });
  });

  describe("clipPath", () => {
    it("parses clip-[value]", () => {
      const result = parseMotionClasses("animate-enter:clip-[inset(0)]");
      expect(result.gestures.animate).toEqual({ clipPath: "inset(0)" });
    });
  });

  describe("position properties", () => {
    it("parses top", () => {
      const result = parseMotionClasses("animate-enter:top-0");
      expect(result.gestures.animate).toEqual({ top: 0 });
    });

    it("parses left with percent", () => {
      const result = parseMotionClasses("animate-enter:left-50pct");
      expect(result.gestures.animate).toEqual({ left: "50%" });
    });

    it("parses right and bottom", () => {
      const result = parseMotionClasses("animate-hover:right-20 animate-hover:bottom-10");
      expect(result.gestures.whileHover).toEqual({ right: 20, bottom: 10 });
    });
  });

  describe("spacing (padding, margin, gap)", () => {
    it("parses p-20 → padding", () => {
      const result = parseMotionClasses("animate-hover:p-20");
      expect(result.gestures.whileHover).toEqual({ padding: 20 });
    });

    it("parses m-10 → margin", () => {
      const result = parseMotionClasses("animate-hover:m-10");
      expect(result.gestures.whileHover).toEqual({ margin: 10 });
    });

    it("parses gap-8", () => {
      const result = parseMotionClasses("animate-hover:gap-8");
      expect(result.gestures.whileHover).toEqual({ gap: 8 });
    });
  });

  describe("typography", () => {
    it("parses text-size-20 → fontSize", () => {
      const result = parseMotionClasses("animate-hover:text-size-20");
      expect(result.gestures.whileHover).toEqual({ fontSize: 20 });
    });

    it("parses tracking-2 → letterSpacing", () => {
      const result = parseMotionClasses("animate-hover:tracking-2");
      expect(result.gestures.whileHover).toEqual({ letterSpacing: 2 });
    });

    it("parses leading-24 → lineHeight", () => {
      const result = parseMotionClasses("animate-hover:leading-24");
      expect(result.gestures.whileHover).toEqual({ lineHeight: 24 });
    });
  });

  describe("borderWidth", () => {
    it("parses border-w-2", () => {
      const result = parseMotionClasses("animate-hover:border-w-2");
      expect(result.gestures.whileHover).toEqual({ borderWidth: 2 });
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
