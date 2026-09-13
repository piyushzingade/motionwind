"use client";

import { useEffect } from "react";
import {
  motion,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";

const SPRING = { stiffness: 180, damping: 20 };
const TAIL_LENGTH = 72;

export function TocIndicator({
  path,
  totalLength,
  centerDistances,
  activeIndex,
  height,
  scrollDirection,
}: {
  path: string;
  totalLength: number;
  centerDistances: number[];
  activeIndex: number;
  height: number;
  scrollDirection: "down" | "up";
}) {
  const animatedDistance = useSpring(0, SPRING);
  const reduceMotion = useReducedMotion();

  const valid =
    activeIndex >= 0 &&
    activeIndex < centerDistances.length &&
    totalLength > 0 &&
    path.length > 0;
  const target = valid ? (centerDistances[activeIndex] ?? 0) : 0;

  useEffect(() => {
    if (reduceMotion) {
      animatedDistance.jump(target);
      return;
    }

    animatedDistance.set(target);
  }, [target, animatedDistance, reduceMotion]);

  const offsetDistance = useTransform(animatedDistance, (v) =>
    totalLength > 0 ? `${(v / totalLength) * 100}%` : "0%",
  );
  const tailDashOffset = useTransform(animatedDistance, (distance) => {
    const start =
      scrollDirection === "down"
        ? Math.max(0, distance - TAIL_LENGTH)
        : Math.min(distance, Math.max(0, totalLength - TAIL_LENGTH));
    return -start;
  });

  const offsetPath = `path('${path}')`;
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-0 overflow-visible"
      style={{ width: 22, height }}
    >
      <svg
        width="22"
        height={height}
        className="absolute inset-0 overflow-visible"
      >
        {!reduceMotion && valid && (
          <motion.path
            d={path}
            fill="none"
            stroke="var(--color-accent)"
            strokeOpacity="0.72"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={`${TAIL_LENGTH} ${totalLength + TAIL_LENGTH}`}
            style={{ strokeDashoffset: tailDashOffset }}
          />
        )}
      </svg>
      <motion.div
        className="absolute left-0 top-0 size-[7px] rounded-[1.5px] bg-[var(--color-accent)]"
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
