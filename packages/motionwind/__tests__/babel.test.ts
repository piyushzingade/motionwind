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

  it("skips component elements (uppercase)", () => {
    const input = `<Button className="animate-hover:scale-110">Click</Button>`;
    const output = transform(input);
    expect(output).not.toContain("motion.");
    expect(output).toContain("Button");
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
});
