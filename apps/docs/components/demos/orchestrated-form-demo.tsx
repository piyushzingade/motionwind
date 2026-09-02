"use client";

import { useState } from "react";
import { motion } from "motion/react";

const formContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};
const formField = {
  hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring" as const, stiffness: 300, damping: 24 },
  },
};

export function OrchestratedFormDemo() {
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
        variants={formContainer}
        initial="hidden"
        animate="visible"
        className="space-y-3 rounded-2xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-5"
      >
        {[
          { label: "Name", placeholder: "Enter your name" },
          { label: "Email", placeholder: "you@example.com" },
        ].map((field) => (
          <motion.div key={field.label} variants={formField}>
            <label className="text-[10px] text-[var(--color-fg-muted)] uppercase tracking-wider font-medium block mb-1.5">
              {field.label}
            </label>
            <div className="h-9 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] px-3 flex items-center">
              <span className="text-xs text-[var(--color-fg-muted)]">
                {field.placeholder}
              </span>
            </div>
          </motion.div>
        ))}
        <motion.div variants={formField}>
          <label className="text-[10px] text-[var(--color-fg-muted)] uppercase tracking-wider font-medium block mb-1.5">
            Message
          </label>
          <div className="h-16 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] px-3 pt-2">
            <span className="text-xs text-[var(--color-fg-muted)]">
              Write something...
            </span>
          </div>
        </motion.div>
        <motion.div variants={formField}>
          <div className="h-9 rounded-lg bg-[var(--color-accent)] flex items-center justify-center cursor-pointer">
            <span className="text-xs font-bold text-[var(--color-accent-fg)] uppercase tracking-wider">
              Submit
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
