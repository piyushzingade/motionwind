"use client";

import {
  useEffect,
  useState,
  useCallback,
  useRef,
  type MutableRefObject,
} from "react";
import type { RowMetrics, TOCItem } from "./toc-path";

export function useTocMeasure(
  items: TOCItem[],
  mounted: boolean,
  itemEls: MutableRefObject<(HTMLLIElement | null)[]>,
) {
  const listRef = useRef<HTMLUListElement | null>(null);
  const [ys, setYs] = useState<number[]>([]);
  const [rows, setRows] = useState<RowMetrics[]>([]);
  const [listH, setListH] = useState(0);

  const measure = useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    const lr = list.getBoundingClientRect();
    setListH(list.offsetHeight);
    const positions: number[] = [];
    const geometries: RowMetrics[] = [];
    for (let i = 0; i < items.length; i++) {
      const el = itemEls.current[i];
      if (el) {
        const r = el.getBoundingClientRect();
        positions.push(r.top - lr.top + r.height / 2);
        geometries.push({ top: r.top - lr.top, height: r.height });
      } else {
        positions.push(0);
        geometries.push({ top: 0, height: 0 });
      }
    }
    setYs(positions);
    // Bail when nothing moved: the observer fires on our own re-render too,
    // and an unconditional setState would loop.
    setRows((prev) =>
      prev.length === geometries.length &&
      prev.every(
        (row, i) =>
          Math.abs(row.top - geometries[i]!.top) < 0.5 &&
          Math.abs(row.height - geometries[i]!.height) < 0.5,
      )
        ? prev
        : geometries,
    );
  }, [items, itemEls]);

  useEffect(() => {
    if (!mounted) return;
    const t = setTimeout(measure, 50);
    const ro = new ResizeObserver(measure);
    const list = listRef.current;
    if (list) {
      // Observe children too: a late font or a resize can rewrap a heading,
      // which moves every row below it.
      ro.observe(list);
      for (const child of Array.from(list.children)) ro.observe(child);
    }
    return () => {
      clearTimeout(t);
      ro.disconnect();
    };
  }, [measure, mounted]);

  return { listRef, ys, rows, listH };
}
