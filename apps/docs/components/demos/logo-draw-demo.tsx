"use client";

import { useState } from "react";
import { motion } from "motion/react";

export function LogoDrawDemo() {
  const [key, setKey] = useState(0);

  return (
    <div className="flex flex-col items-center gap-4">
      <svg
        key={key}
        width="180"
        height="180"
        viewBox="0 0 120 120"
        fill="none"
        className="text-[var(--color-accent)]"
        role="img"
        aria-label="Hexagon mark drawing itself"
      >
        <motion.path
          d="M60 10 L103 35 L103 85 L60 110 L17 85 L17 35 Z"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
        />
        <motion.circle
          cx="60"
          cy="60"
          r="5"
          fill="currentColor"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            delay: 1.1,
            type: "spring",
            stiffness: 400,
            damping: 16,
          }}
          style={{ transformOrigin: "60px 60px" }}
        />
      </svg>
      <button onClick={() => setKey((k) => k + 1)} className="demo-btn">
        Replay
      </button>
    </div>
  );
}
