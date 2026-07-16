import { describe, expect, it, vi } from "vitest";
import {
  MOTIONWIND_SYNTAX_REGISTRY,
  defineConfig,
  defineMotionwindPlugin,
  parseMotionClasses,
  unsupportedCapabilities,
} from "../src/index.js";

describe("Motionwind v2 platform", () => {
  it("expands named duration, easing, spring, and preset tokens", () => {
    const config = defineConfig({
      tokens: {
        durations: { fast: 160 },
        easings: { product: [0.22, 1, 0.36, 1] },
        springs: { responsive: { stiffness: 420, damping: 28 } },
      },
      presets: {
        reveal: "animate-initial:opacity-0 animate-enter:opacity-100",
      },
    });
    const parsed = parseMotionClasses(
      "animate-duration-fast animate-ease-product animate-spring-responsive animate-preset-reveal",
      config,
    );

    expect(parsed.transition).toMatchObject({
      duration: 0.16,
      ease: [0.22, 1, 0.36, 1],
      type: "spring",
      stiffness: 420,
      damping: 28,
    });
    expect(parsed.gestures.initial).toEqual({ opacity: 0 });
    expect(parsed.gestures.animate).toEqual({ opacity: 1 });
    expect(parsed.diagnostics).toEqual([]);
  });

  it("runs plugin transforms and attaches plugin diagnostics", () => {
    const plugin = defineMotionwindPlugin({
      name: "product-motion",
      version: "2.0.0",
      core: ">=2 <3",
      transformToken(token) {
        return token === "animate-product-pop"
          ? { gestures: { animate: { scale: 1.08 } } }
          : null;
      },
      diagnose: () => [
        {
          code: "product-guidance",
          message: "Use this emphasis once per view.",
          severity: "info" as const,
        },
      ],
    });
    const parsed = parseMotionClasses("animate-product-pop", {
      plugins: [plugin],
    });

    expect(parsed.gestures.animate).toEqual({ scale: 1.08 });
    expect(parsed.diagnostics).toContainEqual(
      expect.objectContaining({
        code: "product-guidance",
        plugin: "product-motion",
      }),
    );
  });

  it("promotes unknown syntax to strict errors", () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => {});
    const parsed = parseMotionClasses("animate-preset-does-not-exist", {
      strict: true,
    });
    expect(
      parsed.diagnostics.some(({ severity }) => severity === "error"),
    ).toBe(true);
    warning.mockRestore();
  });

  it("reports unsupported SVG capabilities", () => {
    const parsed = parseMotionClasses("animate-enter:path-length-1");
    expect(
      unsupportedCapabilities(parsed, {
        gestures: true,
        scroll: true,
        layout: true,
        drag: true,
        variants: true,
        svg: false,
        "reduced-motion": true,
      }),
    ).toContain("svg");
  });

  it("keeps registry ids unique", () => {
    const ids = MOTIONWIND_SYNTAX_REGISTRY.map(({ id }) => id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
