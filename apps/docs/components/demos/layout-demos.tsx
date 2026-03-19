"use client";

import { useState } from "react";
import { motion, AnimatePresence, Reorder } from "motion/react";

/* ── 1. Expandable Card ── */
export function ExpandableCardDemo() {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      onClick={() => setExpanded(!expanded)}
      className="cursor-pointer rounded-2xl bg-[#1a1a2e] border border-[#c8ff2e]/10 overflow-hidden select-none"
      style={{ width: expanded ? 340 : 220 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
    >
      <motion.div layout="position" className="p-5">
        <motion.div layout="position" className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg bg-[#c8ff2e]/15 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c8ff2e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18" />
            </svg>
          </div>
          <motion.p layout="position" className="text-[#c8ff2e] font-semibold text-sm">
            Dashboard
          </motion.p>
        </motion.div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-4 space-y-3"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Revenue</span>
                <span className="text-[#c8ff2e] font-mono font-semibold">$12,450</span>
              </div>
              <div className="h-1.5 rounded-full bg-[#c8ff2e]/10 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-[#c8ff2e]"
                  initial={{ width: 0 }}
                  animate={{ width: "72%" }}
                  transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
                />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Users</span>
                <span className="text-[#c8ff2e] font-mono font-semibold">1,284</span>
              </div>
              <div className="h-1.5 rounded-full bg-[#c8ff2e]/10 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-[#c8ff2e]/70"
                  initial={{ width: 0 }}
                  animate={{ width: "58%" }}
                  transition={{ duration: 0.8, delay: 0.25, ease: "easeOut" }}
                />
              </div>
              <p className="text-[10px] text-gray-500 pt-1">Click to collapse</p>
            </motion.div>
          )}
        </AnimatePresence>

        {!expanded && (
          <p className="text-[10px] text-gray-500 mt-2">Click to expand</p>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ── 2. Shuffle List ── */
const SHUFFLE_ITEMS = [
  { id: "a", label: "Design", icon: "◆" },
  { id: "b", label: "Develop", icon: "⚡" },
  { id: "c", label: "Deploy", icon: "▲" },
  { id: "d", label: "Monitor", icon: "◉" },
];

export function ShuffleListDemo() {
  const [items, setItems] = useState(SHUFFLE_ITEMS);

  const shuffle = () => {
    setItems([...items].sort(() => Math.random() - 0.5));
  };

  return (
    <div className="w-56">
      <button
        onClick={shuffle}
        className="mb-3 w-full px-4 py-2 rounded-lg bg-[#c8ff2e] text-[#0a0a0f] text-xs font-bold uppercase tracking-wider cursor-pointer transition-transform active:scale-95"
      >
        Shuffle
      </button>
      <div className="space-y-2">
        {items.map((item) => (
          <motion.div
            key={item.id}
            layout
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="flex items-center gap-3 rounded-lg bg-[#1a1a2e] border border-[#c8ff2e]/8 px-4 py-2.5 text-[var(--color-fg)]"
          >
            <span className="text-[#c8ff2e] text-xs">{item.icon}</span>
            <span className="text-sm font-medium">{item.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ── 3. Shared Layout Tabs ── */
const TABS = ["Overview", "Analytics", "Reports", "Settings"];

export function SharedLayoutTabsDemo() {
  const [active, setActive] = useState("Overview");

  return (
    <div className="w-full max-w-sm">
      <div className="flex gap-1 p-1 rounded-xl bg-[#1a1a2e] border border-[#c8ff2e]/8">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className="relative flex-1 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors z-10"
            style={{ color: active === tab ? "#0a0a0f" : "#8a8a9a" }}
          >
            {active === tab && (
              <motion.div
                layoutId="tab-pill"
                className="absolute inset-0 rounded-lg bg-[#c8ff2e]"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{tab}</span>
          </button>
        ))}
      </div>
      <motion.div
        key={active}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="mt-4 p-4 rounded-xl bg-[#1a1a2e]/60 border border-[#c8ff2e]/5"
      >
        <p className="text-xs text-gray-400">
          Showing <span className="text-[#c8ff2e] font-medium">{active}</span> content
        </p>
      </motion.div>
    </div>
  );
}

/* ── 4. Grid Layout Toggle ── */
export function GridToggleDemo() {
  const [cols, setCols] = useState(3);
  const items = Array.from({ length: 6 }, (_, i) => i + 1);

  return (
    <div className="w-full max-w-xs">
      <div className="flex gap-2 mb-3">
        {[2, 3].map((n) => (
          <button
            key={n}
            onClick={() => setCols(n)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all"
            style={{
              background: cols === n ? "#c8ff2e" : "#1a1a2e",
              color: cols === n ? "#0a0a0f" : "#8a8a9a",
              border: `1px solid ${cols === n ? "#c8ff2e" : "rgba(200,255,46,0.08)"}`,
            }}
          >
            {n} cols
          </button>
        ))}
      </div>
      <div
        className="grid gap-2 transition-all"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {items.map((item) => (
          <motion.div
            key={item}
            layout
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="rounded-xl bg-[#1a1a2e] border border-[#c8ff2e]/8 p-4 text-center"
          >
            <span className="text-[#c8ff2e] font-mono font-bold text-sm">{String(item).padStart(2, "0")}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ── 5. Drag-to-Reorder ── */
const REORDER_ITEMS = ["Tailwind", "Motion", "React", "TypeScript"];

export function DragReorderDemo() {
  const [items, setItems] = useState(REORDER_ITEMS);

  return (
    <div className="w-56">
      <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-3 font-medium">Drag to reorder</p>
      <Reorder.Group
        axis="y"
        values={items}
        onReorder={setItems}
        className="space-y-2"
      >
        {items.map((item) => (
          <Reorder.Item
            key={item}
            value={item}
            className="flex items-center gap-3 cursor-grab active:cursor-grabbing rounded-lg bg-[#1a1a2e] border border-[#c8ff2e]/8 px-4 py-2.5 select-none"
            whileDrag={{
              scale: 1.04,
              boxShadow: "0 8px 32px rgba(200, 255, 46, 0.12)",
              borderColor: "rgba(200, 255, 46, 0.3)",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#5a5a6a" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="9" cy="6" r="1" /><circle cx="15" cy="6" r="1" />
              <circle cx="9" cy="12" r="1" /><circle cx="15" cy="12" r="1" />
              <circle cx="9" cy="18" r="1" /><circle cx="15" cy="18" r="1" />
            </svg>
            <span className="text-sm font-medium text-[var(--color-fg)]">{item}</span>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
}
