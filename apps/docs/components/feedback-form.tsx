"use client";

import { useState, useRef, useEffect, useEffectEvent } from "react";
import { m } from "motion/react";
import { FEEDBACK_TYPES } from "../lib/feedback-types";
import { FeedbackSubmitButton } from "./feedback-submit-button";

export function FeedbackForm({
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
    "idle",
  );
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setStatus("idle");
  }

  useEffect(() => {
    if (!open) return;
    const id = setTimeout(() => textareaRef.current?.focus(), 150);
    return () => clearTimeout(id);
  }, [open]);

  const onEscape = useEffectEvent(() => onClose());
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onEscape();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- onEscape is a useEffectEvent; Effect Events must not be listed as effect dependencies
  }, [open]);

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

  return (
    <m.div
      initial={{ opacity: 0, scale: 0.96, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: 12 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="fixed left-1/2 top-1/2 z-[101] w-[calc(100%-2rem)] max-w-[420px] -translate-x-1/2 -translate-y-1/2"
    >
      <div className="overflow-hidden rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-bg)] shadow-[0_24px_80px_-12px_rgba(0,0,0,0.5)]">
        <div className="h-[1px] bg-gradient-to-r from-transparent via-[var(--color-accent)]/40 to-transparent" />

        <form onSubmit={handleSubmit}>
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
              aria-label="Close feedback dialog"
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
                      className={`group relative flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-all duration-150 ${
                        active
                          ? "border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/[0.08] text-[var(--color-accent)]"
                          : "border border-[var(--color-border)] text-[var(--color-fg-muted)] hover:border-[var(--color-border-subtle)] hover:text-[var(--color-fg)]"
                      }`}
                    >
                      <span
                        className={`transition-colors ${active ? "text-[var(--color-accent)]" : "text-[var(--color-fg-muted)]/50 group-hover:text-[var(--color-fg-muted)]"}`}
                      >
                        {t.icon}
                      </span>
                      {t.label}
                      {active && (
                        <m.span
                          layoutId="feedback-type-dot"
                          className="absolute -top-px -right-px h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]"
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 28,
                          }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="flex items-baseline justify-between mb-2">
                <p className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.15em] text-[var(--color-fg-muted)]/60">
                  Message
                </p>
                <span
                  className={`font-[family-name:var(--font-mono)] text-[9px] tabular-nums transition-colors ${charCount > 0 ? "text-[var(--color-fg-muted)]/50" : "text-transparent"}`}
                >
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
                className="w-full resize-none rounded-lg border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-[13px] leading-relaxed text-[var(--color-fg)] placeholder:text-[var(--color-fg-muted)]/30 transition-colors duration-150 focus:border-[var(--color-accent)]/30 focus:bg-[var(--color-surface-elevated)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]/10"
              />
            </div>

            <div>
              <p className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.15em] text-[var(--color-fg-muted)]/60 mb-2">
                Email{" "}
                <span className="normal-case tracking-normal text-[var(--color-fg-muted)]/30">
                  — optional
                </span>
              </p>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-[13px] text-[var(--color-fg)] placeholder:text-[var(--color-fg-muted)]/30 transition-colors duration-150 focus:border-[var(--color-accent)]/30 focus:bg-[var(--color-surface-elevated)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]/10"
              />
            </div>
          </div>

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
              <FeedbackSubmitButton
                status={status}
                disabled={
                  status === "sending" || status === "sent" || !message.trim()
                }
              />
            </div>
          </div>
        </form>
      </div>
    </m.div>
  );
}
