"use client";

import { useState } from "react";
import { motion } from "motion/react";

export function PulseRingsDemo() {
  const [key, setKey] = useState(0);
  const rings = [0, 1, 2, 3];

  return (
    <div className="flex flex-col items-center gap-4">
      <svg
        key={key}
        width="160"
        height="160"
        viewBox="0 0 160 160"
        className="text-[var(--color-accent)]"
      >
        {rings.map((i) => (
          <motion.circle
            key={i}
            cx="80"
            cy="80"
            r={20 + i * 16}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: [0, 0.6, 0] }}
            transition={{
              duration: 2,
              delay: i * 0.3,
              repeat: Infinity,
              ease: "easeOut",
            }}
            style={{ transformOrigin: "80px 80px" }}
          />
        ))}
        <motion.circle
          cx="80"
          cy="80"
          r="8"
          fill="currentColor"
          initial={{ scale: 0 }}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
      <button onClick={() => setKey((k) => k + 1)} className="demo-btn">
        Restart
      </button>
    </div>
  );
}
