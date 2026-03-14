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

  const obsRef = useRef<IntersectionObserver | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const itemEls = useRef<(HTMLLIElement | null)[]>([]);
  const trackRef = useRef<SVGPathElement>(null);

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
        const container = getScrollContainer();
        if (container) {
          const elTop = el.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop;
          container.scrollTo({ top: elTop - 80, behavior: "smooth" });
        }
        setActiveId(id);
        const idx = items.findIndex((it) => it.url.slice(1) === id);
        if (idx !== -1) setActiveIndex(idx);
        history.replaceState(null, "", url);
      }
    },
    [items],
  );

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

  if (!items.length) return null;

  const pathD = buildPath(items, ys);
  const dashOff = totalLen > 0 ? totalLen * (1 - tocProgress) : totalLen;

  return (
    <nav className="toc" aria-label="Table of contents">
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

            {/* scroll-progress accent fill with glow */}
            {pathD && totalLen > 0 && (
              <path
                d={pathD}
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray={totalLen}
                strokeDashoffset={dashOff}
                filter="url(#toc-glow)"
                className="toc-path-fill"
              />
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
