"use client";

import { useEffect, useState, useMemo, type RefObject } from "react";

export function useTocPath({
  ys,
  activeIndex,
  scrollPct,
  accentRef,
}: {
  ys: number[];
  activeIndex: number;
  scrollPct: number;
  accentRef: RefObject<SVGPathElement | null>;
}) {
  const [totalLen, setTotalLen] = useState(0);

  useEffect(() => {
    if (accentRef.current) setTotalLen(accentRef.current.getTotalLength());
  }, [ys, accentRef]);

  const tocProgress = useMemo(() => {
    if (activeIndex < 0 || ys.length < 2) return 0;
    if (scrollPct > 0.95) return 1;

    const firstY = ys[0] ?? 0;
    const lastY = ys[ys.length - 1] ?? 0;
    const range = lastY - firstY;
    if (range <= 0) return 0;

    const activeY = ys[activeIndex] ?? firstY;
    const raw = (activeY - firstY) / range;
    return activeIndex === 0 ? Math.max(raw, 0.03) : raw;
  }, [activeIndex, ys, scrollPct]);

  const arrowPos = useMemo(() => {
    if (!accentRef.current || totalLen <= 0 || tocProgress <= 0) return null;
    try {
      const filledLen = totalLen * tocProgress;
      const pt = accentRef.current.getPointAtLength(filledLen);
      const ptPrev = accentRef.current.getPointAtLength(
        Math.max(0, filledLen - 4),
      );
      const dx = pt.x - ptPrev.x;
      const dy = pt.y - ptPrev.y;
      const pathAngle = Math.atan2(dy, dx) * (180 / Math.PI);
      return { x: pt.x, y: pt.y, pathAngle };
    } catch {
      return null;
    }
  }, [totalLen, tocProgress, accentRef]);

  return { totalLen, tocProgress, arrowPos };
}
