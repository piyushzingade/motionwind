import { describe, it, expect } from "vitest";
import { migrateSource } from "../src/migrate/transform.js";

describe("migrateSource", () => {
  it("converts hover/tap gestures to classes and drops the motion import", () => {
    const input = `import { motion } from "motion/react";
export const Btn = () => (
  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="px-4">
    Click
  </motion.button>
);`;
    const { code, converted, skipped } = migrateSource(input);
    expect(converted).toBe(1);
    expect(skipped).toBe(0);
    expect(code).toContain("animate-hover:scale-110");
    expect(code).toContain("animate-tap:scale-90");
    expect(code).toContain("px-4");
    expect(code).not.toContain("motion.button");
    expect(code).not.toContain("motion/react");
  });

  it("converts transition + enter animation", () => {
    const input = `import { motion } from "motion/react";
const A = () => <motion.div animate={{ opacity: 1 }} transition={{ duration: 0.3, type: "spring" }} />;`;
    const { code } = migrateSource(input);
    expect(code).toContain("animate-enter:opacity-100");
    expect(code).toContain("animate-duration-300");
    expect(code).toContain("animate-spring");
    expect(code).toContain("<div");
  });

  it("converts x/y translate and viewport", () => {
    const input = `import { motion } from "motion/react";
const A = () => <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} />;`;
    const { code } = migrateSource(input);
    expect(code).toContain("animate-initial:opacity-0");
    expect(code).toContain("animate-initial:y-20");
    expect(code).toContain("animate-inview:opacity-100");
    expect(code).toContain("animate-once");
  });

  it("skips elements with dynamic prop values", () => {
    const input = `import { motion } from "motion/react";
const A = ({ s }) => <motion.div animate={{ opacity: s }} />;`;
    const { code, converted, skipped } = migrateSource(input);
    expect(converted).toBe(0);
    expect(skipped).toBe(1);
    expect(code).toContain("motion.div"); // left untouched
  });

  it("skips elements with unsupported motion-only props", () => {
    const input = `import { motion } from "motion/react";
const A = ({ v }) => <motion.div variants={v} animate="visible" />;`;
    const { converted, skipped } = migrateSource(input);
    expect(converted).toBe(0);
    expect(skipped).toBe(1);
  });

  it("keeps the motion import when some elements can't convert", () => {
    const input = `import { motion } from "motion/react";
const A = ({ v }) => (
  <>
    <motion.div whileHover={{ scale: 1.1 }} />
    <motion.div variants={v} animate="visible" />
  </>
);`;
    const { code, converted, skipped } = migrateSource(input);
    expect(converted).toBe(1);
    expect(skipped).toBe(1);
    expect(code).toContain("motion/react"); // still used by the skipped element
    expect(code).toContain("animate-hover:scale-110");
  });

  it("handles negative values", () => {
    const input = `import { motion } from "motion/react";
const A = () => <motion.div whileHover={{ x: -20 }} />;`;
    const { code } = migrateSource(input);
    expect(code).toContain("animate-hover:-x-20");
  });
});
