"use client";

import { useState } from "react";
import { motion, type Variants } from "motion/react";

type CardState = "idle" | "hover" | "active" | "disabled";

const stateVariants: Variants = {
  idle: { scale: 1, y: 0, opacity: 1 },
  hover: { scale: 1.03, y: -4 },
  active: { scale: 1.06, y: -8 },
  disabled: { scale: 0.97, y: 0, opacity: 0.4 },
};

export function MultiStateDemo() {
  const [state, setState] = useState<CardState>("idle");
  const states: CardState[] = ["idle", "hover", "active", "disabled"];

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-1.5">
        {states.map((s) => (
          <button
            key={s}
            onClick={() => setState(s)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-all border ${
              state === s
                ? "bg-[var(--color-accent)] text-[var(--color-accent-fg)] border-[var(--color-accent)]"
                : "bg-[var(--color-surface)] text-[var(--color-fg-muted)] border-[var(--color-border)]"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
      <motion.div
        variants={stateVariants}
        animate={state}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        className={`rounded-2xl bg-[var(--color-surface-elevated)] border p-6 w-48 text-center ${
          state === "active"
            ? "border-[var(--color-accent)]"
            : "border-[var(--color-border)]"
        }`}
      >
        <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center bg-[var(--color-accent)]/10">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            className="stroke-[var(--color-accent)]"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-[var(--color-fg)]">
          {state.charAt(0).toUpperCase() + state.slice(1)}
        </p>
        <p className="text-[10px] text-[var(--color-fg-muted)] mt-1">
          State: {state}
        </p>
      </motion.div>
    </div>
  );
}
