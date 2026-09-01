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
  const [scrollDir, setScrollDir] = useState<"down" | "up">("down");

  const obsRef = useRef<IntersectionObserver | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const isClickScrolling = useRef(false);
  const clickTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastScrollTop = useRef(0);

  /* scroll progress */
  useEffect(() => {
    const container = getScrollContainer();
    if (!container) return;

    const fn = () => {
      const scrollTop = container.scrollTop;
      const scrollH = container.scrollHeight - container.clientHeight;
      setScrollPct(scrollH > 0 ? Math.min(scrollTop / scrollH, 1) : 0);

      const delta = scrollTop - lastScrollTop.current;
      if (Math.abs(delta) > 2) {
        setScrollDir(delta > 0 ? "down" : "up");
      }
      lastScrollTop.current = scrollTop;
    };

    container.addEventListener("scroll", fn, { passive: true });
    fn();
    return () => container.removeEventListener("scroll", fn);
  }, [mounted]);

  /* active heading */
  useEffect(() => {
    if (!items.length || !mounted) return;

    const container = getScrollContainer();

    obsRef.current = new IntersectionObserver(
      (entries) => {
        if (isClickScrolling.current) return;
        for (const e of entries) {
          if (e.isIntersecting) {
            const id = e.target.id;
            setActiveId(id);
            const idx = items.findIndex((it) => it.url.slice(1) === id);
            if (idx !== -1) setActiveIndex(idx);
          }
        }
      },
      { root: container, rootMargin: "-80px 0px -75% 0px" },
    );

    for (const it of items) {
      const el = document.getElementById(it.url.slice(1));
      if (el) obsRef.current.observe(el);
    }
    return () => obsRef.current?.disconnect();
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
        isClickScrolling.current = true;
        if (clickTimeout.current) clearTimeout(clickTimeout.current);

        const container = getScrollContainer();
        if (container) {
          const elTop =
            el.getBoundingClientRect().top -
            container.getBoundingClientRect().top +
            container.scrollTop;
          container.scrollTo({ top: elTop - 80, behavior: "smooth" });
        }
        setActiveId(id);
        const idx = items.findIndex((it) => it.url.slice(1) === id);
        if (idx !== -1) setActiveIndex(idx);
        history.replaceState(null, "", url);

        clickTimeout.current = setTimeout(() => {
          isClickScrolling.current = false;
        }, 600);
      }
    },
    [items],
  );

  return {
    activeId,
    activeIndex,
    scrollPct,
    scrollDir,
    navRef,
    itemEls,
    handleClick,
    mounted,
  };
}
