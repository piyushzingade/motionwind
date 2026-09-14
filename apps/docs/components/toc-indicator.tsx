"use client";

import { useEffect, useId } from "react";
import {
  motion,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";

const SPRING = { stiffness: 180, damping: 20 };
// Small enough to sit centered on the marker: the halo extends evenly above
// and below the diamond instead of trailing to one side.
const TAIL_SIZE = 56;

// Path-following mask technique adapted from EvilCharts (MIT License).

export function TocIndicator({
  path,
  totalLength,
  centerDistances,
  activeIndex,
  height,
}: {
  path: string;
  totalLength: number;
  centerDistances: number[];
  activeIndex: number;
  height: number;
}) {
  const animatedDistance = useSpring(0, SPRING);
  const reduceMotion = useReducedMotion();
  const id = useId().replace(/:/g, "");
  const maskId = `toc-path-mask-${id}`;
  const valid =
    activeIndex >= 0 &&
    activeIndex < centerDistances.length &&
    totalLength > 0 &&
    path.length > 0;
  const target = valid ? (centerDistances[activeIndex] ?? 0) : 0;

  useEffect(() => {
    if (reduceMotion) animatedDistance.jump(target);
    else animatedDistance.set(target);
  }, [target, animatedDistance, reduceMotion]);

  const offsetDistance = useTransform(animatedDistance, (value) =>
    totalLength > 0 ? `${(value / totalLength) * 100}%` : "0%",
  );
  const offsetPath = `path('${path}')`;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 overflow-visible"
      style={{ height }}
    >
      <svg
        width="22"
        height={height}
        className="absolute inset-0 overflow-visible"
      >
        <defs>
          {/* Explicit region: the default -10%/120% box clips glow at deep
              indents (x > ~26), so the tail vanished on doubly-indented rows
              while the unmasked diamond stayed visible. */}
          <mask
            id={maskId}
            maskUnits="userSpaceOnUse"
            x="-60"
            y="-60"
            width="200"
            height={height + 120}
          >
            <path
              d={path}
              fill="none"
              stroke="white"
              strokeWidth="1.5"
              strokeDasharray="1 5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </mask>
        </defs>
      </svg>
      {valid ? (
        <div
          className="absolute inset-0 overflow-visible"
          style={{ mask: `url(#${maskId})`, WebkitMask: `url(#${maskId})` }}
        >
          {/*
            One zero-size wrapper rides the path, so halo and diamond share
            the exact anchor point — no per-element margin/anchor arithmetic
            that can drift them apart. Children center on it with translate.
          */}
          <motion.div
            data-testid="toc-tail"
            className="absolute left-0 top-0"
            style={{
              width: 0,
              height: 0,
              offsetPath,
              offsetDistance,
              offsetRotate: "0deg",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: TAIL_SIZE,
                height: TAIL_SIZE,
                translate: "-50% -50%",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, var(--color-accent) 0%, transparent 70%)",
                opacity: 0.45,
              }}
            />
          </motion.div>
        </div>
      ) : null}
      <motion.div
        data-testid="toc-marker"
        className="absolute left-0 top-0 size-[9px] rounded-[2px] border border-dotted border-[var(--color-accent)] bg-[var(--color-bg)]"
        style={{
          offsetPath,
          offsetDistance,
          offsetRotate: "0deg",
          rotate: "45deg",
          opacity: valid ? 1 : 0,
        }}
      />
    </div>
  );
}
