"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border-subtle py-10 sm:py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <span className="spec-index">MW — 002</span>
          <span className="spec-label">Motion as class names</span>
          <span className="spec-rule flex-1" aria-hidden="true" />
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="font-display italic text-2xl tracking-tight">
              motionwind
            </span>
            <span className="text-xs text-text-muted font-[family-name:var(--font-mono)]">
              v2.0.0
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-text-muted">
            <Link
              href="https://play.motionwind.xyz"
              className="hover:text-foreground transition-colors"
            >
              Studio
            </Link>
            <a
              href="https://www.motionwind.xyz/docs/getting-started"
              className="hover:text-foreground transition-colors"
            >
              Docs
            </a>
            <a
              href="https://github.com/piyushzingade/motionwind"
              className="hover:text-foreground transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://www.npmjs.com/package/motionwind-react"
              className="hover:text-foreground transition-colors"
            >
              npm
            </a>
          </div>
          <p className="text-xs text-text-muted font-[family-name:var(--font-mono)]">
            Built with Motion & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
