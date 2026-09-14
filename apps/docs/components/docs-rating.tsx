"use client";

import { useState } from "react";

type Rating = "Good" | "Bad";

export function DocsRating({ title, url }: { title: string; url: string }) {
  const [selected, setSelected] = useState<Rating | null>(null);
  const [pending, setPending] = useState(false);

  async function rate(value: Rating) {
    if (pending) return;
    setSelected(value);
    setPending(true);

    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "Docs Rating",
          message: `${value} rating for "${title}" at ${url}`,
        }),
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="docs-rating" aria-live="polite">
      <p className="docs-rating-title">Did you like the content?</p>
      <div className="docs-rating-actions" role="group" aria-label="Rate page">
        <button
          type="button"
          className="docs-rating-button"
          aria-pressed={selected === "Good"}
          disabled={pending}
          onClick={() => rate("Good")}
        >
          <ThumbIcon direction="up" />
          <span>Good</span>
        </button>
        <button
          type="button"
          className="docs-rating-button"
          aria-pressed={selected === "Bad"}
          disabled={pending}
          onClick={() => rate("Bad")}
        >
          <ThumbIcon direction="down" />
          <span>Bad</span>
        </button>
      </div>
      {selected ? (
        <span className="docs-rating-note">
          Thanks. It helps us improve this page.
        </span>
      ) : null}
    </div>
  );
}

function ThumbIcon({ direction }: { direction: "up" | "down" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={direction === "down" ? "rotate-180" : undefined}
    >
      <path
        d="M7 22H4.8A2.8 2.8 0 0 1 2 19.2v-7.4A2.8 2.8 0 0 1 4.8 9H7v13Z"
        fill="currentColor"
        opacity="0.52"
      />
      <path
        d="M7 10.2 11.7 3c.35-.54.96-.86 1.6-.86 1.12 0 2 .96 1.88 2.08L14.72 8H19a3 3 0 0 1 2.92 3.68l-1.48 6.4A5 5 0 0 1 15.57 22H7V10.2Z"
        fill="currentColor"
      />
    </svg>
  );
}
