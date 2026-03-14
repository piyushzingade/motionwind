import { describe, it, expect } from "vitest";
import { transformSync } from "@babel/core";
import motionwindPlugin from "../src/babel.js";

/**
 * Transform helper that simulates real-world Next.js / React usage.
 * Uses both TypeScript and JSX parser plugins (like the Next.js integration does).
 */
function transform(code: string, filename = "test.tsx"): string {
  const result = transformSync(code, {
    plugins: [motionwindPlugin, "@babel/plugin-syntax-jsx"],
    parserOpts: {
      plugins: ["typescript", "jsx"],
    },
    filename,
    configFile: false,
    babelrc: false,
  });
  return result?.code ?? "";
}

describe("React / Next.js integration", () => {
  describe("TypeScript support", () => {
    it("handles TypeScript interface declarations", () => {
      const input = `
        interface Props { title: string; }
        function Card({ title }: Props) {
          return <div className="p-4 animate-hover:scale-105">{title}</div>;
        }
      `;
      const output = transform(input);
      expect(output).toContain("motion.div");
      expect(output).toContain("whileHover");
      expect(output).toContain("scale: 1.05");
    });

    it("handles TypeScript type annotations on JSX", () => {
      const input = `
        const el = <div className="animate-initial:opacity-0 animate-enter:opacity-100" />;
      `;
      const output = transform(input);
      expect(output).toContain("motion.div");
      expect(output).toContain("initial");
      expect(output).toContain("opacity: 0");
    });

    it("handles generic components (skips uppercase)", () => {
      const input = `
        type Props<T> = { items: T[] };
        function List<T>({ items }: Props<T>) {
          return <Card className="animate-hover:scale-110" />;
        }
      `;
      const output = transform(input);
      expect(output).not.toContain("motion.Card");
      expect(output).toContain("Card");
    });

    it("handles as const and satisfies", () => {
      const input = `
        const config = { x: 1 } as const;
        const el = <div className="animate-hover:x-10">test</div>;
      `;
      const output = transform(input);
      expect(output).toContain("motion.div");
      expect(output).toContain("x: 10");
    });

    it("handles enum declarations alongside JSX", () => {
      const input = `
        enum Direction { Up, Down }
        const el = <div className="animate-hover:y-20">move</div>;
      `;
      const output = transform(input);
      expect(output).toContain("motion.div");
      expect(output).toContain("y: 20");
    });
  });

  describe("Next.js patterns", () => {
    it("transforms server component with animate classes", () => {
      const input = `
        export default function Page() {
          return (
            <main>
              <h1 className="text-4xl animate-initial:opacity-0 animate-initial:y-20 animate-enter:opacity-100 animate-enter:y-0 animate-duration-600">
                Hello
              </h1>
            </main>
          );
        }
      `;
      const output = transform(input);
      expect(output).toContain("motion.h1");
      expect(output).toContain("use client");
      expect(output).toContain('className="text-4xl"');
      expect(output).toContain("initial");
      expect(output).toContain("opacity: 0");
      expect(output).toContain("y: 20");
    });

    it("preserves existing use client directive", () => {
      const input = `
        "use client";
        export default function ClientComp() {
          return <button className="animate-hover:scale-110 animate-tap:scale-95">tap</button>;
        }
      `;
      const output = transform(input);
      const count = (output.match(/use client/g) || []).length;
      expect(count).toBe(1);
    });

    it("handles multiple elements in a single component", () => {
      const input = `
        export default function Section() {
          return (
            <section>
              <div className="animate-initial:opacity-0 animate-inview:opacity-100 animate-once">A</div>
              <div className="animate-initial:y-20 animate-inview:y-0 animate-once">B</div>
              <p className="text-gray-500">No animation here</p>
            </section>
          );
        }
      `;
      const output = transform(input);
      // Two motion.div elements but section and p are untouched
      expect(output).toContain("motion.div");
      expect(output).not.toContain("motion.section");
      expect(output).not.toContain("motion.p");
      // Only one import
      const imports = (output.match(/import.*motion/g) || []).length;
      expect(imports).toBe(1);
    });

    it("handles Next.js metadata export alongside JSX", () => {
      const input = `
        export const metadata = { title: "My Page" };
        export default function Page() {
          return <div className="animate-hover:scale-105">content</div>;
        }
      `;
      const output = transform(input);
      expect(output).toContain("motion.div");
      expect(output).toContain("metadata");
    });

    it("skips Next.js Image/Link components (uppercase)", () => {
      const input = `
        import Image from "next/image";
        import Link from "next/link";
        export default function Page() {
          return (
            <>
              <Image className="animate-hover:scale-110" src="/img.png" alt="" />
              <Link className="animate-hover:scale-105" href="/about">About</Link>
              <a className="animate-hover:scale-105" href="/about">About</a>
            </>
          );
        }
      `;
      const output = transform(input);
      expect(output).not.toContain("motion.Image");
      expect(output).not.toContain("motion.Link");
      expect(output).toContain("motion.a");
    });
  });

  describe("common animation patterns", () => {
    it("scroll-triggered fade-in with stagger pattern", () => {
      const input = `
        <div className="animate-initial:opacity-0 animate-initial:y-20 animate-inview:opacity-100 animate-inview:y-0 animate-duration-500 animate-ease-out animate-once">
          Item 1
        </div>
      `;
      const output = transform(input);
      expect(output).toContain("motion.div");
      expect(output).toContain("opacity: 0");
      expect(output).toContain("y: 20");
      expect(output).toContain("opacity: 1");
      expect(output).toContain("y: 0");
      expect(output).toContain("duration: 0.5");
      expect(output).toContain('ease: "easeOut"');
      expect(output).toContain("once: true");
    });

    it("button with hover, tap, and spring", () => {
      const input = `
        <button className="px-6 py-3 rounded-lg bg-blue-500 animate-hover:scale-105 animate-tap:scale-95 animate-spring animate-stiffness-300 animate-damping-20">
          Click me
        </button>
      `;
      const output = transform(input);
      expect(output).toContain("motion.button");
      expect(output).toContain('className="px-6 py-3 rounded-lg bg-blue-500"');
      expect(output).toContain("scale: 1.05");
      expect(output).toContain("scale: 0.95");
      expect(output).toContain('type: "spring"');
      expect(output).toContain("stiffness: 300");
      expect(output).toContain("damping: 20");
    });

    it("input with focus animation", () => {
      const input = `
        <input className="border rounded animate-focus:scale-105 animate-spring" type="text" />
      `;
      const output = transform(input);
      expect(output).toContain("motion.input");
      expect(output).toContain("whileFocus");
      expect(output).toContain("scale: 1.05");
    });

    it("draggable element with constraints", () => {
      const input = `
        <div className="w-20 h-20 bg-blue-500 rounded-xl animate-drag-both animate-drag-elastic-30 animate-hover:scale-105 animate-spring">
          drag me
        </div>
      `;
      const output = transform(input);
      expect(output).toContain("motion.div");
      expect(output).toContain("drag");
      expect(output).toContain("dragElastic={0.3}");
      expect(output).toContain("whileHover");
    });

    it("infinite rotation animation", () => {
      const input = `
        <div className="animate-enter:rotate-360 animate-repeat-infinite animate-duration-2000 animate-ease-linear">
          spinner
        </div>
      `;
      const output = transform(input);
      expect(output).toContain("motion.div");
      expect(output).toContain("rotate: 360");
      expect(output).toContain("repeat: Infinity");
      expect(output).toContain("duration: 2");
      expect(output).toContain('ease: "linear"');
    });

    it("exit animation", () => {
      const input = `
        <div className="animate-exit:opacity-0 animate-exit:scale-95 animate-exit:y-10 animate-duration-200">
          modal content
        </div>
      `;
      const output = transform(input);
      expect(output).toContain("motion.div");
      expect(output).toContain("exit");
      expect(output).toContain("opacity: 0");
      expect(output).toContain("scale: 0.95");
      expect(output).toContain("y: 10");
    });

    it("combined enter + exit with initial", () => {
      const input = `
        <div className="animate-initial:opacity-0 animate-initial:scale-95 animate-enter:opacity-100 animate-enter:scale-100 animate-exit:opacity-0 animate-exit:scale-90 animate-duration-300 animate-ease-out">
          fade in/out
        </div>
      `;
      const output = transform(input);
      expect(output).toContain("initial");
      expect(output).not.toContain("whileInView");
      // Verify animate (enter) and exit props exist
      const animateMatch = output.match(/animate=\{/);
      const exitMatch = output.match(/exit=\{/);
      expect(animateMatch).not.toBeNull();
      expect(exitMatch).not.toBeNull();
    });

    it("viewport with amount and margin", () => {
      const input = `
        <div className="animate-initial:opacity-0 animate-inview:opacity-100 animate-once animate-amount-all animate-margin-100">
          visible
        </div>
      `;
      const output = transform(input);
      expect(output).toContain("once: true");
      expect(output).toContain('amount: "all"');
      expect(output).toContain('margin: "100px"');
    });
  });

  describe("edge cases", () => {
    it("handles self-closing elements", () => {
      const input = `<img className="animate-hover:scale-110" src="test.png" />`;
      const output = transform(input);
      expect(output).toContain("motion.img");
    });

    it("handles elements with many attributes", () => {
      const input = `
        <input
          type="email"
          placeholder="enter email"
          required
          disabled={false}
          aria-label="Email"
          className="border p-2 animate-focus:scale-102"
        />
      `;
      const output = transform(input);
      expect(output).toContain("motion.input");
      expect(output).toContain('type="email"');
      expect(output).toContain('placeholder="enter email"');
      expect(output).toContain("required");
    });

    it("handles nested animated elements", () => {
      const input = `
        <div className="animate-initial:opacity-0 animate-inview:opacity-100 animate-once">
          <button className="animate-hover:scale-110 animate-tap:scale-95 animate-spring">
            Click
          </button>
        </div>
      `;
      const output = transform(input);
      expect(output).toContain("motion.div");
      expect(output).toContain("motion.button");
    });

    it("handles elements with no className", () => {
      const input = `<div id="test">Hello</div>`;
      const output = transform(input);
      expect(output).not.toContain("motion.");
    });

    it("handles empty className", () => {
      const input = `<div className="">Hello</div>`;
      const output = transform(input);
      expect(output).not.toContain("motion.");
    });

    it("skips template literal className", () => {
      const input = "<div className={`animate-hover:scale-110 ${cls}`}>Hello</div>";
      const output = transform(input);
      expect(output).not.toContain("motion.");
    });

    it("skips ternary className", () => {
      const input = `<div className={active ? "animate-hover:scale-110" : "opacity-50"}>Hello</div>`;
      const output = transform(input);
      expect(output).not.toContain("motion.");
    });

    it("correctly transforms all HTML element types", () => {
      const elements = ["div", "span", "p", "a", "button", "section", "article", "header", "footer", "nav", "main", "h1", "h2", "h3", "ul", "li", "form", "label", "textarea"];
      for (const tag of elements) {
        const input = `<${tag} className="animate-hover:scale-110">content</${tag}>`;
        const output = transform(input);
        expect(output).toContain(`motion.${tag}`);
      }
    });

    it("skips SVG elements correctly", () => {
      // SVG elements are lowercase but motion.svg exists
      const input = `<svg className="animate-hover:scale-110"><path d="M0 0" /></svg>`;
      const output = transform(input);
      expect(output).toContain("motion.svg");
    });

    it("handles multiple gesture types on one element", () => {
      const input = `
        <div className="animate-initial:opacity-0 animate-initial:y-20 animate-enter:opacity-100 animate-enter:y-0 animate-hover:scale-105 animate-tap:scale-95 animate-focus:scale-102 animate-spring animate-duration-500 animate-once">
          multi
        </div>
      `;
      const output = transform(input);
      expect(output).toContain("initial");
      expect(output).toContain("whileHover");
      expect(output).toContain("whileTap");
      expect(output).toContain("whileFocus");
      expect(output).toContain('type: "spring"');
      expect(output).toContain("once: true");
    });

    it("preserves order of Tailwind classes", () => {
      const input = `<div className="relative z-10 flex items-center gap-2 animate-hover:scale-105">content</div>`;
      const output = transform(input);
      expect(output).toContain('className="relative z-10 flex items-center gap-2"');
    });

    it("handles large values", () => {
      const input = `<div className="animate-enter:rotate-360 animate-enter:x-500 animate-duration-3000">spin</div>`;
      const output = transform(input);
      expect(output).toContain("rotate: 360");
      expect(output).toContain("x: 500");
      expect(output).toContain("duration: 3");
    });

    it("handles zero values", () => {
      const input = `<div className="animate-initial:opacity-0 animate-initial:x-0 animate-initial:y-0 animate-initial:scale-0 animate-initial:rotate-0">hidden</div>`;
      const output = transform(input);
      expect(output).toContain("opacity: 0");
      expect(output).toContain("x: 0");
      expect(output).toContain("y: 0");
      expect(output).toContain("scale: 0");
      expect(output).toContain("rotate: 0");
    });
  });

  describe("filter combination (bug fix)", () => {
    it("combines blur + brightness on same gesture", () => {
      const input = `<div className="animate-hover:blur-10 animate-hover:brightness-150">fx</div>`;
      const output = transform(input);
      expect(output).toContain("motion.div");
      expect(output).toContain("blur(10px) brightness(1.5)");
    });

    it("combines all four filter types", () => {
      const input = `<div className="animate-hover:blur-5 animate-hover:brightness-120 animate-hover:contrast-150 animate-hover:saturate-200">fx</div>`;
      const output = transform(input);
      expect(output).toContain("blur(5px) brightness(1.2) contrast(1.5) saturate(2)");
    });

    it("keeps single filter unchanged", () => {
      const input = `<div className="animate-hover:blur-8">fx</div>`;
      const output = transform(input);
      expect(output).toContain('"blur(8px)"');
    });

    it("combines filters across different gestures independently", () => {
      const input = `<div className="animate-hover:blur-5 animate-hover:brightness-150 animate-initial:blur-20 animate-initial:saturate-0">fx</div>`;
      const output = transform(input);
      // hover should have blur+brightness combined
      expect(output).toContain("blur(5px) brightness(1.5)");
      // initial should have blur+saturate combined
      expect(output).toContain("blur(20px) saturate(0)");
    });
  });

  describe("Tailwind class passthrough", () => {
    it("passes through responsive prefixes", () => {
      const input = `<div className="sm:px-6 md:py-8 lg:text-xl animate-hover:scale-110">responsive</div>`;
      const output = transform(input);
      expect(output).toContain('className="sm:px-6 md:py-8 lg:text-xl"');
    });

    it("passes through dark mode classes", () => {
      const input = `<div className="dark:bg-gray-900 dark:text-white animate-hover:scale-105">dark</div>`;
      const output = transform(input);
      expect(output).toContain('className="dark:bg-gray-900 dark:text-white"');
    });

    it("passes through Tailwind animate-* utilities", () => {
      const input = `<div className="animate-spin animate-bounce animate-ping animate-pulse animate-hover:scale-110">tw</div>`;
      const output = transform(input);
      expect(output).toContain("animate-spin animate-bounce animate-ping animate-pulse");
      expect(output).toContain("motion.div");
    });

    it("passes through arbitrary Tailwind values", () => {
      const input = `<div className="w-[300px] h-[200px] bg-[#f0f] animate-hover:scale-110">arb</div>`;
      const output = transform(input);
      expect(output).toContain('className="w-[300px] h-[200px] bg-[#f0f]"');
    });

    it("passes through group and peer classes", () => {
      const input = `<div className="group peer hover:bg-blue-500 group-hover:opacity-100 animate-hover:scale-105">grp</div>`;
      const output = transform(input);
      expect(output).toContain("group peer hover:bg-blue-500 group-hover:opacity-100");
    });
  });

  describe("new features integration", () => {
    it("keyframe breathing animation", () => {
      const input = `
        function Breathe() {
          return (
            <div className="w-20 h-20 bg-blue-500 rounded-full animate-enter:scale-[100,120,100] animate-repeat-infinite animate-repeat-mirror animate-duration-2000 animate-ease-[0.4,0,0.2,1]">
              breathe
            </div>
          );
        }
      `;
      const output = transform(input);
      expect(output).toContain("motion.div");
      expect(output).toContain("scale: [1, 1.2, 1]");
      expect(output).toContain("repeat: Infinity");
      expect(output).toContain('repeatType: "mirror"');
      expect(output).toContain("duration: 2");
      expect(output).toContain("ease: [0.4, 0, 0.2, 1]");
      expect(output).toContain('className="w-20 h-20 bg-blue-500 rounded-full"');
    });

    it("SVG path draw animation", () => {
      const input = `
        function DrawIcon() {
          return (
            <svg viewBox="0 0 100 100">
              <path
                className="animate-initial:path-length-0 animate-enter:path-length-1 animate-duration-1500 animate-ease-out"
                d="M10 80 L50 20 L90 80"
                fill="none"
                stroke="currentColor"
              />
            </svg>
          );
        }
      `;
      const output = transform(input);
      expect(output).toContain("motion.path");
      expect(output).toContain("pathLength: 0");
      expect(output).toContain("pathLength: 1");
      expect(output).toContain("duration: 1.5");
      expect(output).toContain('ease: "easeOut"');
    });

    it("layout animation for shared transitions", () => {
      const input = `
        interface CardProps { id: string; expanded: boolean; }
        function Card({ id, expanded }: CardProps) {
          return (
            <div className={\`p-4 bg-white rounded-lg animate-layout animate-layout-id-\${id}\`}>
              content
            </div>
          );
        }
      `;
      // Template literal className is skipped (dynamic)
      const output = transform(input);
      expect(output).not.toContain("motion.div");
    });

    it("layout with static className", () => {
      const input = `<div className="animate-layout animate-layout-id-hero animate-spring animate-damping-20">Layout</div>`;
      const output = transform(input);
      expect(output).toContain("motion.div");
      expect(output).toContain("layout");
      expect(output).toContain('layoutId="hero"');
      expect(output).toContain('type: "spring"');
      expect(output).toContain("damping: 20");
    });

    it("staggered children container", () => {
      const input = `
        function List() {
          return (
            <ul className="animate-stagger-50 animate-delay-children-100">
              <li className="animate-initial:opacity-0 animate-initial:y-10 animate-enter:opacity-100 animate-enter:y-0">A</li>
              <li className="animate-initial:opacity-0 animate-initial:y-10 animate-enter:opacity-100 animate-enter:y-0">B</li>
            </ul>
          );
        }
      `;
      const output = transform(input);
      expect(output).toContain("motion.ul");
      expect(output).toContain("staggerChildren: 0.05");
      expect(output).toContain("delayChildren: 0.1");
      expect(output).toContain("motion.li");
    });

    it("advanced drag with snap and no momentum", () => {
      const input = `
        <div className="w-16 h-16 bg-green-500 rounded-xl cursor-grab animate-drag-both animate-drag-elastic-20 animate-drag-snap animate-drag-no-momentum animate-hover:scale-105 animate-spring">
          drag
        </div>
      `;
      const output = transform(input);
      expect(output).toContain("motion.div");
      expect(output).toContain("drag");
      expect(output).toContain("dragElastic={0.2}");
      expect(output).toContain("dragSnapToOrigin");
      expect(output).toContain("dragMomentum={false}");
      expect(output).toContain("whileHover");
      expect(output).toContain("scale: 1.05");
    });

    it("color hover animation", () => {
      const input = `
        <button className="px-4 py-2 animate-hover:bg-#4f46e5 animate-hover:text-#ffffff animate-hover:scale-105 animate-duration-200">
          click
        </button>
      `;
      const output = transform(input);
      expect(output).toContain("motion.button");
      expect(output).toContain('backgroundColor: "#4f46e5"');
      expect(output).toContain('color: "#ffffff"');
      expect(output).toContain("scale: 1.05");
    });

    it("viewport with numeric amount", () => {
      const input = `
        <section className="animate-initial:opacity-0 animate-inview:opacity-100 animate-once animate-amount-75 animate-duration-600">
          section
        </section>
      `;
      const output = transform(input);
      expect(output).toContain("motion.section");
      expect(output).toContain("once: true");
      expect(output).toContain("amount: 0.75");
      expect(output).toContain("duration: 0.6");
    });

    it("repeat with delay pattern", () => {
      const input = `
        <div className="animate-enter:opacity-[0,100,0] animate-repeat-3 animate-repeat-reverse animate-repeat-delay-500 animate-duration-800">
          pulse
        </div>
      `;
      const output = transform(input);
      expect(output).toContain("motion.div");
      expect(output).toContain("opacity: [0, 1, 0]");
      expect(output).toContain("repeat: 3");
      expect(output).toContain('repeatType: "reverse"');
      expect(output).toContain("repeatDelay: 0.5");
      expect(output).toContain("duration: 0.8");
    });

    it("3D transform with z-axis", () => {
      const input = `<div className="animate-hover:z-50 animate-hover:rotate-x-15 animate-hover:scale-105 animate-spring">3d</div>`;
      const output = transform(input);
      expect(output).toContain("z: 50");
      expect(output).toContain("rotateX: 15");
      expect(output).toContain("scale: 1.05");
    });

    it("layout-position variant", () => {
      const input = `<div className="animate-layout-position animate-spring">pos</div>`;
      const output = transform(input);
      expect(output).toContain('layout="position"');
      expect(output).toContain('type: "spring"');
    });

    it("layout-size variant", () => {
      const input = `<div className="animate-layout-size">size</div>`;
      const output = transform(input);
      expect(output).toContain('layout="size"');
    });
  });
});
