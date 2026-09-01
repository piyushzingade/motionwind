"use client";

import { useState } from "react";
import { motion } from "motion/react";

export function AnimatedCheckboxDemo() {
  const [checked, setChecked] = useState(false);

  return (
    <div className="flex items-center gap-6">
      {[false, true].map((slot, i) => {
        const isOn = i === 0 ? checked : !checked;
        return (
          <button key={String(slot)} onClick={() => setChecked(!checked)} className="flex items-center gap-3 cursor-pointer group">
            <div className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-colors ${isOn ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10" : "border-[var(--color-border)] bg-transparent"}`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <motion.path d="M5 13l4 4L19 7" className="stroke-[var(--color-accent)]" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" initial={false} animate={{ pathLength: isOn ? 1 : 0, opacity: isOn ? 1 : 0 }} transition={{ duration: 0.25, ease: "easeOut" }} />
              </svg>
            </div>
            <span className={`text-xs font-medium transition-colors ${isOn ? "text-[var(--color-accent)]" : "text-[var(--color-fg-muted)]"}`}>
              {i === 0 ? "Design" : "Develop"}
            </span>
          </button>
        );
      })}
    </div>
  );
}
