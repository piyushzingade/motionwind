"use client";

import {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";

interface TOCItem {
  title: ReactNode;
  url: string;
  depth: number;
}

const SPINE_X = 5;
const INDENT_X = 16;
const SVG_W = 22;

interface Pt {
  x: number;
  y: number;
}

function buildPath(items: TOCItem[], ys: number[]): string {
  if (!items.length || ys.length !== items.length) return "";

  const pts: Pt[] = items.map((item, i) => ({
    x: Math.max(0, item.depth - 2) > 0 ? INDENT_X : SPINE_X,
    y: ys[i] ?? 0,
  }));

  const first = pts[0] as Pt;
  let d = `M ${first.x} ${first.y}`;

  for (let i = 1; i < pts.length; i++) {
    const p = pts[i - 1] as Pt;
    const c = pts[i] as Pt;

    if (p.x === c.x) {
      d += ` L ${c.x} ${c.y}`;
    } else {
      const midY = (p.y + c.y) / 2;
      d += ` C ${p.x} ${midY}, ${c.x} ${midY}, ${c.x} ${c.y}`;
    }
  }

  return d;
}

/** Find the scrollable .docs-content-wrapper ancestor */
function getScrollContainer(): HTMLElement | null {
  return document.querySelector(".docs-content-wrapper");
}

export function TableOfContents({ items }: { items: TOCItem[] }) {
  const [activeId, setActiveId] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [scrollPct, setScrollPct] = useState(0);
  const [ys, setYs] = useState<number[]>([]);
  const [totalLen, setTotalLen] = useState(0);
  const [listH, setListH] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [scrollDir, setScrollDir] = useState<"down" | "up">("down");

  const obsRef = useRef<IntersectionObserver | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const itemEls = useRef<(HTMLLIElement | null)[]>([]);
  const trackRef = useRef<SVGPathElement>(null);
  const accentRef = useRef<SVGPathElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const isClickScrolling = useRef(false);
  const clickTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastScrollTop = useRef(0);

  useEffect(() => setMounted(true), []);

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
  }, [items]);

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

  useEffect(() => {
    if (trackRef.current) setTotalLen(trackRef.current.getTotalLength());
  }, [ys]);

  /* scroll progress — listen on .docs-content-wrapper, not window */
  useEffect(() => {
    const container = getScrollContainer();
    if (!container) return;

    const fn = () => {
      const scrollTop = container.scrollTop;
      const scrollH = container.scrollHeight - container.clientHeight;
      setScrollPct(scrollH > 0 ? Math.min(scrollTop / scrollH, 1) : 0);

      // Track scroll direction
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

  /* active heading — use scroll container as IntersectionObserver root */
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
      {
        root: container,
        rootMargin: "-80px 0px -75% 0px",
      },
    );

    for (const it of items) {
      const el = document.getElementById(it.url.slice(1));
      if (el) obsRef.current.observe(el);
    }
    return () => obsRef.current?.disconnect();
  }, [items, mounted]);

  const handleClick = useCallback(
    (ev: React.MouseEvent<HTMLAnchorElement>, url: string) => {
      ev.preventDefault();
      const id = url.slice(1);
      const el = document.getElementById(id);
      if (el) {
        // Lock out IntersectionObserver during smooth scroll to prevent jitter
        isClickScrolling.current = true;
        if (clickTimeout.current) clearTimeout(clickTimeout.current);

        const container = getScrollContainer();
        if (container) {
          const elTop = el.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop;
          container.scrollTo({ top: elTop - 80, behavior: "smooth" });
        }
        setActiveId(id);
        const idx = items.findIndex((it) => it.url.slice(1) === id);
        if (idx !== -1) setActiveIndex(idx);
        history.replaceState(null, "", url);

        // Release lock after smooth scroll completes
        clickTimeout.current = setTimeout(() => {
          isClickScrolling.current = false;
        }, 600);
      }
    },
    [items],
  );

  /* Auto-scroll TOC sidebar to keep active item visible */
  useEffect(() => {
    if (activeIndex < 0) return;
    const el = itemEls.current[activeIndex];
    const sidebar = navRef.current?.closest(".toc-sidebar") as HTMLElement | null;
    if (!el || !sidebar) return;

    const sidebarRect = sidebar.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();

    // Check if the active item is outside the visible area of the sidebar
    const elTop = elRect.top - sidebarRect.top;
    const elBottom = elTop + elRect.height;
    const buffer = 40; // px buffer from top/bottom edges

    if (elTop < buffer) {
      sidebar.scrollBy({ top: elTop - buffer, behavior: "smooth" });
    } else if (elBottom > sidebarRect.height - buffer) {
      sidebar.scrollBy({ top: elBottom - sidebarRect.height + buffer, behavior: "smooth" });
    }
  }, [activeIndex]);

  /* Map active heading position → path progress (not raw scroll %) */
  const tocProgress = useMemo(() => {
    if (activeIndex < 0 || ys.length < 2) return 0;
    // When near the bottom, fill the entire path
    if (scrollPct > 0.95) return 1;

    const firstY = ys[0] ?? 0;
    const lastY = ys[ys.length - 1] ?? 0;
    const range = lastY - firstY;
    if (range <= 0) return 0;

    const activeY = ys[activeIndex] ?? firstY;
    const raw = (activeY - firstY) / range;
    // Show a small fill even at the first heading
    return activeIndex === 0 ? Math.max(raw, 0.03) : raw;
  }, [activeIndex, ys, scrollPct]);

  // Compute arrow position at the leading edge of the accent fill
  const arrowPos = useMemo(() => {
    if (!accentRef.current || totalLen <= 0 || tocProgress <= 0) return null;
    try {
      const filledLen = totalLen * tocProgress;
      const pt = accentRef.current.getPointAtLength(filledLen);
      // Get a point slightly before to compute direction
      const ptPrev = accentRef.current.getPointAtLength(Math.max(0, filledLen - 4));
      const dx = pt.x - ptPrev.x;
      const dy = pt.y - ptPrev.y;
      // Angle of the path tangent at this point (in degrees)
      const pathAngle = Math.atan2(dy, dx) * (180 / Math.PI);
      return { x: pt.x, y: pt.y, pathAngle };
    } catch {
      return null;
    }
  }, [totalLen, tocProgress]);

  if (!items.length) return null;

  const pathD = buildPath(items, ys);
  const dashOff = totalLen > 0 ? totalLen * (1 - tocProgress) : totalLen;

  // Arrow rotation: flip based on scroll direction
  // pathAngle gives the tangent direction at the fill tip
  // For "down" scrolling, the arrow points in the path direction
  // For "up" scrolling, rotate 180° to point upward
  const arrowRotation = arrowPos
    ? scrollDir === "down"
      ? arrowPos.pathAngle - 90 // path goes mostly downward, -90 to align chevron
      : arrowPos.pathAngle + 90
    : 0;

  return (
    <nav ref={navRef} className="toc" aria-label="Table of contents">
      <div className="toc-header">
        <span className="toc-header-label">On this page</span>
        <span className="toc-header-pct">
          {Math.round(scrollPct * 100)}%
        </span>
      </div>

      <div className="toc-body">
        {mounted && listH > 0 && (
          <svg
            className="toc-svg"
            width={SVG_W}
            height={listH}
            aria-hidden="true"
          >
            <defs>
              <filter id="toc-glow">
                <feGaussianBlur stdDeviation="2" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Gradient: fades from transparent → accent along the filled path.
                  Near the arrow tip = full accent, opposite end = transparent.
                  Direction flips based on scroll direction. */}
              <linearGradient
                id="toc-accent-grad"
                gradientUnits="userSpaceOnUse"
                x1="0"
                y1={scrollDir === "down" ? "0" : String(listH)}
                x2="0"
                y2={scrollDir === "down" ? String(listH) : "0"}
              >
                <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.05" />
                <stop offset="40%" stopColor="var(--color-accent)" stopOpacity="0.3" />
                <stop offset="75%" stopColor="var(--color-accent)" stopOpacity="0.7" />
                <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="1" />
              </linearGradient>

              {/* Glow version of the gradient */}
              <linearGradient
                id="toc-accent-grad-glow"
                gradientUnits="userSpaceOnUse"
                x1="0"
                y1={scrollDir === "down" ? "0" : String(listH)}
                x2="0"
                y2={scrollDir === "down" ? String(listH) : "0"}
              >
                <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0" />
                <stop offset="50%" stopColor="var(--color-accent)" stopOpacity="0.4" />
                <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="1" />
              </linearGradient>
            </defs>

            {/* background track */}
            {pathD && (
              <path
                ref={trackRef}
                d={pathD}
                fill="none"
                stroke="var(--color-border)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            )}

            {/* scroll-progress accent fill — gradient stroke */}
            {pathD && totalLen > 0 && (
              <path
                ref={accentRef}
                d={pathD}
                fill="none"
                stroke="url(#toc-accent-grad)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray={totalLen}
                strokeDashoffset={dashOff}
                filter="url(#toc-glow)"
                className="toc-path-fill"
              />
            )}

            {/* Directional arrow at the leading edge */}
            {arrowPos && tocProgress > 0.01 && (
              <g
                className="toc-arrow"
                transform={`translate(${arrowPos.x}, ${arrowPos.y}) rotate(${arrowRotation})`}
              >
                <path
                  d="M -3.5 -3 L 0 3 L 3.5 -3"
                  fill="none"
                  stroke="var(--color-accent)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#toc-glow)"
                />
              </g>
            )}
          </svg>
        )}

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
      </div>
    </nav>
  );
}
