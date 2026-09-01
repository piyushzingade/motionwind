"use client";

import { useCallback, useRef } from "react";
import { useSpring, useMotionValue } from "motion/react";

export function useHeroGlow() {
  const glowX = useMotionValue(-1000);
  const glowY = useMotionValue(-1000);
  const springX = useSpring(glowX, { stiffness: 60, damping: 20, mass: 0.6 });
  const springY = useSpring(glowY, { stiffness: 60, damping: 20, mass: 0.6 });
  const heroGlow = useRef<HTMLDivElement>(null);

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      glowX.set(e.clientX);
      glowY.set(e.clientY);
    },
    [glowX, glowY],
  );

  const onMouseLeave = useCallback(() => {
    glowX.set(-1000);
    glowY.set(-1000);
  }, [glowX, glowY]);

  return { springX, springY, heroGlow, onMouseMove, onMouseLeave };
}
