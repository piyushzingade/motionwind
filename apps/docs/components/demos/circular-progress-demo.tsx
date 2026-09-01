"use client";

import { useState } from "react";
import { motion } from "motion/react";

export function CircularProgressDemo() {
  const [progress, setProgress] = useState(72);
  const r = 40;
  const circumference = 2 * Math.PI * r;

  const cycle = () => {
    const values = [25, 50, 72, 88, 100];
    const next = values[(values.indexOf(progress) + 1) % values.length] ?? 72;
    setProgress(next);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <svg width="120" height="120" viewBox="0 0 100 100" className="-rotate-90">
          <circle cx="50" cy="50" r={r} fill="none" className="stroke-[var(--color-border)]" strokeWidth="6" />
          <motion.circle cx="50" cy="50" r={r} fill="none" className="stroke-[var(--color-accent)]" strokeWidth="6" strokeLinecap="round" strokeDasharray={circumference} animate={{ strokeDashoffset: circumference * (1 - progress / 100) }} transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span key={progress} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-[var(--color-accent)] font-mono font-bold text-lg">
            {progress}%
          </motion.span>
        </div>
      </div>
      <button onClick={cycle} className="demo-btn">Change</button>
    </div>
  );
}
