"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { PLAYGROUND_SIDEBAR, type SidebarGroup } from "./sidebar-items";

const easeOutQuint: [number, number, number, number] = [0.23, 1, 0.32, 1];

const GROUP_ICONS: Record<string, React.ReactNode> = {
  Gestures: (
    <path d="M18 11V6a2 2 0 0 0-4 0v5V4a2 2 0 0 0-4 0v7M14 11V9a2 2 0 0 0-4 0v9M18 13v-2a2 2 0 0 0-4 0M8 13v5a3 3 0 0 0 3 3h3a4 4 0 0 0 4-4v-3a2 2 0 0 0-2-2H9" />
  ),
  Transitions: <path d="M2 12h20M4 8l8 4-8 4M20 8l-8 4 8 4" />,
  "Scroll & View": (
    <path d="M12 2v10m0 0-4-4m4 4 4-4M12 22v-6m0 0-4 4m4-4 4 4M3 8a9 9 0 0 1 18 0v8a9 9 0 0 1-18 0z" />
  ),
  "Enter & Exit": <path d="M12 2v20m0-20-5 5m5-5 5 5m-5 15-5-5m5 5 5-5" />,
  Layout: (
    <path d="M3 8V6a3 3 0 0 1 3-3h2M19 3h2a3 3 0 0 1 3 3v2M21 16v2a3 3 0 0 1-3 3h-2M5 21H3a3 3 0 0 1-3-3v-2M12 3v18" />
  ),
  Reference: <path d="M12 3v18m-7-3L12 4l7 14z" />,
  Frameworks: <path d="M4 3h7l7 18H11l-7-18zm3 0 7 18" />,
  Setup: <path d="M4 17l6-6-6-6M12 19h8" />,
};

function GroupIcon({ title }: { title: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5 shrink-0"
      aria-hidden="true"
    >
      {GROUP_ICONS[title] ?? <path d="M12 5v14M5 12h14" />}
    </svg>
  );
}

function SidebarGroupComponent({
  group,
  pathname,
  onLinkClick,
}: {
  group: SidebarGroup;
  pathname: string;
  onLinkClick?: () => void;
}) {
  const hasActive = group.items.some((item) => pathname === item.url);
  return (
    <div className="mb-5">
      <div
        className={`mb-1.5 flex items-center gap-2 px-2 ${
          hasActive
            ? "text-[var(--color-accent)]"
            : "text-[var(--color-fg-muted)]"
        }`}
      >
        <GroupIcon title={group.title} />
        <p className="font-[family-name:var(--font-sans)] text-[10px] font-semibold uppercase tracking-[0.08em]">
          {group.title}
        </p>
      </div>
      <ul className="space-y-1">
        {group.items.map((item) => {
          const isActive = pathname === item.url;
          return (
            <li key={item.url}>
              <Link
                href={item.url}
                onClick={onLinkClick}
                aria-current={isActive ? "page" : undefined}
                className={`
                  flex items-center justify-between gap-2 rounded-md border px-2.5 py-1.5
                  text-[12px] transition-all duration-150 no-underline
                  ${
                    isActive
                      ? "border-[var(--color-accent)]/40 bg-[var(--color-accent)]/[0.1] text-[var(--color-accent)] font-medium"
                      : "border-transparent text-[var(--color-fg-muted)] hover:border-[var(--color-border)] hover:text-[var(--color-fg)] hover:bg-[var(--color-surface-elevated)]"
                  }
                `}
              >
                <span className="truncate">{item.title}</span>
                {isActive && (
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]"
                    aria-hidden="true"
                  />
                )}
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
    <div className="flex h-full flex-col min-w-[260px]">
      <div className="flex h-14 items-center gap-2.5 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-[var(--color-accent)] text-[var(--color-accent-fg)]">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path d="M12 2v20M2 12h20M12 2l-4 4m4-4 4 4m-4 16-4-4m4 4 4-4" />
          </svg>
        </span>
        <div className="flex flex-col leading-tight">
          <span className="font-[family-name:var(--font-display)] text-[15px] italic tracking-tight text-[var(--color-fg)]">
            motionwind
          </span>
          <span className="font-[family-name:var(--font-mono)] text-[8px] uppercase tracking-[0.18em] text-[var(--color-accent)]">
            Studio
          </span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2.5 no-scrollbar">
        {PLAYGROUND_SIDEBAR.gettingStarted.map((group) => (
          <SidebarGroupComponent
            key={group.title}
            group={group}
            pathname={pathname}
            onLinkClick={onCloseMobile}
          />
        ))}
        {PLAYGROUND_SIDEBAR.animations.map((group) => (
          <SidebarGroupComponent
            key={group.title}
            group={group}
            pathname={pathname}
            onLinkClick={onCloseMobile}
          />
        ))}
        {PLAYGROUND_SIDEBAR.reference.map((group) => (
          <SidebarGroupComponent
            key={group.title}
            group={group}
            pathname={pathname}
            onLinkClick={onCloseMobile}
          />
        ))}
      </nav>

      <div className="border-t border-[var(--color-border)] p-2.5">
        <Link
          href="https://www.motionwind.xyz/docs"
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--color-surface-elevated)] border border-[var(--color-border)] px-3 py-2 text-xs font-medium text-[var(--color-fg-muted)] transition-colors hover:border-[var(--color-accent)]/40 hover:text-[var(--color-accent)] no-underline"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
          <span>Read the Docs</span>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      <aside
        className="hidden md:flex h-screen flex-shrink-0 flex-col border-r border-[var(--color-border)] bg-[var(--color-bg)] overflow-hidden transition-[width] duration-200 ease-out"
        style={{ width: collapsed ? 0 : 260 }}
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
