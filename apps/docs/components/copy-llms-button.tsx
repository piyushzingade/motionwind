"use client";

import { useState, useCallback } from "react";

export function CopyLlmsButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      const res = await fetch("/llms.txt");
      const text = await res.text();
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: open in new tab so user can manually copy
      window.open("/llms.txt", "_blank");
    }
  }, []);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <button
        onClick={handleCopy}
        className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-all duration-200"
        style={{
          background: copied ? "var(--color-accent)" : "var(--color-surface-elevated)",
          color: copied ? "var(--color-accent-fg)" : "var(--color-fg)",
          border: `1px solid ${copied ? "var(--color-accent)" : "var(--color-border)"}`,
        }}
      >
        {copied ? (
          <>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3.5 8.5 6.5 11.5 12.5 5.5" />
            </svg>
            Copied!
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
              <path d="M3.5 10.5h-1a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v1" />
            </svg>
            Copy to clipboard
          </>
        )}
      </button>
      <a
        href="/llms.txt"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm transition-colors duration-200"
        style={{ color: "var(--color-fg-muted)" }}
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 8.5v4a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 2 12.5v-7A1.5 1.5 0 0 1 3.5 4H8" />
          <path d="M10 2h4v4" />
          <path d="M7 9L14 2" />
        </svg>
        Open raw file
      </a>
    </div>
  );
}
