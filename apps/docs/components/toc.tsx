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

  const { activeId, activeIndex, scrollPct, navRef, handleClick } =
    useTocObserver(items, itemEls);

  const { wrapperRef, listRef, rows, listH } = useTocMeasure(
    items,
    mounted,
    itemEls,
  );

  // One measured path drives the track and marker. Lengths are analytic, so
  // no DOM measuring round-trip can deadlock.
  const { path, totalLength, centerDistances } = useMemo(
    () => generateIndicatorPath(items, rows),
    [items, rows],
  );

  if (!items.length) return null;

  const showSpine = mounted && listH > 0 && path.length > 0;

  return (
    <nav ref={navRef} className="toc" aria-label="Table of contents">
      <div className="toc-header">
        <span className="toc-header-label">On this page</span>
        <span className="toc-header-pct">{Math.round(scrollPct * 100)}%</span>
      </div>

      <div ref={wrapperRef} className="toc-body">
        {showSpine && (
          <>
            <TocSvg listH={listH} pathD={path} />
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
