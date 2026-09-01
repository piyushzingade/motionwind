"use client";

import type { RefObject, MutableRefObject } from "react";
import type { TOCItem } from "../lib/toc-path";

export function TocList({
  items,
  activeId,
  listRef,
  itemEls,
  handleClick,
}: {
  items: TOCItem[];
  activeId: string;
  listRef: RefObject<HTMLUListElement | null>;
  itemEls: MutableRefObject<(HTMLLIElement | null)[]>;
  handleClick: (ev: React.MouseEvent<HTMLAnchorElement>, url: string) => void;
}) {
  return (
    <ul className="toc-list" ref={listRef}>
      {items.map((item, i) => {
        const id = item.url.slice(1);
        const isActive = activeId === id;
        const indent = Math.max(0, item.depth - 2);

        return (
          <li
            key={item.url}
            ref={(el) => {
              itemEls.current[i] = el;
            }}
            className={`toc-item${isActive ? " toc-item-active" : ""}`}
            style={{ "--toc-indent": indent } as React.CSSProperties}
          >
            <a
              href={item.url}
              onClick={(ev) => handleClick(ev, item.url)}
              className={`toc-link${isActive ? " toc-active" : ""}`}
            >
              {item.title}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
