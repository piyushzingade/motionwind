import type { ReactNode } from "react";

export interface TOCItem {
  title: ReactNode;
  url: string;
  depth: number;
}

export const SPINE_X = 5;
export const INDENT_X = 16;
export const SVG_W = 22;

interface Pt {
  x: number;
  y: number;
}

export function buildPath(items: TOCItem[], ys: number[]): string {
  if (!items.length || ys.length !== items.length) return "";

  const pts: Pt[] = items.map((item, i) => ({
    x: Math.max(0, item.depth - 2) > 0 ? INDENT_X : SPINE_X,
    y: ys[i] ?? 0,
  }));

  const first = pts[0] as Pt;
  let d = `M ${first.x} ${first.y}`;

  for (let i = 1; i < pts.length; i++) {
    const p = pts[i - 1] as Pt;
    const c = pts[i] as Pt;

    if (p.x === c.x) {
      d += ` L ${c.x} ${c.y}`;
    } else {
      const midY = (p.y + c.y) / 2;
      d += ` C ${p.x} ${midY}, ${c.x} ${midY}, ${c.x} ${c.y}`;
    }
  }

  return d;
}

export function getScrollContainer(): HTMLElement | null {
  return document.querySelector(".docs-content-wrapper");
}
