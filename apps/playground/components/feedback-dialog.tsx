"use client";

import { useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  BugIcon,
  CheckIcon,
  ChatCircleDotsIcon,
  CircleNotchIcon,
  LightbulbIcon,
  PaperPlaneTiltIcon,
  QuestionIcon,
  XIcon,
} from "@phosphor-icons/react";
import {
  FEEDBACK_EMAIL_MAX,
  FEEDBACK_MESSAGE_MAX,
  FEEDBACK_TYPES,
  type FeedbackType,
} from "@/lib/feedback";

const typeIcons = {
  "Bug Report": BugIcon,
  "Feature Request": LightbulbIcon,
  Question: QuestionIcon,
  Other: ChatCircleDotsIcon,
};

type SubmitStatus = "idle" | "sending" | "sent" | "error";

export function FeedbackDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [type, setType] = useState<FeedbackType>("Feature Request");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const sendingRef = useRef(false);
  const closeTimer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
    },
    [],
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!message.trim() || sendingRef.current) return;

    sendingRef.current = true;
    setStatus("sending");

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          message: message.trim(),
          email: email.trim() || undefined,
        }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok)
        throw new Error(result.error || "Unable to send feedback");

      setStatus("sent");
      closeTimer.current = window.setTimeout(() => {
        onOpenChange(false);
      }, 1200);
    } catch {
      setStatus("error");
    } finally {
      sendingRef.current = false;
    }
  }

  function resetForm() {
    setMessage("");
    setEmail("");
    setType("Feature Request");
    setStatus("idle");
    sendingRef.current = false;
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) resetForm();
    else setStatus("idle");
    onOpenChange(nextOpen);
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="feedback-overlay fixed inset-0 z-[300] bg-black/60 backdrop-blur-[4px]" />
        <Dialog.Content
          aria-describedby="feedback-description"
          className="feedback-content fixed left-1/2 top-1/2 z-[400] w-[calc(100%-2rem)] max-w-[430px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] shadow-[0_24px_80px_-20px_rgba(0,0,0,0.55)] focus:outline-none"
        >
          <form onSubmit={handleSubmit}>
            <div className="flex items-start justify-between border-b border-dashed border-[var(--color-border)] px-5 py-4">
              <div>
                <Dialog.Title className="flex items-center gap-2 text-sm font-semibold text-[var(--color-fg)]">
                  <ChatCircleDotsIcon
                    size={17}
                    weight="fill"
                    className="text-[var(--color-accent)]"
                  />
                  Send feedback
                </Dialog.Title>
                <Dialog.Description
                  id="feedback-description"
                  className="mt-1 text-xs text-[var(--color-fg-muted)]"
                >
                  Help us improve the Motionwind playground.
                </Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <button
                  type="button"
                  aria-label="Close feedback dialog"
                  className="control-press -mr-1 inline-flex h-9 w-9 items-center justify-center rounded-md text-[var(--color-fg-muted)] transition-[color,background-color] duration-150 hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/45"
                >
                  <XIcon size={16} />
                </button>
              </Dialog.Close>
            </div>

            <div className="space-y-4 px-5 py-4">
              <fieldset>
                <legend className="mb-2 font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.1em] text-[var(--color-fg-muted)]">
                  Category
                </legend>
                <div className="grid grid-cols-2 gap-2">
                  {FEEDBACK_TYPES.map((item) => {
                    const Icon = typeIcons[item.value];
                    const active = type === item.value;
                    return (
                      <button
                        key={item.value}
                        type="button"
                        aria-pressed={active}
                        onClick={() => setType(item.value)}
                        className="control-press flex h-10 items-center gap-2 rounded-lg border border-[var(--color-border)] px-3 text-left text-xs text-[var(--color-fg-muted)] transition-[border-color,color,background-color] duration-150 hover:text-[var(--color-fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/45 aria-pressed:border-[var(--color-accent)]/35 aria-pressed:bg-[var(--color-accent)]/[0.07] aria-pressed:text-[var(--color-accent)]"
                      >
                        <Icon size={15} weight={active ? "fill" : "regular"} />
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label
                    htmlFor="feedback-message"
                    className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.1em] text-[var(--color-fg-muted)]"
                  >
                    Message
                  </label>
                  <span className="font-[family-name:var(--font-mono)] text-[9px] tabular-nums text-[var(--color-fg-muted)]">
                    {message.length}/{FEEDBACK_MESSAGE_MAX}
                  </span>
                </div>
                <textarea
                  id="feedback-message"
                  autoFocus
                  required
                  rows={4}
                  maxLength={FEEDBACK_MESSAGE_MAX}
                  value={message}
                  onChange={(event) => {
                    setMessage(event.target.value);
                    if (status === "error") setStatus("idle");
                  }}
                  placeholder="Describe what happened or what you would like to see."
                  className="w-full resize-none rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-[13px] leading-relaxed text-[var(--color-fg)] outline-none transition-[border-color,box-shadow,background-color] duration-150 placeholder:text-[var(--color-fg-muted)]/65 focus:border-[var(--color-accent)]/40 focus:bg-[var(--color-surface-elevated)] focus:ring-2 focus:ring-[var(--color-accent)]/10"
                />
              </div>

              <div>
                <label
                  htmlFor="feedback-email"
                  className="mb-2 block font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.1em] text-[var(--color-fg-muted)]"
                >
                  Email{" "}
                  <span className="normal-case tracking-normal">
                    (optional)
                  </span>
                </label>
                <input
                  id="feedback-email"
                  type="email"
                  maxLength={FEEDBACK_EMAIL_MAX}
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (status === "error") setStatus("idle");
                  }}
                  placeholder="you@example.com"
                  className="h-10 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-[13px] text-[var(--color-fg)] outline-none transition-[border-color,box-shadow,background-color] duration-150 placeholder:text-[var(--color-fg-muted)]/65 focus:border-[var(--color-accent)]/40 focus:bg-[var(--color-surface-elevated)] focus:ring-2 focus:ring-[var(--color-accent)]/10"
                />
              </div>

              <p
                role="alert"
                className={`min-h-4 text-xs ${
                  status === "error"
                    ? "text-red-600 dark:text-red-400"
                    : status === "sent"
                      ? "text-[var(--color-accent)]"
                      : "text-transparent"
                }`}
              >
                {status === "error"
                  ? "Feedback could not be sent. Your message is still here."
                  : status === "sent"
                    ? "Thanks. Your feedback was sent."
                    : "Status"}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-dashed border-[var(--color-border)] px-5 py-3">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="control-press h-9 rounded-md px-3 text-xs font-medium text-[var(--color-fg-muted)] transition-colors duration-150 hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/45 disabled:pointer-events-none disabled:opacity-40"
                >
                  Cancel
                </button>
              </Dialog.Close>
              <button
                type="submit"
                disabled={
                  !message.trim() || status === "sending" || status === "sent"
                }
                className="control-press inline-flex h-9 min-w-[116px] items-center justify-center gap-2 rounded-md bg-[var(--color-accent)] px-4 text-xs font-semibold text-[var(--color-accent-fg)] transition-colors duration-150 hover:bg-[var(--color-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] disabled:pointer-events-none disabled:opacity-40"
              >
                {status === "sending" ? (
                  <>
                    <span className="feedback-spinner inline-flex">
                      <CircleNotchIcon size={15} weight="bold" />
                    </span>
                    Sending
                  </>
                ) : status === "sent" ? (
                  <>
                    <CheckIcon size={15} weight="bold" />
                    Sent
                  </>
                ) : (
                  <>
                    <PaperPlaneTiltIcon size={15} weight="fill" />
                    Send feedback
                  </>
                )}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
