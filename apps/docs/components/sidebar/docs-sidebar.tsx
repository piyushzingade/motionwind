"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { SIDEBAR_ITEMS } from "./sidebar-items";

const easeOutQuint: [number, number, number, number] = [0.23, 1, 0.32, 1];

function SidebarGroup({
  title,
  items,
  pathname,
  onLinkClick,
}: {
  title: string;
  items: { title: string; url: string }[];
  pathname: string;
  onLinkClick?: () => void;
}) {
  return (
    <div className="mb-6">
      <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.15em] text-[var(--color-fg-muted)] mb-2 px-3">
        {title}
      </p>
      <ul className="space-y-0.5">
        {items.map((item) => {
          const isActive = pathname === item.url;
          return (
            <li key={item.url}>
              <Link
                href={item.url}
                onClick={onLinkClick}
                className={`
                  group relative flex items-center gap-2.5 rounded-lg px-3 py-1.5
                  text-[13px] transition-all duration-150
                  ${
                    isActive
                      ? "text-[var(--color-accent)] bg-[var(--color-accent)]/[0.06]"
                      : "text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] hover:bg-[var(--color-surface-elevated)]"
                  }
                `}
              >
                {isActive && (
                  <motion.span
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-[2px] rounded-full bg-[var(--color-accent)]"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="truncate">{item.title}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function DocsSidebar({
  mobileOpen,
  desktopCollapsed,
  onCloseMobile,
}: {
  mobileOpen: boolean;
  desktopCollapsed: boolean;
  onCloseMobile: () => void;
}) {
  const pathname = usePathname();

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex h-14 items-center border-b border-dashed border-[var(--color-border)] px-4">
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <img
            src="/logo.svg"
            alt="motionwind"
            width={22}
            height={22}
            className="shrink-0"
          />
          <span className="font-[family-name:var(--font-display)] text-xl italic tracking-tight text-[var(--color-fg)]">
            motionwind
          </span>
          <span className="font-[family-name:var(--font-mono)] text-[9px] text-[var(--color-fg-muted)]/50 ml-0.5">
            v0.1
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 no-scrollbar">
        {SIDEBAR_ITEMS.gettingStarted.map((group) => (
          <SidebarGroup
            key={group.title}
            title={group.title}
            items={group.items}
            pathname={pathname}
            onLinkClick={onCloseMobile}
          />
        ))}
        {SIDEBAR_ITEMS.animations.map((group) => (
          <SidebarGroup
            key={group.title}
            title={group.title}
            items={group.items}
            pathname={pathname}
            onLinkClick={onCloseMobile}
          />
        ))}
        {SIDEBAR_ITEMS.reference.map((group) => (
          <SidebarGroup
            key={group.title}
            title={group.title}
            items={group.items}
            pathname={pathname}
            onLinkClick={onCloseMobile}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-dashed border-[var(--color-border)] p-3">
        <Link
          href="https://github.com/piyushzingade/motionwind"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-[var(--color-border)] px-3 py-2 text-xs text-[var(--color-fg-muted)] no-underline transition-colors hover:border-[var(--color-accent)]/30 hover:text-[var(--color-fg)]"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          <span>GitHub</span>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar — collapsible */}
      <motion.aside
        initial={false}
        animate={{ width: desktopCollapsed ? 0 : 260 }}
        transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="hidden md:flex h-screen flex-shrink-0 flex-col border-r border-dashed border-[var(--color-border)] bg-[var(--color-bg)] sticky top-0 overflow-hidden"
      >
        <div className="w-[260px] h-full">{sidebarContent}</div>
      </motion.aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden"
              onClick={onCloseMobile}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.3, ease: easeOutQuint }}
              className="fixed left-0 top-0 z-50 h-screen w-[280px] bg-[var(--color-bg)] border-r border-[var(--color-border)] md:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
