"use client";

import { AnimatePresence, m } from "motion/react";

export function FeedbackSubmitButton({
  status,
  disabled,
}: {
  status: "idle" | "sending" | "sent" | "error";
  disabled: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="
        relative overflow-hidden rounded-lg border border-[var(--color-accent)]/30
        bg-[var(--color-accent)]/[0.1] px-4 py-1.5
        text-[11px] font-medium text-[var(--color-accent)]
        transition-all duration-150
        hover:bg-[var(--color-accent)]/[0.16] hover:border-[var(--color-accent)]/50
        disabled:opacity-40 disabled:pointer-events-none
      "
    >
      <AnimatePresence mode="wait">
        {status === "sending" ? (
          <m.span
            key="sending"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="flex items-center gap-1.5"
          >
            <m.span
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              className="inline-block"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            </m.span>
            Sending
          </m.span>
        ) : status === "sent" ? (
          <m.span
            key="sent"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="flex items-center gap-1.5"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Sent!
          </m.span>
        ) : status === "error" ? (
          <m.span
            key="error"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
          >
            Retry
          </m.span>
        ) : (
          <m.span
            key="idle"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="flex items-center gap-1.5"
          >
            Send
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </m.span>
        )}
      </AnimatePresence>
    </button>
  );
}
