import { describe, it, expect, vi } from "vitest";
import React from "react";

// Mock motion/react before importing the component
vi.mock("motion/react", () => {
  const createMockMotion = () => {
    return new Proxy(
      {},
      {
        get(_target, prop) {
          if (prop === "create") {
            return (CustomComponent: React.ElementType) => {
              const MotionCustom = React.forwardRef(
                (props: Record<string, unknown>, ref: React.Ref<unknown>) =>
                  React.createElement(CustomComponent, {
                    ...props,
                    ref,
                    "data-motion": "true",
                  }),
              );
              MotionCustom.displayName = "motion.create(MockComponent)";
              return MotionCustom;
            };
          }
          // Return a simple forwarding component for each tag
          const Component = React.forwardRef(
            (props: Record<string, unknown>, ref: React.Ref<unknown>) => {
              return React.createElement(prop as string, {
                ...props,
                ref,
                "data-motion": "true",
              });
            },
          );
          Component.displayName = `motion.${String(prop)}`;
          return Component;
        },
      },
    );
  };

  return {
    motion: createMockMotion(),
    MotionConfig: ({ children }: { children: React.ReactNode }) => children,
    useScroll: () => ({ scrollXProgress: 0, scrollYProgress: 0 }),
    useTransform: (
      _progress: unknown,
      _input: unknown,
      output: number[] | number,
    ) => (Array.isArray(output) ? output[0] : output),
  };
});

import { render, screen } from "@testing-library/react";
import { MotionwindProvider, mw } from "../src/component.js";

describe("mw runtime component", () => {
  it("emits an OS-aware reduced-motion policy", () => {
    const { container } = render(
      <MotionwindProvider config={{ reducedMotion: "user" }}>
        <mw.button className="animate-hover:scale-110">Save</mw.button>
      </MotionwindProvider>,
    );
    const style = container.querySelector("[data-motionwind-reduced-motion]");
    expect(style?.textContent).toContain("prefers-reduced-motion: reduce");
    expect(style?.textContent).toContain("transform: none !important");
    expect(
      container.querySelector("button")?.hasAttribute("data-motionwind-motion"),
    ).toBe(true);
  });

  it("renders a plain element when no motion classes", () => {
    const { container } = render(
      <mw.div className="px-4 bg-blue-500">Hello</mw.div>,
    );
    const el = container.firstChild as HTMLElement;
    expect(el.tagName).toBe("DIV");
    expect(el.className).toBe("px-4 bg-blue-500");
    expect(el.getAttribute("data-motion")).toBeNull();
  });

  it("renders a motion element when animate classes present", () => {
    const { container } = render(
      <mw.button className="px-4 animate-hover:scale-110">Click</mw.button>,
    );
    const el = container.firstChild as HTMLElement;
    expect(el.getAttribute("data-motion")).toBe("true");
  });

  it("passes through non-motion className", () => {
    const { container } = render(
      <mw.div className="px-4 bg-blue-500 animate-hover:scale-110">
        Hello
      </mw.div>,
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toBe("px-4 bg-blue-500");
  });

  it("renders text content", () => {
    render(<mw.span className="animate-hover:scale-110">Test Text</mw.span>);
    expect(screen.getByText("Test Text")).toBeTruthy();
  });

  it("caches components per tag", () => {
    const Comp1 = mw.div;
    const Comp2 = mw.div;
    expect(Comp1).toBe(Comp2);
  });

  it("creates different components for different tags", () => {
    const Div = mw.div;
    const Span = mw.span;
    expect(Div).not.toBe(Span);
  });

  it("creates and caches typed design-system wrappers", () => {
    const Button = React.forwardRef<
      HTMLButtonElement,
      React.ComponentProps<"button">
    >((props, ref) => <button ref={ref} {...props} />);
    Button.displayName = "Button";
    const MotionButton = mw.create(Button);
    expect(mw.create(Button)).toBe(MotionButton);

    const { container } = render(
      <MotionButton className="primary animate-tap:scale-95">
        Save
      </MotionButton>,
    );
    const element = container.firstChild as HTMLElement;
    expect(element.className).toBe("primary");
    expect(element.dataset.motion).toBe("true");
  });

  describe("scroll-linked", () => {
    it("renders a scroll-linked element with mapped style", () => {
      const { container } = render(
        <mw.div className="animate-scroll:opacity-[1,0]">Fade</mw.div>,
      );
      const el = container.firstChild as HTMLElement;
      expect(el.getAttribute("data-motion")).toBe("true");
      // useTransform mock returns the first output value (1)
      expect(el.style.opacity).toBe("1");
    });
  });

  describe("named variants", () => {
    it("passes variant state selectors through to the motion element", () => {
      const { container } = render(
        <mw.div className="animate-variant-hidden:opacity-0 animate-variant-visible:opacity-100 animate-from-hidden animate-to-visible">
          x
        </mw.div>,
      );
      const el = container.firstChild as HTMLElement;
      expect(el.getAttribute("data-motion")).toBe("true");
      expect(el.getAttribute("initial")).toBe("hidden");
      expect(el.getAttribute("animate")).toBe("visible");
    });
  });
});
