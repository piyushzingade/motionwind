"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

let notifId = 0;
const NOTIF_MESSAGES = [
  "Build succeeded ✓",
  "New PR from @piyush",
  "Deploy to production",
  "Test suite passed",
  "Bundle size: 12kb",
];

const notifContainer = {
  visible: { transition: { staggerChildren: 0.05 } },
};
const notifItem = {
  hidden: { opacity: 0, x: 40, scale: 0.9 },
  visible: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: -20, scale: 0.9, transition: { duration: 0.15 } },
};

export function NotificationStackDemo() {
  const [notifs, setNotifs] = useState<{ id: number; msg: string }[]>([]);

  const add = () => {
    const id = notifId++;
    const msg = NOTIF_MESSAGES[id % NOTIF_MESSAGES.length]!;
    setNotifs((prev) => [...prev.slice(-3), { id, msg }]);
  };

  const remove = (id: number) => {
    setNotifs((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="w-full max-w-xs">
      <button onClick={add} className="demo-btn-primary mb-3">
        Add Notification
      </button>
      <motion.div variants={notifContainer} animate="visible" className="space-y-2">
        <AnimatePresence mode="popLayout">
          {notifs.map((n) => (
            <motion.div
              key={n.id}
              variants={notifItem}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
              onClick={() => remove(n.id)}
              className="flex items-center gap-3 rounded-lg bg-[var(--color-surface-elevated)] border border-[var(--color-border)] px-4 py-2.5 cursor-pointer"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] flex-shrink-0" />
              <span className="text-xs font-medium text-[var(--color-fg)] flex-1">{n.msg}</span>
              <span className="text-[10px] text-[var(--color-fg-muted)]">✕</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      {notifs.length === 0 && (
        <p className="text-[10px] text-[var(--color-fg-muted)] text-center mt-4">No notifications</p>
      )}
    </div>
  );
}
