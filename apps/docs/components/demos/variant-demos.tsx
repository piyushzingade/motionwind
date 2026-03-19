"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

/* ── 1. Staggered Card Grid ── */
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
        className="mb-4 px-4 py-2 rounded-lg bg-[#c8ff2e] text-[#0a0a0f] text-xs font-bold uppercase tracking-wider cursor-pointer transition-transform active:scale-95"
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
            className="rounded-xl bg-[#1a1a2e] border border-[#c8ff2e]/8 p-4"
          >
            <span className="text-lg">{card.icon}</span>
            <p className="text-[#c8ff2e] font-semibold text-xs mt-2">{card.title}</p>
            <p className="text-gray-500 text-[10px] mt-0.5">{card.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

/* ── 2. Multi-State Card ── */
type CardState = "idle" | "hover" | "active" | "disabled";

const stateVariants = {
  idle: {
    scale: 1,
    y: 0,
    boxShadow: "0 0 0 rgba(200,255,46,0)",
    borderColor: "rgba(200,255,46,0.08)",
  },
  hover: {
    scale: 1.03,
    y: -4,
    boxShadow: "0 8px 24px rgba(200,255,46,0.08)",
    borderColor: "rgba(200,255,46,0.25)",
  },
  active: {
    scale: 1.06,
    y: -8,
    boxShadow: "0 16px 40px rgba(200,255,46,0.15)",
    borderColor: "rgba(200,255,46,0.5)",
  },
  disabled: {
    scale: 0.97,
    y: 0,
    opacity: 0.4,
    boxShadow: "0 0 0 rgba(200,255,46,0)",
    borderColor: "rgba(200,255,46,0.03)",
  },
};

const STATE_COLORS: Record<CardState, string> = {
  idle: "#8a8a9a",
  hover: "#c8ff2e",
  active: "#c8ff2e",
  disabled: "#5a5a6a",
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
            className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-all"
            style={{
              background: state === s ? "#c8ff2e" : "#1a1a2e",
              color: state === s ? "#0a0a0f" : "#8a8a9a",
              border: `1px solid ${state === s ? "#c8ff2e" : "rgba(200,255,46,0.08)"}`,
            }}
          >
            {s}
          </button>
        ))}
      </div>
      <motion.div
        variants={stateVariants}
        animate={state}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        className="rounded-2xl bg-[#1a1a2e] border p-6 w-48 text-center"
      >
        <div
          className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center transition-colors"
          style={{ backgroundColor: `${STATE_COLORS[state]}15` }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={STATE_COLORS[state]} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <p className="text-sm font-semibold" style={{ color: STATE_COLORS[state] }}>
          {state.charAt(0).toUpperCase() + state.slice(1)}
        </p>
        <p className="text-[10px] text-gray-500 mt-1">State: {state}</p>
      </motion.div>
    </div>
  );
}

/* ── 3. Collapsible Sidebar ── */
const sidebarNav = {
  collapsed: { width: 56, transition: { staggerChildren: 0.04, staggerDirection: -1 } },
  expanded: { width: 200, transition: { staggerChildren: 0.04 } },
};
const sidebarLabel = {
  collapsed: { opacity: 0, x: -8 },
  expanded: { opacity: 1, x: 0 },
};

const NAV_ITEMS = [
  { label: "Home", path: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1" },
  { label: "Search", path: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
  { label: "Inbox", path: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
  { label: "Settings", path: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" },
];

export function CollapsibleSidebarDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex gap-4 items-start">
      <motion.nav
        variants={sidebarNav}
        animate={open ? "expanded" : "collapsed"}
        className="rounded-xl bg-[#1a1a2e] border border-[#c8ff2e]/8 overflow-hidden py-2"
      >
        {NAV_ITEMS.map((item) => (
          <motion.div
            key={item.label}
            className="flex items-center gap-3 px-4 py-2.5 cursor-pointer"
            whileHover={{ backgroundColor: "rgba(200,255,46,0.04)" }}
          >
            <div className="w-7 h-7 rounded-lg bg-[#c8ff2e]/8 flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c8ff2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={item.path} />
              </svg>
            </div>
            <motion.span
              variants={sidebarLabel}
              className="text-xs font-medium text-[var(--color-fg)] whitespace-nowrap"
            >
              {item.label}
            </motion.span>
          </motion.div>
        ))}
      </motion.nav>
      <button
        onClick={() => setOpen(!open)}
        className="mt-2 px-3 py-1.5 rounded-lg bg-[#c8ff2e] text-[#0a0a0f] text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-transform active:scale-95"
      >
        {open ? "Collapse" : "Expand"}
      </button>
    </div>
  );
}

/* ── 4. Notification Stack ── */
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
    const msg = NOTIF_MESSAGES[notifId % NOTIF_MESSAGES.length]!;
    setNotifs((prev) => [...prev.slice(-3), { id: notifId++, msg }]);
  };

  const remove = (id: number) => {
    setNotifs((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="w-full max-w-xs">
      <button
        onClick={add}
        className="mb-3 px-4 py-2 rounded-lg bg-[#c8ff2e] text-[#0a0a0f] text-xs font-bold uppercase tracking-wider cursor-pointer transition-transform active:scale-95"
      >
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
              className="flex items-center gap-3 rounded-lg bg-[#1a1a2e] border border-[#c8ff2e]/10 px-4 py-2.5 cursor-pointer"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#c8ff2e] flex-shrink-0 shadow-[0_0_6px_rgba(200,255,46,0.4)]" />
              <span className="text-xs font-medium text-[var(--color-fg)] flex-1">{n.msg}</span>
              <span className="text-[10px] text-gray-600">✕</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      {notifs.length === 0 && (
        <p className="text-[10px] text-gray-600 text-center mt-4">No notifications</p>
      )}
    </div>
  );
}

/* ── 5. Orchestrated Form Fields ── */
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
        className="mb-4 px-4 py-2 rounded-lg bg-[#c8ff2e] text-[#0a0a0f] text-xs font-bold uppercase tracking-wider cursor-pointer transition-transform active:scale-95"
      >
        Replay
      </button>
      <motion.div
        key={key}
        variants={formContainer}
        initial="hidden"
        animate="visible"
        className="space-y-3 rounded-2xl bg-[#1a1a2e] border border-[#c8ff2e]/8 p-5"
      >
        <motion.div variants={formField}>
          <label className="text-[10px] text-gray-500 uppercase tracking-wider font-medium block mb-1.5">Name</label>
          <div className="h-9 rounded-lg bg-[#0a0a0f] border border-[#c8ff2e]/8 px-3 flex items-center">
            <span className="text-xs text-gray-600">Enter your name</span>
          </div>
        </motion.div>
        <motion.div variants={formField}>
          <label className="text-[10px] text-gray-500 uppercase tracking-wider font-medium block mb-1.5">Email</label>
          <div className="h-9 rounded-lg bg-[#0a0a0f] border border-[#c8ff2e]/8 px-3 flex items-center">
            <span className="text-xs text-gray-600">you@example.com</span>
          </div>
        </motion.div>
        <motion.div variants={formField}>
          <label className="text-[10px] text-gray-500 uppercase tracking-wider font-medium block mb-1.5">Message</label>
          <div className="h-16 rounded-lg bg-[#0a0a0f] border border-[#c8ff2e]/8 px-3 pt-2">
            <span className="text-xs text-gray-600">Write something...</span>
          </div>
        </motion.div>
        <motion.div variants={formField}>
          <div className="h-9 rounded-lg bg-[#c8ff2e] flex items-center justify-center cursor-pointer">
            <span className="text-xs font-bold text-[#0a0a0f] uppercase tracking-wider">Submit</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
