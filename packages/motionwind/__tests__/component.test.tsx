import { describe, it, expect, vi } from "vitest";
import React from "react";

// Mock motion/react before importing the component
vi.mock("motion/react", () => {
  const createMockMotion = () => {
    return new Proxy(
      {},
      {
        get(_target, prop) {
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
  };
});

import { render, screen } from "@testing-library/react";
import { mw } from "../src/component.js";

describe("mw runtime component", () => {
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
    render(
      <mw.span className="animate-hover:scale-110">Test Text</mw.span>,
    );
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
});
