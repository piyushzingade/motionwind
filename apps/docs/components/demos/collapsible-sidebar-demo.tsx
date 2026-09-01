"use client";

import { useState } from "react";
import { motion } from "motion/react";

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
        className="rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] overflow-hidden py-2"
      >
        {NAV_ITEMS.map((item) => (
          <motion.div
            key={item.label}
            className="flex items-center gap-3 px-4 py-2.5 cursor-pointer"
            whileHover={{ backgroundColor: "rgba(128,128,128,0.06)" }}
          >
            <div className="w-7 h-7 rounded-lg bg-[var(--color-accent)]/8 flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="stroke-[var(--color-accent)]" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={item.path} />
              </svg>
            </div>
            <motion.span variants={sidebarLabel} className="text-xs font-medium text-[var(--color-fg)] whitespace-nowrap">
              {item.label}
            </motion.span>
          </motion.div>
        ))}
      </motion.nav>
      <button onClick={() => setOpen(!open)} className="demo-btn mt-2">
        {open ? "Collapse" : "Expand"}
      </button>
    </div>
  );
}
