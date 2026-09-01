"use client";

import { useState } from "react";
import { motion } from "motion/react";

export function LogoDrawDemo() {
  const [key, setKey] = useState(0);

  return (
    <div className="flex flex-col items-center gap-4">
      <svg key={key} width="180" height="180" viewBox="0 0 100 100" fill="none" className="text-[var(--color-accent)]">
        <motion.path d="M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 1.5, ease: "easeInOut" }} />
        <motion.path d="M50 25 L70 50 L50 75 L30 50 Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 1, delay: 0.8, ease: "easeInOut" }} />
        <motion.circle cx="50" cy="50" r="4" fill="currentColor" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3, delay: 1.6, type: "spring", stiffness: 400 }} />
        <motion.line x1="50" y1="25" x2="50" y2="5" stroke="currentColor" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 1.8 }} />
        <motion.line x1="50" y1="75" x2="50" y2="95" stroke="currentColor" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 2.0 }} />
      </svg>
      <button onClick={() => setKey((k) => k + 1)} className="demo-btn">Replay</button>
    </div>
  );
}
