"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";

const FEEDBACK_TYPES = [
  {
    label: "Bug",
    value: "Bug Report",
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  },
  {
    label: "Feature",
    value: "Feature Request",
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    label: "Question",
    value: "Question",
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  {
    label: "Other",
    value: "Other",
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
];

export function FeedbackDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [type, setType] = useState("Feature Request");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) {
      setStatus("idle");
      setTimeout(() => textareaRef.current?.focus(), 150);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, message, email: email || undefined }),
      });

      if (!res.ok) throw new Error();
      setStatus("sent");
      setTimeout(() => {
        onClose();
        setMessage("");
        setEmail("");
        setType("Feature Request");
      }, 1800);
    } catch {
      setStatus("error");
    }
  }

  const charCount = message.length;
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-[6px]"
            onClick={onClose}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{
              duration: 0.25,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="fixed left-1/2 top-1/2 z-[101] w-[calc(100%-2rem)] max-w-[420px] -translate-x-1/2 -translate-y-1/2"
          >
            <div className="overflow-hidden rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-bg)] shadow-[0_24px_80px_-12px_rgba(0,0,0,0.5)]">
              {/* Accent line */}
              <div className="h-[1px] bg-gradient-to-r from-transparent via-[var(--color-accent)]/40 to-transparent" />

              <form onSubmit={handleSubmit}>
                {/* Header */}
                <div className="flex items-center justify-between px-5 pt-4 pb-0">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md border border-dashed border-[var(--color-accent)]/20 bg-[var(--color-accent)]/[0.06]">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--color-accent)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                    </div>
                    <h2 className="font-[family-name:var(--font-display)] text-[15px] italic tracking-tight text-[var(--color-fg)]">
                      Send Feedback
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex h-6 w-6 items-center justify-center rounded-md text-[var(--color-fg-muted)]/60 transition-all hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-fg)]"
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>

                <div className="px-5 pt-4 pb-1 space-y-4">
                  {/* Type pills */}
                  <div>
                    <p className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.15em] text-[var(--color-fg-muted)]/60 mb-2">
                      Category
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {FEEDBACK_TYPES.map((t) => {
                        const active = type === t.value;
                        return (
                          <button
                            key={t.value}
                            type="button"
                            onClick={() => setType(t.value)}
                            className={`
                              group relative flex items-center gap-1.5 rounded-lg px-2.5 py-1.5
                              text-[11px] font-medium transition-all duration-150
                              ${
                                active
                                  ? "border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/[0.08] text-[var(--color-accent)]"
                                  : "border border-[var(--color-border)] text-[var(--color-fg-muted)] hover:border-[var(--color-border-subtle)] hover:text-[var(--color-fg)]"
                              }
                            `}
                          >
                            <span className={`transition-colors ${active ? "text-[var(--color-accent)]" : "text-[var(--color-fg-muted)]/50 group-hover:text-[var(--color-fg-muted)]"}`}>
                              {t.icon}
                            </span>
                            {t.label}
                            {active && (
                              <motion.span
                                layoutId="feedback-type-dot"
                                className="absolute -top-px -right-px h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]"
                                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Message textarea */}
                  <div>
                    <div className="flex items-baseline justify-between mb-2">
                      <p className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.15em] text-[var(--color-fg-muted)]/60">
                        Message
                      </p>
                      <span className={`font-[family-name:var(--font-mono)] text-[9px] tabular-nums transition-colors ${charCount > 0 ? "text-[var(--color-fg-muted)]/50" : "text-transparent"}`}>
                        {charCount}
                      </span>
                    </div>
                    <textarea
                      ref={textareaRef}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="What's on your mind?"
                      required
                      rows={3}
                      className="
                        w-full resize-none rounded-lg border border-dashed border-[var(--color-border)]
                        bg-[var(--color-surface)] px-3 py-2.5
                        text-[13px] leading-relaxed text-[var(--color-fg)]
                        placeholder:text-[var(--color-fg-muted)]/30
                        transition-colors duration-150
                        focus:border-[var(--color-accent)]/30 focus:bg-[var(--color-surface-elevated)]
                        focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]/10
                      "
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <p className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.15em] text-[var(--color-fg-muted)]/60 mb-2">
                      Email <span className="normal-case tracking-normal text-[var(--color-fg-muted)]/30">— optional</span>
                    </p>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="
                        w-full rounded-lg border border-dashed border-[var(--color-border)]
                        bg-[var(--color-surface)] px-3 py-2
                        text-[13px] text-[var(--color-fg)]
                        placeholder:text-[var(--color-fg-muted)]/30
                        transition-colors duration-150
                        focus:border-[var(--color-accent)]/30 focus:bg-[var(--color-surface-elevated)]
                        focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]/10
                      "
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-5 py-3.5 mt-1">
                  <p className="font-[family-name:var(--font-mono)] text-[9px] text-[var(--color-fg-muted)]/30">
                    esc to close
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="rounded-lg px-3 py-1.5 text-[11px] font-medium text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={status === "sending" || status === "sent" || !message.trim()}
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
                          <motion.span
                            key="sending"
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            className="flex items-center gap-1.5"
                          >
                            <motion.span
                              animate={{ rotate: 360 }}
                              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                              className="inline-block"
                            >
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                              </svg>
                            </motion.span>
                            Sending
                          </motion.span>
                        ) : status === "sent" ? (
                          <motion.span
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
                          </motion.span>
                        ) : status === "error" ? (
                          <motion.span
                            key="error"
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                          >
                            Retry
                          </motion.span>
                        ) : (
                          <motion.span
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
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
