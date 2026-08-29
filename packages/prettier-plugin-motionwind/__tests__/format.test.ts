import { describe, it, expect } from "vitest";
import prettier from "prettier";
import * as motionwindPlugin from "../src/index.js";

async function format(code: string, parser = "babel"): Promise<string> {
  return prettier.format(code, {
    parser,
    plugins: [motionwindPlugin as prettier.Plugin],
  });
}

describe("prettier-plugin-motionwind", () => {
  it("sorts animate-* classes into canonical order (babel)", async () => {
    const out = await format(
      `const a = <div className="px-4 animate-hover:scale-110 animate-spring bg-blue-500 animate-once" />;\n`,
    );
    expect(out).toContain(
      'className="animate-hover:scale-110 animate-spring animate-once px-4 bg-blue-500"',
    );
  });

  it("sorts with the typescript parser too", async () => {
    const out = await format(
      `const a = <div className="animate-spring animate-hover:scale-110" />;\n`,
      "typescript",
    );
    expect(out).toContain('className="animate-hover:scale-110 animate-spring"');
  });

  it("puts variant defs before gestures", async () => {
    const out = await format(
      `const a = <div className="animate-hover:scale-110 animate-variant-hidden:opacity-0" />;\n`,
    );
    expect(out).toContain(
      'className="animate-variant-hidden:opacity-0 animate-hover:scale-110"',
    );
  });

  it("leaves classNames without animate-* untouched", async () => {
    const out = await format(
      `const a = <div className="px-4 bg-blue-500" />;\n`,
    );
    expect(out).toContain('className="px-4 bg-blue-500"');
  });
});
