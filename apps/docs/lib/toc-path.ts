import type { ReactNode } from "react";

export interface TOCItem {
  title: ReactNode;
  url: string;
  depth: number;
}

export const SPINE_X = 5;
export const INDENT_X = 16;
export const SVG_W = 22;

/** Fixed vertical room reserved for a bend between two depths. */
const DEPTH_BEND_LENGTH = 8;

function getDiagonalDistance(deltaX: number): number {
  return Math.sqrt(deltaX ** 2 + DEPTH_BEND_LENGTH ** 2);
}

/** Measured geometry of one TOC row, relative to the list box. */
export interface RowMetrics {
  top: number;
  height: number;
}

export interface IndicatorPath {
  /** SVG path data shared by the track, the fill, and the marker. */
  path: string;
  /** Analytic total length (no DOM measuring needed). */
  totalLength: number;
  /** Path-length distance of each row's center from the path start. */
  centerDistances: number[];
}

/**
 * Build the spine: vertical runs through each row with short diagonal bends
 * in the gaps where depth changes. Lengths are accumulated analytically so
 * markers can ride the path via CSS offset-distance without measuring DOM.
 */
export function generateIndicatorPath(
  items: TOCItem[],
  rows: RowMetrics[],
): IndicatorPath {
  if (items.length === 0 || rows.length !== items.length) {
    return { path: "", totalLength: 0, centerDistances: [] };
  }

  const minDepth = Math.min(...items.map((item) => item.depth));
  const xFor = (depth: number) =>
    SPINE_X + (depth - minDepth) * (INDENT_X - SPINE_X);

  const parts: string[] = [];
  const centerDistances: number[] = [];

  let currentX = xFor(items[0]!.depth);
  let currentY = rows[0]!.top + rows[0]!.height / 2;
  let accumulated = 0;

  parts.push(`M ${currentX} ${currentY}`);

  for (let i = 0; i < items.length; i++) {
    const isLast = i === items.length - 1;
    const row = rows[i]!;
    const centerY = row.top + row.height / 2;
    // Run to the row bottom so bends land in the gap (last row: its center).
    const rowBottomY = isLast ? centerY : row.top + row.height;
    const next = items[i + 1];

    centerDistances.push(accumulated + (centerY - currentY));

    accumulated += rowBottomY - currentY;
    parts.push(`L ${currentX} ${rowBottomY}`);
    currentY = rowBottomY;

    if (next) {
      const nextX = xFor(next.depth);
      if (nextX !== currentX) {
        accumulated += getDiagonalDistance(nextX - currentX);
        parts.push(`L ${nextX} ${currentY + DEPTH_BEND_LENGTH}`);
        currentX = nextX;
        currentY += DEPTH_BEND_LENGTH;
      }
    }
  }

  return { path: parts.join(" "), totalLength: accumulated, centerDistances };
}

export function getScrollContainer(): HTMLElement | null {
  return document.querySelector(".docs-content-wrapper");
}
