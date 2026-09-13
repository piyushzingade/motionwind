"use client";

import { useEffect, useId } from "react";
import {
  motion,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";

const SPRING = { stiffness: 180, damping: 20 };
const TAIL_SIZE = 72;

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
  const tailRotation = useSpring(90, SPRING);
  const tailOffset = useSpring(-TAIL_SIZE / 2, SPRING);
  const reduceMotion = useReducedMotion();
  const maskId = useId().replace(/:/g, "");

  const valid =
    activeIndex >= 0 &&
    activeIndex < centerDistances.length &&
    totalLength > 0 &&
    path.length > 0;
  const target = valid ? (centerDistances[activeIndex] ?? 0) : 0;

  useEffect(() => {
    const rotation = scrollDirection === "down" ? 90 : -90;
    const offset = scrollDirection === "down" ? -TAIL_SIZE / 2 : TAIL_SIZE / 2;

    if (reduceMotion) {
      animatedDistance.jump(target);
      tailRotation.jump(rotation);
      tailOffset.jump(offset);
      return;
    }

    animatedDistance.set(target);
    tailRotation.set(rotation);
    tailOffset.set(offset);
  }, [
    target,
    scrollDirection,
    animatedDistance,
    tailOffset,
    tailRotation,
    reduceMotion,
  ]);

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
      <svg
        width="22"
        height={height}
        className="absolute inset-0 overflow-visible"
      >
        <defs>
          <mask id={maskId} maskUnits="userSpaceOnUse">
            <path
              d={path}
              fill="none"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </mask>
        </defs>
      </svg>
      {!reduceMotion && valid && (
        <div
          className="absolute inset-0 overflow-visible"
          style={{ mask: `url(#${maskId})`, WebkitMask: `url(#${maskId})` }}
        >
          <motion.div
            className="absolute left-0 top-0"
            style={{
              width: TAIL_SIZE,
              height: TAIL_SIZE,
              offsetPath,
              offsetDistance,
              offsetRotate: "0deg",
              rotate: tailRotation,
              marginTop: tailOffset,
              background:
                "linear-gradient(90deg, transparent 0%, var(--color-accent) 100%)",
            }}
          />
        </div>
      )}
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
