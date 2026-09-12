"use client";

import { useMemo, useRef } from "react";
import { useMounted } from "../lib/use-mounted";
import { generateIndicatorPath } from "../lib/toc-path";
import type { TOCItem } from "../lib/toc-path";
import { useTocObserver } from "../lib/use-toc-observer";
import { useTocMeasure } from "../lib/use-toc-measure";
import { TocSvg } from "./toc-svg";
import { TocList } from "./toc-list";
import { TocIndicator } from "./toc-indicator";

export function TableOfContents({ items }: { items: TOCItem[] }) {
  const mounted = useMounted();
  const itemEls = useRef<(HTMLLIElement | null)[]>([]);

  const { activeId, activeIndex, scrollPct, scrollDir, navRef, handleClick } =
    useTocObserver(items, itemEls);

  const { listRef, ys, rows, listH } = useTocMeasure(items, mounted, itemEls);

  // One measured path drives the track, the progress fill, and the marker —
  // lengths are analytic, so no DOM measuring round-trip can deadlock.
  const { path, totalLength, centerDistances } = useMemo(
    () => generateIndicatorPath(items, rows),
    [items, rows],
  );

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

  const dashOff =
    totalLength > 0 ? totalLength * (1 - tocProgress) : totalLength;

  if (!items.length) return null;

  const showSpine = mounted && listH > 0 && path.length > 0;

  return (
    <nav ref={navRef} className="toc" aria-label="Table of contents">
      <div className="toc-header">
        <span className="toc-header-label">On this page</span>
        <span className="toc-header-pct">{Math.round(scrollPct * 100)}%</span>
      </div>

      <div className="toc-body">
        {showSpine && (
          <>
            <TocSvg
              listH={listH}
              pathD={path}
              totalLen={totalLength}
              dashOff={dashOff}
              scrollDir={scrollDir}
            />
            <TocIndicator
              path={path}
              totalLength={totalLength}
              centerDistances={centerDistances}
              activeIndex={activeIndex}
              height={listH}
            />
          </>
        )}
        <TocList
          items={items}
          activeId={activeId}
          listRef={listRef}
          itemEls={itemEls}
          handleClick={handleClick}
        />
      </div>
    </nav>
  );
}
