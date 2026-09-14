"use client";

import { useState } from "react";
import { motion } from "motion/react";

const BARS = 28;

export function WaveformDemo() {
  const [key, setKey] = useState(0);

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        key={key}
        className="flex h-24 items-center gap-1"
        role="img"
        aria-label="Animated audio waveform"
      >
        {Array.from({ length: BARS }, (_, i) => (
          <motion.span
            key={i}
            className="w-1.5 rounded-full bg-[var(--color-accent)]"
            initial={{ height: 8 }}
            animate={{ height: [8, 44, 12, 60, 20, 40, 8] }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: (i % 7) * 0.12,
            }}
          />
        ))}
      </div>
      <button onClick={() => setKey((k) => k + 1)} className="demo-btn">
        Restart
      </button>
    </div>
  );
}
