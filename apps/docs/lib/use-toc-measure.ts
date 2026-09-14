"use client";

import {
  useLayoutEffect,
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
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const [rows, setRows] = useState<RowMetrics[]>([]);
  const [listH, setListH] = useState(0);

  const measure = useCallback(() => {
    const wrapper = wrapperRef.current;
    const list = listRef.current;
    if (!wrapper || !list) return;
    const originTop = wrapper.getBoundingClientRect().top;
    const nextHeight = list.offsetHeight;
    const geometries: RowMetrics[] = [];
    for (let i = 0; i < items.length; i++) {
      const el = itemEls.current[i];
      if (el) {
        const r = el.getBoundingClientRect();
        geometries.push({ top: r.top - originTop, height: r.height });
      } else {
        geometries.push({ top: 0, height: 0 });
      }
    }
    setListH((previous) =>
      Math.abs(previous - nextHeight) < 0.5 ? previous : nextHeight,
    );
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

  useLayoutEffect(() => {
    if (!mounted) return;
    measure();
    const ro = new ResizeObserver(measure);
    const wrapper = wrapperRef.current;
    const list = listRef.current;
    if (wrapper) ro.observe(wrapper);
    if (list) {
      // Observe children too: a late font or a resize can rewrap a heading,
      // which moves every row below it.
      ro.observe(list);
      for (const child of Array.from(list.children)) ro.observe(child);
    }
    return () => {
      ro.disconnect();
    };
  }, [measure, mounted]);

  return { wrapperRef, listRef, rows, listH };
}
