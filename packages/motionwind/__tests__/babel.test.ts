import { describe, it, expect } from "vitest";
import { transformSync } from "@babel/core";
import motionwindPlugin from "../src/babel.js";

function transform(code: string): string {
  const result = transformSync(code, {
    plugins: [motionwindPlugin, "@babel/plugin-syntax-jsx"],
    filename: "test.tsx",
    configFile: false,
    babelrc: false,
  });
  return result?.code ?? "";
}

describe("motionwind babel plugin", () => {
  it("transforms a simple hover animation", () => {
    const input = `<button className="px-4 bg-blue-500 animate-hover:scale-110">Click</button>`;
    const output = transform(input);
    expect(output).toContain("motion.button");
    expect(output).toContain('className="px-4 bg-blue-500"');
    expect(output).toContain("whileHover");
    expect(output).toContain("scale: 1.1");
    expect(output).toContain('import { motion } from "motion/react"');
    expect(output).toContain("use client");
  });

  it("transforms hover + tap with spring transition", () => {
    const input = `<button className="animate-hover:scale-110 animate-tap:scale-90 animate-spring animate-stiffness-400">Click</button>`;
    const output = transform(input);
    expect(output).toContain("motion.button");
    expect(output).toContain("whileHover");
    expect(output).toContain("scale: 1.1");
    expect(output).toContain("whileTap");
    expect(output).toContain("scale: 0.9");
    expect(output).toContain('type: "spring"');
    expect(output).toContain("stiffness: 400");
  });

  it("preserves Tailwind classes in className", () => {
    const input = `<div className="px-6 py-3 bg-indigo-600 text-white rounded-lg animate-hover:scale-110">Hello</div>`;
    const output = transform(input);
    expect(output).toContain(
      'className="px-6 py-3 bg-indigo-600 text-white rounded-lg"',
    );
    expect(output).not.toContain("animate-hover");
  });

  it("removes className when only motion classes", () => {
    const input = `<div className="animate-hover:scale-110">Hello</div>`;
    const output = transform(input);
    expect(output).toContain("motion.div");
    expect(output).not.toContain("className");
  });

  it("skips elements with no animate- classes", () => {
    const input = `<div className="px-4 bg-blue-500">Hello</div>`;
    const output = transform(input);
    expect(output).not.toContain("motion.");
    expect(output).not.toContain("import");
  });

  it("skips Tailwind animate-spin/animate-pulse", () => {
    const input = `<div className="animate-spin">Hello</div>`;
    const output = transform(input);
    expect(output).not.toContain("motion.");
    expect(output).toContain("animate-spin");
  });

  it("skips dynamic className expressions", () => {
    const input = `<div className={dynamicClass}>Hello</div>`;
    const output = transform(input);
    expect(output).not.toContain("motion.");
  });

  it("transforms component elements (uppercase) with motion.create", () => {
    const input = `<Button className="animate-hover:scale-110">Click</Button>`;
    const output = transform(input);
    expect(output).toContain("motion.create(Button)");
    expect(output).toContain("_mw_Button");
    expect(output).toContain("whileHover");
    expect(output).toContain("scale: 1.1");
  });

  it("transforms scroll reveal pattern", () => {
    const input = `<div className="animate-initial:opacity-0 animate-initial:y-20 animate-inview:opacity-100 animate-inview:y-0 animate-once animate-duration-500">Reveal</div>`;
    const output = transform(input);
    expect(output).toContain("motion.div");
    expect(output).toContain("initial");
    expect(output).toContain("opacity: 0");
    expect(output).toContain("y: 20");
    expect(output).toContain("whileInView");
    expect(output).toContain("opacity: 1");
    expect(output).toContain("y: 0");
    expect(output).toContain("viewport");
    expect(output).toContain("once: true");
    expect(output).toContain("duration: 0.5");
  });

  it("transforms drag config", () => {
    const input = `<div className="animate-drag-both animate-drag-elastic-50">Drag</div>`;
    const output = transform(input);
    expect(output).toContain("motion.div");
    expect(output).toContain("drag");
    expect(output).toContain("dragElastic={0.5}");
  });

  it("adds import only once for multiple elements", () => {
    const input = `<><button className="animate-hover:scale-110">A</button><div className="animate-tap:scale-90">B</div></>`;
    const output = transform(input);
    const importCount = (output.match(/import.*motion/g) || []).length;
    expect(importCount).toBe(1);
  });

  it("does not duplicate use client if already present", () => {
    const input = `"use client";\n<button className="animate-hover:scale-110">Click</button>`;
    const output = transform(input);
    const useClientCount = (output.match(/use client/g) || []).length;
    expect(useClientCount).toBe(1);
  });

  it("transforms negative values", () => {
    const input = `<div className="animate-hover:-x-20 animate-hover:-rotate-45">Move</div>`;
    const output = transform(input);
    expect(output).toContain("x: -20");
    expect(output).toContain("rotate: -45");
  });

  it("transforms arbitrary values", () => {
    const input = `<div className="animate-hover:[backgroundColor=#4f46e5]">Styled</div>`;
    const output = transform(input);
    expect(output).toContain('backgroundColor: "#4f46e5"');
  });

  it("handles easing classes", () => {
    const input = `<div className="animate-hover:scale-110 animate-ease-in-out animate-duration-300">Ease</div>`;
    const output = transform(input);
    expect(output).toContain('ease: "easeInOut"');
    expect(output).toContain("duration: 0.3");
  });

  it("transforms repeat-infinite", () => {
    const input = `<div className="animate-enter:rotate-360 animate-repeat-infinite animate-duration-1000">Spin</div>`;
    const output = transform(input);
    expect(output).toContain("repeat: Infinity");
  });

  it("transforms keyframe arrays", () => {
    const input = `<div className="animate-enter:scale-[100,150,100]">Pulse</div>`;
    const output = transform(input);
    expect(output).toContain("motion.div");
    expect(output).toContain("scale: [1, 1.5, 1]");
  });

  it("transforms custom cubic-bezier easing", () => {
    const input = `<div className="animate-hover:scale-110 animate-ease-[0.17,0.67,0.83,0.67]">Ease</div>`;
    const output = transform(input);
    expect(output).toContain("ease: [0.17, 0.67, 0.83, 0.67]");
  });

  it("transforms layout prop (boolean)", () => {
    const input = `<div className="animate-layout">Layout</div>`;
    const output = transform(input);
    expect(output).toContain("motion.div");
    expect(output).toContain("layout");
    // Should be a bare attribute (no value), not layout="true"
    expect(output).not.toContain('layout="true"');
  });

  it("transforms layout prop (string: position)", () => {
    const input = `<div className="animate-layout-position">Layout</div>`;
    const output = transform(input);
    expect(output).toContain('layout="position"');
  });

  it("transforms layoutId prop", () => {
    const input = `<div className="animate-layout-id-hero">Layout</div>`;
    const output = transform(input);
    expect(output).toContain('layoutId="hero"');
  });

  it("transforms layout + layoutId together", () => {
    const input = `<div className="animate-layout animate-layout-id-card">Layout</div>`;
    const output = transform(input);
    expect(output).toContain("layout");
    expect(output).toContain('layoutId="card"');
  });

  it("transforms repeatType reverse", () => {
    const input = `<div className="animate-enter:x-100 animate-repeat-infinite animate-repeat-reverse">Move</div>`;
    const output = transform(input);
    expect(output).toContain("repeat: Infinity");
    expect(output).toContain('repeatType: "reverse"');
  });

  it("transforms repeatDelay", () => {
    const input = `<div className="animate-enter:x-100 animate-repeat-3 animate-repeat-delay-500">Move</div>`;
    const output = transform(input);
    expect(output).toContain("repeat: 3");
    expect(output).toContain("repeatDelay: 0.5");
  });

  it("transforms staggerChildren", () => {
    const input = `<div className="animate-stagger-100">Stagger</div>`;
    const output = transform(input);
    expect(output).toContain("staggerChildren: 0.1");
  });

  it("transforms delayChildren", () => {
    const input = `<div className="animate-delay-children-200">Delay</div>`;
    const output = transform(input);
    expect(output).toContain("delayChildren: 0.2");
  });

  it("transforms drag snap to origin", () => {
    const input = `<div className="animate-drag-both animate-drag-snap">Drag</div>`;
    const output = transform(input);
    expect(output).toContain("drag");
    expect(output).toContain("dragSnapToOrigin");
  });

  it("transforms drag no momentum", () => {
    const input = `<div className="animate-drag-x animate-drag-no-momentum">Drag</div>`;
    const output = transform(input);
    expect(output).toContain('drag="x"');
    expect(output).toContain("dragMomentum={false}");
  });

  it("transforms SVG path animation", () => {
    const input = `<path className="animate-initial:path-length-0 animate-enter:path-length-1 animate-duration-2000" />`;
    const output = transform(input);
    expect(output).toContain("motion.path");
    expect(output).toContain("pathLength: 0");
    expect(output).toContain("pathLength: 1");
    expect(output).toContain("duration: 2");
  });

  it("transforms color animations", () => {
    const input = `<div className="animate-hover:bg-#ff0000 animate-hover:text-#ffffff">Color</div>`;
    const output = transform(input);
    expect(output).toContain('backgroundColor: "#ff0000"');
    expect(output).toContain('color: "#ffffff"');
  });

  it("transforms viewport amount as number", () => {
    const input = `<div className="animate-inview:opacity-100 animate-amount-50">View</div>`;
    const output = transform(input);
    expect(output).toContain("amount: 0.5");
    // Should be a number, not a string
    expect(output).not.toContain('"0.5"');
  });

  it("transforms z-axis values", () => {
    const input = `<div className="animate-hover:z-50">Z</div>`;
    const output = transform(input);
    expect(output).toContain("z: 50");
  });

  it("transforms complex animation with multiple new features", () => {
    const input = `<div className="animate-enter:scale-[100,120,100] animate-repeat-infinite animate-repeat-mirror animate-duration-1000 animate-ease-[0.4,0,0.2,1]">Breathe</div>`;
    const output = transform(input);
    expect(output).toContain("motion.div");
    expect(output).toContain("scale: [1, 1.2, 1]");
    expect(output).toContain("repeat: Infinity");
    expect(output).toContain('repeatType: "mirror"');
    expect(output).toContain("duration: 1");
    expect(output).toContain("ease: [0.4, 0, 0.2, 1]");
  });

  // --- New feature tests ---

  it("transforms string unit values (percent)", () => {
    const input = `<div className="animate-enter:x-100pct">Slide</div>`;
    const output = transform(input);
    expect(output).toContain('x: "100%"');
  });

  it("transforms string unit values (vh)", () => {
    const input = `<div className="animate-exit:y-100vh">Slide</div>`;
    const output = transform(input);
    expect(output).toContain('y: "100vh"');
  });

  it("transforms w-auto", () => {
    const input = `<div className="animate-enter:w-auto">Auto</div>`;
    const output = transform(input);
    expect(output).toContain('width: "auto"');
  });

  it("transforms new easing: backOut", () => {
    const input = `<div className="animate-hover:scale-110 animate-ease-back-out">Ease</div>`;
    const output = transform(input);
    expect(output).toContain('ease: "backOut"');
  });

  it("transforms ease-steps-n", () => {
    const input = `<div className="animate-enter:opacity-100 animate-ease-steps-5">Steps</div>`;
    const output = transform(input);
    expect(output).toContain('ease: "steps(5)"');
  });

  it("transforms originX/originY", () => {
    const input = `<div className="animate-hover:origin-x-0 animate-hover:origin-y-100 animate-hover:scale-110">Origin</div>`;
    const output = transform(input);
    expect(output).toContain("originX: 0");
    expect(output).toContain("originY: 1");
    expect(output).toContain("scale: 1.1");
  });

  it("transforms perspective", () => {
    const input = `<div className="animate-hover:perspective-800 animate-hover:rotate-x-30">3D</div>`;
    const output = transform(input);
    expect(output).toContain("perspective: 800");
    expect(output).toContain("rotateX: 30");
  });

  it("transforms staggerDirection", () => {
    const input = `<div className="animate-stagger-50 animate-stagger-reverse">Stagger</div>`;
    const output = transform(input);
    expect(output).toContain("staggerChildren: 0.05");
    expect(output).toContain("staggerDirection: -1");
  });

  it("transforms when orchestration", () => {
    const input = `<div className="animate-when-before animate-stagger-100">Parent</div>`;
    const output = transform(input);
    expect(output).toContain('when: "beforeChildren"');
    expect(output).toContain("staggerChildren: 0.1");
  });

  it("transforms restSpeed and restDelta", () => {
    const input = `<div className="animate-hover:scale-110 animate-spring animate-rest-speed-0.01 animate-rest-delta-0.01">Spring</div>`;
    const output = transform(input);
    expect(output).toContain("restSpeed: 0.01");
    expect(output).toContain("restDelta: 0.01");
  });

  it("transforms keyframe times", () => {
    const input = `<div className="animate-enter:opacity-[0,100,50] animate-times-[0,0.3,1]">Times</div>`;
    const output = transform(input);
    expect(output).toContain("times: [0, 0.3, 1]");
  });

  it("transforms layoutScroll", () => {
    const input = `<div className="animate-layout-scroll">Scroll</div>`;
    const output = transform(input);
    expect(output).toContain("layoutScroll");
  });

  it("transforms layoutRoot", () => {
    const input = `<div className="animate-layout-root">Root</div>`;
    const output = transform(input);
    expect(output).toContain("layoutRoot");
  });

  it("transforms dragDirectionLock", () => {
    const input = `<div className="animate-drag-both animate-drag-lock">Lock</div>`;
    const output = transform(input);
    expect(output).toContain("dragDirectionLock");
  });

  it("transforms dragConstraints", () => {
    const input = `<div className="animate-drag-both animate-drag-constraint-t-0 animate-drag-constraint-l-0 animate-drag-constraint-r-200 animate-drag-constraint-b-200">Box</div>`;
    const output = transform(input);
    expect(output).toContain("dragConstraints");
    expect(output).toContain("top: 0");
    expect(output).toContain("left: 0");
    expect(output).toContain("right: 200");
    expect(output).toContain("bottom: 200");
  });

  it("transforms backdropFilter", () => {
    const input = `<div className="animate-hover:backdrop-blur-10">Blur</div>`;
    const output = transform(input);
    expect(output).toContain('backdropFilter: "blur(10px)"');
  });

  it("transforms position properties", () => {
    const input = `<div className="animate-enter:top-0 animate-enter:left-50pct">Pos</div>`;
    const output = transform(input);
    expect(output).toContain("top: 0");
    expect(output).toContain('left: "50%"');
  });

  it("transforms typography properties", () => {
    const input = `<div className="animate-hover:text-size-20 animate-hover:tracking-2">Type</div>`;
    const output = transform(input);
    expect(output).toContain("fontSize: 20");
    expect(output).toContain("letterSpacing: 2");
  });

  it("transforms borderWidth", () => {
    const input = `<div className="animate-hover:border-w-2">Border</div>`;
    const output = transform(input);
    expect(output).toContain("borderWidth: 2");
  });

  it("transforms clipPath", () => {
    const input = `<div className="animate-enter:clip-[inset(0)]">Clip</div>`;
    const output = transform(input);
    expect(output).toContain('clipPath: "inset(0)"');
  });

  // --- Template literal support ---

  it("transforms template literal with static animate classes", () => {
    const input = "<div className={`bg-blue-500 animate-hover:scale-110 ${cls}`}>Hello</div>";
    const output = transform(input);
    expect(output).toContain("motion.div");
    expect(output).toContain("whileHover");
    expect(output).toContain("scale: 1.1");
    // Dynamic part is preserved
    expect(output).toContain("${cls}");
  });

  it("transforms template literal with multiple animate classes", () => {
    const input = "<div className={`animate-initial:opacity-0 animate-enter:opacity-100 animate-duration-500 p-4 ${cls}`}>Hello</div>";
    const output = transform(input);
    expect(output).toContain("motion.div");
    expect(output).toContain("initial");
    expect(output).toContain("opacity: 0");
    expect(output).toContain("opacity: 1");
    expect(output).toContain("duration: 0.5");
  });

  it("preserves non-animate classes in template literal", () => {
    const input = "<div className={`p-4 text-white animate-hover:scale-110 ${cls}`}>Hello</div>";
    const output = transform(input);
    expect(output).toContain("p-4");
    expect(output).toContain("text-white");
  });

  it("transforms template literal with only static animate classes (no expressions)", () => {
    const input = "<div className={`animate-hover:scale-110 bg-blue-500`}>Hello</div>";
    const output = transform(input);
    expect(output).toContain("motion.div");
    expect(output).toContain("whileHover");
  });

  // --- Custom component support ---

  it("transforms custom component with motion.create", () => {
    const input = `<Card className="animate-hover:scale-105 animate-spring">Click</Card>`;
    const output = transform(input);
    expect(output).toContain("motion.create(Card)");
    expect(output).toContain("_mw_Card");
    expect(output).toContain("whileHover");
    expect(output).toContain("scale: 1.05");
    expect(output).toContain('type: "spring"');
  });

  it("creates motion.create only once for same component used twice", () => {
    const input = `<><Card className="animate-hover:scale-110">A</Card><Card className="animate-tap:scale-90">B</Card></>`;
    const output = transform(input);
    const createCount = (output.match(/motion\.create\(Card\)/g) || []).length;
    expect(createCount).toBe(1);
    expect(output).toContain("_mw_Card");
  });

  it("creates separate motion.create for different components", () => {
    const input = `<><Card className="animate-hover:scale-110">A</Card><Badge className="animate-tap:scale-90">B</Badge></>`;
    const output = transform(input);
    expect(output).toContain("motion.create(Card)");
    expect(output).toContain("motion.create(Badge)");
    expect(output).toContain("_mw_Card");
    expect(output).toContain("_mw_Badge");
  });

  it("skips custom component without animate classes", () => {
    const input = `<Card className="p-4 bg-blue-500">Click</Card>`;
    const output = transform(input);
    expect(output).not.toContain("motion.create");
    expect(output).toContain("Card");
  });

});
