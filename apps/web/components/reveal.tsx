"use client";

import { m, useReducedMotion } from "motion/react";

const easeOutQuint: [number, number, number, number] = [0.23, 1, 0.32, 1];

/**
 * Lightweight in-view reveal for landing sections. Reveals are purely
 * additive on top of already-visible content (content is never gated): the
 * element starts at rest and is only nudged when scrolled into view, and
 * flips to an instant crossfade under prefers-reduced-motion.
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  once = true,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <m.div
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: easeOutQuint }}
      className={className}
    >
      {children}
    </m.div>
  );
}
