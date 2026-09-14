import { describe, expect, it } from "vitest";
import {
  generateIndicatorPath,
  type RowMetrics,
  type TOCItem,
} from "./toc-path";

const item = (depth: number, index: number): TOCItem => ({
  title: `Heading ${index}`,
  url: `#heading-${index}`,
  depth,
});

const row = (top: number, height = 24): RowMetrics => ({ top, height });

describe("generateIndicatorPath", () => {
  it("uses the measured center of every flat row", () => {
    const result = generateIndicatorPath(
      [item(2, 0), item(2, 1), item(2, 2)],
      [row(0), row(24), row(48)],
    );

    expect(result.path).toBe("M 8 0 L 8 24 L 8 48 L 8 60");
    expect(result.centerDistances).toEqual([12, 36, 60]);
    expect(result.totalLength).toBe(60);
  });

  it("creates a single-depth bend from the measured row boundary", () => {
    const result = generateIndicatorPath(
      [item(2, 0), item(3, 1)],
      [row(0), row(32)],
    );

    expect(result.path).toBe("M 8 0 L 8 24 L 18 32 L 18 44");
    expect(result.centerDistances[1]).toBeCloseTo(24 + Math.sqrt(164) + 12);
  });

  it("keeps a direct double-indent jump continuous", () => {
    const result = generateIndicatorPath(
      [item(2, 0), item(4, 1)],
      [row(0), row(32)],
    );

    expect(result.path).toContain("L 28 32");
    expect(result.centerDistances).toHaveLength(2);
    expect(result.totalLength).toBe(result.centerDistances[1]);
  });

  it("keeps reverse depth changes continuous", () => {
    const result = generateIndicatorPath(
      [item(4, 0), item(2, 1)],
      [row(0), row(32)],
    );

    expect(result.path).toBe("M 28 0 L 28 24 L 8 32 L 8 44");
  });

  it("uses wrapped row height instead of a fixed step", () => {
    const result = generateIndicatorPath(
      [item(2, 0), item(3, 1)],
      [row(0, 48), row(56, 24)],
    );

    expect(result.centerDistances[0]).toBe(24);
    expect(result.path).toContain("L 8 48 L 18 56");
    expect(result.path.endsWith("L 18 68")).toBe(true);
  });

  it("ends the path at the final row center", () => {
    const result = generateIndicatorPath(
      [item(2, 0), item(2, 1)],
      [row(10, 20), row(42, 40)],
    );

    expect(result.path.endsWith("L 8 62")).toBe(true);
    expect(result.centerDistances.at(-1)).toBe(result.totalLength);
  });
});
