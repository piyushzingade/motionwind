"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";

interface SearchItem {
  title: string;
  url: string;
  section: string;
}

const SEARCH_ITEMS: SearchItem[] = [
  { title: "Introduction", url: "/docs", section: "Getting Started" },
  {
    title: "Getting Started",
    url: "/docs/getting-started",
    section: "Getting Started",
  },
  {
    title: "Installation",
    url: "/docs/installation",
    section: "Getting Started",
  },
  { title: "Syntax", url: "/docs/syntax", section: "Getting Started" },
  {
    title: "Basic Properties",
    url: "/docs/animations/basic-properties",
    section: "Animations",
  },
  {
    title: "Transforms",
    url: "/docs/animations/transforms",
    section: "Animations",
  },
  {
    title: "Gestures",
    url: "/docs/animations/gestures",
    section: "Animations",
  },
  { title: "Scroll", url: "/docs/animations/scroll", section: "Animations" },
  {
    title: "Enter & Exit",
    url: "/docs/animations/enter-exit",
    section: "Animations",
  },
  { title: "Physics", url: "/docs/animations/physics", section: "Animations" },
  {
    title: "Keyframes",
    url: "/docs/animations/keyframes",
    section: "Animations",
  },
  { title: "Layout", url: "/docs/animations/layout", section: "Animations" },
  {
    title: "Variants",
    url: "/docs/animations/variants",
    section: "Animations",
  },
  { title: "SVG", url: "/docs/animations/svg", section: "Animations" },
  { title: "Drag", url: "/docs/animations/drag", section: "Animations" },
  {
    title: "Advanced Effects",
    url: "/docs/animations/advanced-effects",
    section: "Animations",
  },
  {
    title: "Scroll-Linked",
    url: "/docs/animations/scroll-linked",
    section: "Animations",
  },
  { title: "Filters", url: "/docs/animations/filters", section: "Animations" },
  { title: "API", url: "/docs/api", section: "Reference" },
  {
    title: "Framework Setup",
    url: "/docs/framework-setup",
    section: "Reference",
  },
  { title: "Frameworks", url: "/docs/frameworks", section: "Reference" },
  { title: "React", url: "/docs/frameworks/react", section: "Reference" },
  {
    title: "React Native",
    url: "/docs/frameworks/react-native",
    section: "Reference",
  },
  { title: "Vue", url: "/docs/frameworks/vue", section: "Reference" },
  { title: "Vanilla", url: "/docs/frameworks/vanilla", section: "Reference" },
  { title: "LLM Documentation", url: "/docs/llms", section: "Reference" },
  { title: "Configuration", url: "/docs/configuration", section: "Tooling" },
  { title: "CLI", url: "/docs/tooling/cli", section: "Tooling" },
  { title: "ESLint", url: "/docs/tooling/eslint", section: "Tooling" },
  { title: "MCP", url: "/docs/tooling/mcp", section: "Tooling" },
  { title: "Prettier", url: "/docs/tooling/prettier", section: "Tooling" },
  { title: "Playground", url: "/docs/tooling/playground", section: "Tooling" },
  { title: "Migrate", url: "/docs/tooling/migrate", section: "Tooling" },
  { title: "Compatibility", url: "/docs/compatibility", section: "Reference" },
  { title: "Community", url: "/docs/community", section: "Reference" },
  { title: "Extensions", url: "/docs/extensions", section: "Reference" },
  {
    title: "React Native Overview",
    url: "/docs/react-native",
    section: "React Native",
  },
  {
    title: "RN Installation",
    url: "/docs/react-native/installation",
    section: "React Native",
  },
  {
    title: "RN Components",
    url: "/docs/react-native/components",
    section: "React Native",
  },
  {
    title: "RN Animations",
    url: "/docs/react-native/animations",
    section: "React Native",
  },
  {
    title: "RN Gestures",
    url: "/docs/react-native/gestures",
    section: "React Native",
  },
  {
    title: "RN Springs & Easing",
    url: "/docs/react-native/springs-and-easing",
    section: "React Native",
  },
  {
    title: "RN Scroll Animations",
    url: "/docs/react-native/scroll-animations",
    section: "React Native",
  },
  { title: "RN Drag", url: "/docs/react-native/drag", section: "React Native" },
  {
    title: "RN Hooks",
    url: "/docs/react-native/hooks",
    section: "React Native",
  },
  {
    title: "RN API Reference",
    url: "/docs/react-native/api-reference",
    section: "React Native",
  },
  { title: "Syntax", url: "/docs/syntax", section: "Getting Started" },
  { title: "v2", url: "/docs/v2", section: "Reference" },
];

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = query.trim()
    ? SEARCH_ITEMS.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.section.toLowerCase().includes(query.toLowerCase()),
      )
    : SEARCH_ITEMS;

  const grouped = filtered.reduce(
    (acc, item) => {
      const arr = acc[item.section];
      if (arr) {
        arr.push(item);
      } else {
        acc[item.section] = [item];
      }
      return acc;
    },
    {} as Record<string, SearchItem[]>,
  );

  const flatFiltered = Object.values(grouped).flat();

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, flatFiltered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter" && flatFiltered[selectedIndex]) {
        e.preventDefault();
        window.location.href = flatFiltered[selectedIndex].url;
        setOpen(false);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    },
    [flatFiltered, selectedIndex],
  );

  if (!open) return null;

  let itemIndex = -1;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      <div className="relative w-full max-w-lg mx-4 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl shadow-2xl overflow-hidden">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 border-b border-[var(--color-border)]">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0 text-[var(--color-fg-muted)]"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search documentation..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 h-12 bg-transparent text-[var(--color-fg)] placeholder:text-[var(--color-fg-muted)]/50 outline-none text-sm"
          />
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-[var(--color-fg-muted)]/60 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-80 overflow-y-auto p-2">
          {flatFiltered.length === 0 ? (
            <div className="py-8 text-center text-sm text-[var(--color-fg-muted)]/60">
              No results found for &quot;{query}&quot;
            </div>
          ) : (
            Object.entries(grouped).map(([section, items]) => (
              <div key={section} className="mb-2">
                <div className="px-2 py-1.5 text-[10px] font-mono uppercase tracking-wider text-[var(--color-fg-muted)]/50">
                  {section}
                </div>
                {items.map((item) => {
                  itemIndex++;
                  const isSelected = itemIndex === selectedIndex;
                  return (
                    <Link
                      key={item.url}
                      href={item.url}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors ${
                        isSelected
                          ? "bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                          : "text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] hover:bg-[var(--color-surface-elevated)]"
                      }`}
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
                        className="shrink-0 opacity-40"
                      >
                        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                        <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                      </svg>
                      <span className="truncate">{item.title}</span>
                    </Link>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 px-4 py-2 border-t border-[var(--color-border)] text-[10px] text-[var(--color-fg-muted)]/50">
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded font-mono">
              ↑
            </kbd>
            <kbd className="px-1 py-0.5 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded font-mono">
              ↓
            </kbd>
            navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded font-mono">
              ↵
            </kbd>
            open
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded font-mono">
              esc
            </kbd>
            close
          </span>
        </div>
      </div>
    </div>
  );
}
