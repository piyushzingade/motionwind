import { describe, it, expect } from "vitest";
import { motionwind } from "../src/vite.js";

describe("vite plugin", () => {
  const plugin = motionwind();

  it("has correct plugin name and enforce", () => {
    expect(plugin.name).toBe("motionwind");
    expect(plugin.enforce).toBe("pre");
  });

  it("skips non-JSX/TSX files", () => {
    const result = plugin.transform!(
      '<div className="animate-hover:scale-110">test</div>',
      "test.ts",
    );
    expect(result).toBeNull();
  });

  it("skips files without animate-", () => {
    const result = plugin.transform!(
      '<div className="px-4 bg-blue-500">test</div>',
      "test.tsx",
    );
    expect(result).toBeNull();
  });

  it("transforms JSX files", () => {
    const result = plugin.transform!(
      '<div className="animate-hover:scale-110">test</div>',
      "test.jsx",
    );
    expect(result).not.toBeNull();
    expect(result!.code).toContain("motion.div");
  });

  it("transforms TSX files with TypeScript syntax", () => {
    const code = `
      interface Props { title: string; }
      function Card({ title }: Props) {
        return <div className="p-4 animate-hover:scale-105">{title}</div>;
      }
    `;
    const result = plugin.transform!(code, "Card.tsx");
    expect(result).not.toBeNull();
    expect(result!.code).toContain("motion.div");
    expect(result!.code).toContain("scale: 1.05");
  });

  it("handles TSX with type annotations and generics", () => {
    const code = `
      type ListProps<T> = { items: T[]; renderItem: (item: T) => React.ReactNode; };
      function AnimatedList<T>({ items, renderItem }: ListProps<T>) {
        return (
          <ul className="space-y-2">
            {items.map((item, i) => (
              <li key={i} className="animate-initial:opacity-0 animate-initial:y-10 animate-inview:opacity-100 animate-inview:y-0 animate-once">
                {renderItem(item)}
              </li>
            ))}
          </ul>
        );
      }
    `;
    const result = plugin.transform!(code, "AnimatedList.tsx");
    expect(result).not.toBeNull();
    expect(result!.code).toContain("motion.li");
    expect(result!.code).not.toContain("motion.ul");
  });

  it("returns source maps", () => {
    const result = plugin.transform!(
      '<div className="animate-hover:scale-110">test</div>',
      "test.tsx",
    );
    expect(result).not.toBeNull();
    expect(result!.map).toBeDefined();
  });
});
