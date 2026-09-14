"use client";

import { useState } from "react";
import { motion } from "motion/react";

export function OrbitDotsDemo() {
  const [key, setKey] = useState(0);

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        key={key}
        className="relative h-40 w-40"
        role="img"
        aria-label="Dots orbiting a center point"
      >
        <span className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-accent)]" />
        <div className="absolute inset-0 rounded-full border border-[var(--color-border)]" />
        <motion.div
          className="absolute inset-0"
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        >
          <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-accent)]" />
        </motion.div>
        <div className="absolute inset-5 rounded-full border border-[var(--color-border)]" />
        <motion.div
          className="absolute inset-5"
          animate={{ rotate: -360 }}
          transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
        >
          <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-fg-muted)]" />
        </motion.div>
      </div>
      <button onClick={() => setKey((k) => k + 1)} className="demo-btn">
        Restart
      </button>
    </div>
  );
}
