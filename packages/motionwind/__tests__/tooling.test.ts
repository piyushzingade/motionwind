import { describe, it, expect, beforeEach } from "vitest";
import { clearParserCache, classifyMotionToken } from "../src/parser.js";
import { analyzeClassName, sortMotionClasses } from "../src/analysis.js";
import { generateMotionCode } from "../src/codegen.js";

beforeEach(() => clearParserCache());

describe("classifyMotionToken", () => {
  it("classifies each category", () => {
    expect(classifyMotionToken("px-4")).toBe("tailwind");
    expect(classifyMotionToken("animate-spin")).toBe("tailwind");
    expect(classifyMotionToken("animate-hover:scale-110")).toBe("gesture");
    expect(classifyMotionToken("animate-spring")).toBe("transition");
    expect(classifyMotionToken("animate-once")).toBe("viewport");
    expect(classifyMotionToken("animate-drag-x")).toBe("drag");
    expect(classifyMotionToken("animate-layout")).toBe("layout");
    expect(classifyMotionToken("animate-scroll:y-[0,-200]")).toBe("scroll");
    expect(classifyMotionToken("animate-scroll-container")).toBe("scroll");
    expect(classifyMotionToken("animate-variant-hidden:opacity-0")).toBe(
      "variant",
    );
    expect(classifyMotionToken("animate-to-visible")).toBe("variant");
    expect(classifyMotionToken("animate-bogus-99")).toBe("unknown");
  });
});

describe("analyzeClassName", () => {
  it("reports unknown animate-* classes", () => {
    const { unknown } = analyzeClassName(
      "px-4 animate-hover:scale-110 animate-nope-1",
    );
    expect(unknown).toEqual(["animate-nope-1"]);
  });

  it("does not flag known scroll/variant classes as unknown", () => {
    const { unknown } = analyzeClassName(
      "animate-scroll:y-[0,-200] animate-scroll-container animate-variant-hidden:opacity-0 animate-to-hidden",
    );
    expect(unknown).toEqual([]);
  });

  it("reports duplicate properties within a gesture", () => {
    const { duplicates } = analyzeClassName(
      "animate-hover:scale-110 animate-hover:scale-90",
    );
    expect(duplicates).toEqual([{ gesture: "whileHover", prop: "scale" }]);
  });

  it("does not flag combinable filter functions as duplicates", () => {
    const { duplicates } = analyzeClassName(
      "animate-hover:blur-10 animate-hover:brightness-50",
    );
    expect(duplicates).toEqual([]);
  });
});

describe("sortMotionClasses", () => {
  it("orders classes into the canonical order", () => {
    const input =
      "px-4 animate-hover:scale-110 animate-spring animate-variant-hidden:opacity-0 bg-blue-500 animate-once";
    expect(sortMotionClasses(input)).toBe(
      "animate-variant-hidden:opacity-0 animate-hover:scale-110 animate-spring animate-once px-4 bg-blue-500",
    );
  });

  it("is stable within a category", () => {
    expect(
      sortMotionClasses("animate-hover:scale-110 animate-tap:scale-90"),
    ).toBe("animate-hover:scale-110 animate-tap:scale-90");
  });
});

describe("generateMotionCode", () => {
  it("generates motion.* JSX for gestures + transition", () => {
    const code = generateMotionCode(
      "button",
      "px-4 animate-hover:scale-110 animate-spring",
    );
    expect(code).toContain("motion.button");
    expect(code).toContain('className="px-4"');
    expect(code).toContain("whileHover={{ scale: 1.1 }}");
    expect(code).toContain('transition={{ type: "spring" }}');
  });

  it("renders scroll-linked classes as the mw.* runtime", () => {
    const code = generateMotionCode("div", "animate-scroll:y-[0,-200]");
    expect(code).toContain("mw.div");
    expect(code).toContain("animate-scroll:y-[0,-200]");
  });

  it("emits variants and string state selectors", () => {
    const code = generateMotionCode(
      "div",
      "animate-variant-hidden:opacity-0 animate-variant-visible:opacity-100 animate-from-hidden animate-to-visible",
    );
    expect(code).toContain("variants={");
    expect(code).toContain('initial="hidden"');
    expect(code).toContain('animate="visible"');
  });

  it("uses motion.create for custom components", () => {
    const code = generateMotionCode("Card", "animate-hover:scale-110");
    expect(code).toContain("motion.create(Card)");
    expect(code).toContain("_mw_Card");
  });
});
