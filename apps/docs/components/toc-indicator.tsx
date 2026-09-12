"use client";

import { useEffect } from "react";
import {
  motion,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";

const SPRING = { stiffness: 180, damping: 20 };

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

  const offsetDistance = useTransform(animatedDistance, (v) =>
    totalLength > 0 ? `${(v / totalLength) * 100}%` : "0%",
  );

  const offsetPath = `path('${path}')`;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-0 overflow-visible"
      style={{ width: 22, height }}
    >
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
