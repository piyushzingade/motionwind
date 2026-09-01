"use client";

import {
  useEffect,
  useState,
  useCallback,
  useRef,
  type MutableRefObject,
} from "react";
import type { TOCItem } from "./toc-path";

export function useTocMeasure(
  items: TOCItem[],
  mounted: boolean,
  itemEls: MutableRefObject<(HTMLLIElement | null)[]>,
) {
  const listRef = useRef<HTMLUListElement | null>(null);
  const [ys, setYs] = useState<number[]>([]);
  const [listH, setListH] = useState(0);

  const measure = useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    const lr = list.getBoundingClientRect();
    setListH(list.offsetHeight);
    const positions: number[] = [];
    for (let i = 0; i < items.length; i++) {
      const el = itemEls.current[i];
      if (el) {
        const r = el.getBoundingClientRect();
        positions.push(r.top - lr.top + r.height / 2);
      } else {
        positions.push(0);
      }
    }
    setYs(positions);
  }, [items, itemEls]);

  useEffect(() => {
    if (!mounted) return;
    const t = setTimeout(measure, 50);
    const ro = new ResizeObserver(measure);
    if (listRef.current) ro.observe(listRef.current);
    return () => {
      clearTimeout(t);
      ro.disconnect();
    };
  }, [measure, mounted]);

  return { listRef, ys, listH };
}
