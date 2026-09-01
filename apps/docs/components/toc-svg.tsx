"use client";

import type { RefObject } from "react";
import { SVG_W } from "../lib/toc-path";

export function TocSvg({
  listH,
  pathD,
  totalLen,
  tocProgress,
  dashOff,
  accentRef,
  trackRef,
  arrowPos,
  scrollDir,
}: {
  listH: number;
  pathD: string;
  totalLen: number;
  tocProgress: number;
  dashOff: number;
  accentRef: RefObject<SVGPathElement | null>;
  trackRef: RefObject<SVGPathElement | null>;
  arrowPos: { x: number; y: number; pathAngle: number } | null;
  scrollDir: "down" | "up";
}) {
  return (
    <svg className="toc-svg" width={SVG_W} height={listH} aria-hidden="true">
      <defs>
        <filter id="toc-glow">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient
          id="toc-accent-grad"
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1={scrollDir === "down" ? "0" : String(listH)}
          x2="0"
          y2={scrollDir === "down" ? String(listH) : "0"}
        >
          <stop
            offset="0%"
            stopColor="var(--color-accent)"
            stopOpacity="0.05"
          />
          <stop
            offset="40%"
            stopColor="var(--color-accent)"
            stopOpacity="0.3"
          />
          <stop
            offset="75%"
            stopColor="var(--color-accent)"
            stopOpacity="0.7"
          />
          <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="1" />
        </linearGradient>
        <filter
          id="toc-orb-bloom"
          x="-100%"
          y="-100%"
          width="300%"
          height="300%"
        >
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
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
      {arrowPos && tocProgress > 0.01 && (
        <circle
          cx={arrowPos.x}
          cy={arrowPos.y}
          r="3"
          fill="var(--color-accent)"
          filter="url(#toc-orb-bloom)"
          className="toc-orb-core"
        />
      )}
    </svg>
  );
}
