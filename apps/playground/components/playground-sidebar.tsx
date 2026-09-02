"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { PLAYGROUND_SIDEBAR, type SidebarGroup } from "./sidebar-items";

const easeOutQuint: [number, number, number, number] = [0.23, 1, 0.32, 1];

function SidebarGroupComponent({
  group,
  pathname,
  onLinkClick,
}: {
  group: SidebarGroup;
  pathname: string;
  onLinkClick?: () => void;
}) {
  return (
    <div className="mb-4">
      <p className="mb-1.5 flex items-center gap-2 px-3 font-[family-name:var(--font-mono)] text-[9px] font-medium uppercase tracking-[0.12em] text-[var(--color-fg-muted)]/70">
        <span className="h-px w-2 bg-[var(--color-border)]" />
        {group.title}
      </p>
      <ul>
        {group.items.map((item) => {
          const isActive = pathname === item.url;
          return (
            <li key={item.url}>
              <Link
                href={item.url}
                onClick={onLinkClick}
                aria-current={isActive ? "page" : undefined}
                className={`
                  group relative flex items-center gap-2 px-3 py-[5px]
                  text-[12px] leading-none transition-all duration-100 no-underline
                  ${
                    isActive
                      ? "text-[var(--color-accent)]"
                      : "text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
                  }
                `}
              >
                {isActive && (
                  <span className="absolute inset-y-0 left-0 w-[2px] rounded-full bg-[var(--color-accent)]" />
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

export function PlaygroundSidebar({
  mobileOpen,
  collapsed,
  onCloseMobile,
}: {
  mobileOpen: boolean;
  collapsed: boolean;
  onCloseMobile: () => void;
}) {
  const pathname = usePathname();

  const sidebarContent = (
    <div className="flex h-full flex-col min-w-[240px]">
      <div className="flex h-10 items-center gap-2 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4">
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
        <span className="font-[family-name:var(--font-display)] text-[13px] italic tracking-tight text-[var(--color-fg)]">
          motionwind
        </span>
        <span className="ml-auto font-[family-name:var(--font-mono)] text-[8px] uppercase tracking-[0.15em] text-[var(--color-fg-muted)]/40">
          studio
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 no-scrollbar">
        {PLAYGROUND_SIDEBAR.gettingStarted.map((group) => (
          <SidebarGroupComponent
            key={group.title}
            group={group}
            pathname={pathname}
            onLinkClick={onCloseMobile}
          />
        ))}
        <div className="mx-3 mb-4 h-px bg-[var(--color-border)]" />
        {PLAYGROUND_SIDEBAR.animations.map((group) => (
          <SidebarGroupComponent
            key={group.title}
            group={group}
            pathname={pathname}
            onLinkClick={onCloseMobile}
          />
        ))}
        <div className="mx-3 mb-4 h-px bg-[var(--color-border)]" />
        {PLAYGROUND_SIDEBAR.reference.map((group) => (
          <SidebarGroupComponent
            key={group.title}
            group={group}
            pathname={pathname}
            onLinkClick={onCloseMobile}
          />
        ))}
      </nav>

      <div className="border-t border-[var(--color-border)] px-3 py-2.5">
        <Link
          href="https://www.motionwind.xyz/docs"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 text-[11px] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-accent)] no-underline"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-50 group-hover:opacity-100 transition-opacity"
          >
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
          <span>Read the Docs</span>
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="ml-auto opacity-0 transition-opacity group-hover:opacity-50"
          >
            <path d="M7 17L17 7M17 7H7M17 7v10" />
          </svg>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      <aside
        className="hidden md:flex h-screen flex-shrink-0 flex-col border-r border-[var(--color-border)] bg-[var(--color-bg)] overflow-hidden transition-[width] duration-200 ease-out"
        style={{ width: collapsed ? 0 : 240 }}
        aria-label="Studio navigation"
      >
        {sidebarContent}
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              role="button"
              tabIndex={0}
              aria-label="Close navigation sidebar"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden"
              onClick={onCloseMobile}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onCloseMobile();
                }
              }}
            />
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ duration: 0.25, ease: easeOutQuint }}
              className="fixed left-0 top-0 z-50 h-screen w-[240px] bg-[var(--color-bg)] border-r border-[var(--color-border)] md:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
