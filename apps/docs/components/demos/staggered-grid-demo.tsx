"use client";

import { useState } from "react";
import { motion } from "motion/react";

const cardData = [
  { icon: "⚡", title: "Fast", desc: "Build-time transform" },
  { icon: "◆", title: "Zero Runtime", desc: "No JS overhead" },
  { icon: "▲", title: "Type Safe", desc: "Full IntelliSense" },
  { icon: "◉", title: "Spring Physics", desc: "Natural motion" },
];

const gridContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const gridItem = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 300, damping: 24 },
  },
};

export function StaggeredGridDemo() {
  const [key, setKey] = useState(0);

  return (
    <div className="w-full max-w-xs">
      <button
        onClick={() => setKey((k) => k + 1)}
        className="demo-btn-primary mb-4"
      >
        Replay
      </button>
      <motion.div
        key={key}
        variants={gridContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 gap-2"
      >
        {cardData.map((card) => (
          <motion.div
            key={card.title}
            variants={gridItem}
            className="rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-4"
          >
            <span className="text-lg">{card.icon}</span>
            <p className="text-[var(--color-accent)] font-semibold text-xs mt-2">
              {card.title}
            </p>
            <p className="text-[var(--color-fg-muted)] text-[10px] mt-0.5">
              {card.desc}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
