"use client";

import { useEffect, useEffectEvent, useState } from "react";
import Link from "next/link";
import { MotionwindHorizontalLogo } from "@repo/ui/motionwind-logo";
import { usePathname } from "next/navigation";
import { m, AnimatePresence } from "motion/react";
import { WEB_SIDEBAR, RN_SIDEBAR, type Platform } from "./sidebar-items";
import { FeedbackDialog } from "./feedback-dialog";
import { LegalLinks } from "@repo/ui/legal-links";

const easeOutQuint: [number, number, number, number] = [0.23, 1, 0.32, 1];

/* ── Sidebar Group ── */

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
                  <m.span
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

/* ── Main Sidebar ── */

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
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const onClose = useEffectEvent(() => onCloseMobile());

  useEffect(() => {
    if (!mobileOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [mobileOpen]); // eslint-disable-line react-hooks/exhaustive-deps -- onClose is an Effect Event, intentionally excluded

  const platform: Platform = pathname.startsWith("/docs/react-native")
    ? "react-native"
    : "web";

  const items = platform === "react-native" ? RN_SIDEBAR : WEB_SIDEBAR;

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex h-14 items-center border-b border-dashed border-[var(--color-border)] px-4">
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <MotionwindHorizontalLogo className="h-10 w-44 shrink-0 text-[var(--color-fg)]" />
          <span className="font-[family-name:var(--font-mono)] text-[9px] text-[var(--color-fg-muted)]/50 ml-0.5">
            v2.2
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2 px-2 no-scrollbar">
        {items.gettingStarted.map((group) => (
          <SidebarGroup
            key={group.title}
            title={group.title}
            items={group.items}
            pathname={pathname}
            onLinkClick={onCloseMobile}
          />
        ))}
        {items.animations.map((group) => (
          <SidebarGroup
            key={group.title}
            title={group.title}
            items={group.items}
            pathname={pathname}
            onLinkClick={onCloseMobile}
          />
        ))}
        {items.reference.map((group) => (
          <SidebarGroup
            key={group.title}
            title={group.title}
            items={group.items}
            pathname={pathname}
            onLinkClick={onCloseMobile}
          />
        ))}
        <SidebarGroup
          title="Frameworks"
          items={[
            { title: "Overview", url: "/docs/frameworks" },
            { title: "React", url: "/docs/frameworks/react" },
            { title: "React Native", url: "/docs/frameworks/react-native" },
            { title: "Vue", url: "/docs/frameworks/vue" },
            { title: "Vanilla", url: "/docs/frameworks/vanilla" },
          ]}
          pathname={pathname}
          onLinkClick={onCloseMobile}
        />
      </nav>

      {/* Footer */}
      <div className="border-t border-dashed border-[var(--color-border)] p-3">
        <button
          type="button"
          onClick={() => setFeedbackOpen(true)}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-[var(--color-border)] px-3 py-2 text-xs text-[var(--color-fg-muted)] transition-colors hover:border-[var(--color-accent)]/30 hover:text-[var(--color-fg)]"
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
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span>Send Feedback</span>
        </button>
        <FeedbackDialog
          open={feedbackOpen}
          onClose={() => setFeedbackOpen(false)}
        />
        <LegalLinks className="mt-3 justify-center text-[10px] text-[var(--color-fg-muted)]" />
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar — collapsible via CSS transition */}
      <aside
        id="docs-sidebar"
        aria-hidden={desktopCollapsed}
        inert={desktopCollapsed}
        style={{
          width: desktopCollapsed ? 0 : 260,
          transition: "width 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
        className={`box-border max-md:hidden md:flex h-screen flex-shrink-0 flex-col border-dashed border-[var(--color-border)] bg-[var(--color-bg)] overflow-hidden ${
          desktopCollapsed ? "border-r-0" : "border-r"
        }`}
      >
        <div className="w-[260px] h-full">{sidebarContent}</div>
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <m.div
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
            <m.aside
              id="docs-sidebar-mobile"
              aria-label="Documentation navigation"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.3, ease: easeOutQuint }}
              className="fixed left-0 top-0 z-50 h-screen w-[280px] bg-[var(--color-bg)] border-r border-[var(--color-border)] md:hidden"
            >
              <button
                type="button"
                onClick={onCloseMobile}
                aria-label="Close navigation sidebar"
                className="absolute right-3 top-3 z-10 inline-flex size-8 cursor-pointer items-center justify-center rounded-lg text-[var(--color-fg-muted)] transition-colors hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-fg)]"
              >
                <span aria-hidden="true" className="text-lg leading-none">
                  ×
                </span>
              </button>
              {sidebarContent}
            </m.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
