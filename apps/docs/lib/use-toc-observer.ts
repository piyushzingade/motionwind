"use client";

import {
  useEffect,
  useState,
  useRef,
  useCallback,
  type MutableRefObject,
} from "react";
import { useMounted } from "./use-mounted";
import { getScrollContainer } from "./toc-path";
import type { TOCItem } from "./toc-path";

export function useTocObserver(
  items: TOCItem[],
  itemEls: MutableRefObject<(HTMLLIElement | null)[]>,
) {
  const [activeId, setActiveId] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [scrollPct, setScrollPct] = useState(0);
  const mounted = useMounted();
  const navRef = useRef<HTMLElement>(null);

  /* Adapted from EvilCharts: observe headings inside our custom scroller. */
  useEffect(() => {
    const container = getScrollContainer();
    if (!container || !items.length || !mounted) return;

    let frame = 0;
    const itemIds = items.map((item) => item.url.slice(1));

    const update = () => {
      const scrollTop = container.scrollTop;
      const scrollH = container.scrollHeight - container.clientHeight;
      setScrollPct(scrollH > 0 ? Math.min(scrollTop / scrollH, 1) : 0);

      if (scrollH > 0 && scrollTop >= scrollH - 1) {
        const nextIndex = items.length - 1;
        setActiveIndex(nextIndex);
        setActiveId(itemIds[nextIndex] ?? "");
      }
    };

    const requestUpdate = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const nextIndex = itemIds.indexOf(entry.target.id);
          if (nextIndex < 0) continue;
          setActiveId(entry.target.id);
          setActiveIndex(nextIndex);
        }
      },
      { root: container, rootMargin: "0px 0px -60% 0px" },
    );
    for (const id of itemIds) {
      const heading = document.getElementById(id);
      if (heading) observer.observe(heading);
    }

    update();
    container.addEventListener("scroll", requestUpdate, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      container.removeEventListener("scroll", requestUpdate);
    };
  }, [items, mounted]);

  /* Auto-scroll TOC sidebar */
  useEffect(() => {
    if (activeIndex < 0) return;
    const el = itemEls.current[activeIndex];
    const sidebar = navRef.current?.closest(
      ".toc-sidebar",
    ) as HTMLElement | null;
    if (!el || !sidebar) return;

    const sidebarRect = sidebar.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const elTop = elRect.top - sidebarRect.top;
    const elBottom = elTop + elRect.height;
    const buffer = 40;

    if (elTop < buffer) {
      sidebar.scrollBy({ top: elTop - buffer, behavior: "smooth" });
    } else if (elBottom > sidebarRect.height - buffer) {
      sidebar.scrollBy({
        top: elBottom - sidebarRect.height + buffer,
        behavior: "smooth",
      });
    }
  }, [activeIndex, itemEls]);

  const handleClick = useCallback(
    (ev: React.MouseEvent<HTMLAnchorElement>, url: string) => {
      ev.preventDefault();
      const id = url.slice(1);
      const el = document.getElementById(id);
      if (el) {
        const container = getScrollContainer();
        if (container) {
          const elTop =
            el.getBoundingClientRect().top -
            container.getBoundingClientRect().top +
            container.scrollTop;
          container.scrollTo({ top: elTop - 80, behavior: "smooth" });
        }
        history.replaceState(null, "", url);
      }
    },
    [],
  );

  return {
    activeId,
    activeIndex,
    scrollPct,
    navRef,
    itemEls,
    handleClick,
    mounted,
  };
}
