import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you are looking for does not exist.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-[var(--color-bg)]">
      <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-muted)] mb-4">
        404
      </span>
      <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl italic tracking-tight mb-4">
        Page not found
      </h1>
      <p className="text-[0.9375rem] text-[var(--color-fg-muted)] mb-8 max-w-md leading-relaxed">
        The documentation page you are looking for does not exist or has been
        moved.
      </p>
      <Link
        href="/docs"
        className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-[var(--color-accent-fg)] no-underline transition-colors hover:bg-[var(--color-accent-hover)]"
      >
        Back to Docs
      </Link>
    </div>
  );
}
