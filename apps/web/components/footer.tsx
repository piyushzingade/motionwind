"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="py-10 sm:py-12 px-4 sm:px-6 shadow-[0_-1px_3px_rgba(0,0,0,0.03)] dark:shadow-[0_-1px_3px_rgba(0,0,0,0.15)]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="font-display italic text-2xl tracking-tight">
              motionwind
            </span>
            <span className="text-xs text-code-muted font-[family-name:var(--font-mono)]">
              v2.0.0
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-code-muted">
            <Link
              href="https://play.motionwind.xyz"
              className="hover:text-fg transition-colors"
            >
              Studio
            </Link>
            <a
              href="https://www.motionwind.xyz/docs/getting-started"
              className="hover:text-fg transition-colors"
            >
              Docs
            </a>
            <a
              href="https://github.com/piyushzingade/motionwind"
              className="hover:text-fg transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://www.npmjs.com/package/motionwind-react"
              className="hover:text-fg transition-colors"
            >
              npm
            </a>
          </div>
          <p className="text-xs text-code-muted font-[family-name:var(--font-mono)]">
            Built with Motion & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
