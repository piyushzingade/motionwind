"use client";

import { useEffect, useRef, useState } from "react";
import {
  CaretDownIcon,
  CursorClickIcon,
  LayoutIcon,
  LinkIcon,
  SquaresFourIcon,
  TextTIcon,
} from "@phosphor-icons/react";
import { TAGS } from "@/lib/types";
import { ControlLabel } from "./control-label";

type Tag = (typeof TAGS)[number];

const TAG_META: Record<Tag, { icon: typeof CursorClickIcon; hint: string }> = {
  div: { icon: SquaresFourIcon, hint: "Generic block container" },
  button: { icon: CursorClickIcon, hint: "Pressable action" },
  span: { icon: TextTIcon, hint: "Inline text run" },
  a: { icon: LinkIcon, hint: "Hyperlink" },
  section: { icon: LayoutIcon, hint: "Thematic grouping" },
};

export function TagSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (tag: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(() =>
    Math.max(TAGS.indexOf(value as Tag), 0),
  );
  const rootRef = useRef<HTMLDivElement>(null);
  const SelectedIcon = TAG_META[(value as Tag) ?? "div"]!.icon;

  useEffect(() => {
    if (!open) return;
    const handler = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  function select(tag: Tag) {
    onChange(tag);
    setOpen(false);
  }

  function onTriggerKeyDown(event: React.KeyboardEvent) {
    if (
      event.key === "ArrowDown" ||
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();
      setActiveIndex(Math.max(TAGS.indexOf(value as Tag), 0));
      setOpen(true);
    }
  }

  function onListKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % TAGS.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (index - 1 + TAGS.length) % TAGS.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      select(TAGS[activeIndex]!);
    }
  }

  return (
    <div>
      <ControlLabel htmlFor="studio-element">Element</ControlLabel>
      <div ref={rootRef} className="relative">
        <button
          id="studio-element"
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
          onKeyDown={onTriggerKeyDown}
          className="control-press flex h-10 w-full cursor-pointer items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-2.5 text-xs text-[var(--color-fg)] outline-none transition-[border-color,box-shadow] duration-150 hover:border-[var(--color-accent)]/30 focus-visible:border-[var(--color-accent)]/40 focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/10"
        >
          <SelectedIcon
            size={14}
            className="shrink-0 text-[var(--color-accent)]"
          />
          <span className="font-[family-name:var(--font-mono)]">{value}</span>
          <CaretDownIcon
            size={13}
            className={`ml-auto shrink-0 text-[var(--color-fg-muted)] transition-transform duration-150 ${open ? "rotate-180" : ""}`}
          />
        </button>

        {open ? (
          <ul
            role="listbox"
            aria-label="Preview element"
            onKeyDown={onListKeyDown}
            className="absolute inset-x-0 top-[calc(100%+6px)] z-50 overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-1 shadow-[0_18px_55px_var(--color-shadow)]"
          >
            {(Object.keys(TAG_META) as Tag[]).map((tag, index) => {
              const { icon: Icon, hint } = TAG_META[tag];
              const isSelected = tag === value;
              const isActive = index === activeIndex;
              return (
                <li
                  key={tag}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => select(tag)}
                  onMouseMove={() => setActiveIndex(index)}
                  className={`flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 transition-[background-color] duration-100 ${
                    isActive
                      ? "bg-[var(--color-accent)]/[0.08]"
                      : "bg-transparent"
                  }`}
                >
                  <Icon
                    size={14}
                    weight={isSelected ? "fill" : "regular"}
                    className={`shrink-0 ${isSelected ? "text-[var(--color-accent)]" : "text-[var(--color-fg-muted)]"}`}
                  />
                  <span className="font-[family-name:var(--font-mono)] text-xs text-[var(--color-fg)]">
                    {tag}
                  </span>
                  <span className="ml-auto truncate text-[10px] text-[var(--color-fg-muted)]">
                    {hint}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
