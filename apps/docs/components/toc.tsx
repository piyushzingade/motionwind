"use client";

import { useRef } from "react";
import { useMounted } from "../lib/use-mounted";
import { buildPath } from "../lib/toc-path";
import type { TOCItem } from "../lib/toc-path";
import { useTocObserver } from "../lib/use-toc-observer";
import { useTocMeasure } from "../lib/use-toc-measure";
import { useTocPath } from "../lib/use-toc-path";
import { TocSvg } from "./toc-svg";
import { TocList } from "./toc-list";

export function TableOfContents({ items }: { items: TOCItem[] }) {
  const mounted = useMounted();
  const itemEls = useRef<(HTMLLIElement | null)[]>([]);

  const { activeId, activeIndex, scrollPct, scrollDir, navRef, handleClick } =
    useTocObserver(items, itemEls);

  const { listRef, ys, listH } = useTocMeasure(items, mounted, itemEls);

  const accentRef = useRef<SVGPathElement>(null);
  const trackRef = useRef<SVGPathElement>(null);

  const { totalLen, tocProgress, arrowPos } = useTocPath({
    ys,
    activeIndex,
    scrollPct,
    accentRef,
  });

  const pathD = buildPath(items, ys);
  const dashOff = totalLen > 0 ? totalLen * (1 - tocProgress) : totalLen;

  if (!items.length) return null;

  return (
    <nav ref={navRef} className="toc" aria-label="Table of contents">
      <div className="toc-header">
        <span className="toc-header-label">On this page</span>
        <span className="toc-header-pct">{Math.round(scrollPct * 100)}%</span>
      </div>

      <div className="toc-body">
        {mounted && listH > 0 && (
          <TocSvg
            listH={listH}
            pathD={pathD}
            totalLen={totalLen}
            tocProgress={tocProgress}
            dashOff={dashOff}
            accentRef={accentRef}
            trackRef={trackRef}
            arrowPos={arrowPos}
            scrollDir={scrollDir}
          />
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
