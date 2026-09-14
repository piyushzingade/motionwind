"use client";

import { useState } from "react";
import { motion } from "motion/react";

export function MorphBlobDemo() {
  const [key, setKey] = useState(0);

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        key={key}
        className="h-32 w-32 bg-[var(--color-accent)]/30"
        role="img"
        aria-label="Morphing organic blob"
        initial={{
          borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
        }}
        animate={{
          borderRadius: [
            "30% 70% 70% 30% / 30% 30% 70% 70%",
            "70% 30% 30% 70% / 70% 70% 30% 30%",
            "50% 50% 60% 40% / 40% 60% 40% 60%",
            "30% 70% 70% 30% / 30% 30% 70% 70%",
          ],
          rotate: [0, 120, 240, 360],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <button onClick={() => setKey((k) => k + 1)} className="demo-btn">
        Restart
      </button>
    </div>
  );
}
