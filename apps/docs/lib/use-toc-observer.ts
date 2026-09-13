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

  const navRef = useRef<HTMLElement>(null);
  const lastScrollTop = useRef(0);
  const headingOffsets = useRef<number[]>([]);

  /* Scroll progress and active heading share one deterministic reading line. */
  useEffect(() => {
    const container = getScrollContainer();
    if (!container || !items.length || !mounted) return;

    let frame = 0;

    const measure = () => {
      const containerTop = container.getBoundingClientRect().top;
      headingOffsets.current = items.map((item) => {
        const heading = document.getElementById(item.url.slice(1));
        if (!heading) return Number.POSITIVE_INFINITY;
        return (
          heading.getBoundingClientRect().top -
          containerTop +
          container.scrollTop
        );
      });
    };

    const update = () => {
      const scrollTop = container.scrollTop;
      const scrollH = container.scrollHeight - container.clientHeight;
      setScrollPct(scrollH > 0 ? Math.min(scrollTop / scrollH, 1) : 0);

      const delta = scrollTop - lastScrollTop.current;
      if (Math.abs(delta) > 2) {
        setScrollDir(delta > 0 ? "down" : "up");
      }
      lastScrollTop.current = scrollTop;

      let nextIndex = 0;
      if (scrollH > 0 && scrollTop >= scrollH - 1) {
        nextIndex = items.length - 1;
      } else {
        const readingLine =
          scrollTop + Math.min(112, container.clientHeight * 0.25);
        for (let i = 0; i < headingOffsets.current.length; i++) {
          if ((headingOffsets.current[i] ?? Infinity) <= readingLine) {
            nextIndex = i;
          } else {
            break;
          }
        }
      }

      const nextId = items[nextIndex]?.url.slice(1) ?? "";
      setActiveIndex((current) =>
        current === nextIndex ? current : nextIndex,
      );
      setActiveId((current) => (current === nextId ? current : nextId));
    };

    const requestUpdate = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    const resizeObserver = new ResizeObserver(() => {
      measure();
      requestUpdate();
    });

    measure();
    update();
    resizeObserver.observe(container);
    const article = container.querySelector(".docs-page");
    if (article) resizeObserver.observe(article);
    container.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      container.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
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
    scrollDir,
    navRef,
    itemEls,
    handleClick,
    mounted,
  };
}
