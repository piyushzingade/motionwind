"use client";

import Link from "next/link";
import { MotionwindLogo } from "@repo/ui/motionwind-logo";

export function Footer() {
  return (
    <footer className="border-t border-dashed border-border px-4 py-14 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-[1120px]">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-3 text-fg">
              <MotionwindLogo className="size-7 text-accent" />
              <span className="font-display text-2xl italic tracking-tight">
                motionwind
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-fg-muted">
              Motion as utility classes, compiled for the frameworks you ship.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-code-muted">
            <Link
              href="https://play.motionwind.xyz"
              className="cursor-pointer transition-colors hover:text-fg"
            >
              Studio
            </Link>
            <a
              href="https://www.motionwind.xyz/docs/getting-started"
              className="cursor-pointer transition-colors hover:text-fg"
            >
              Docs
            </a>
            <a
              href="https://github.com/piyushzingade/motionwind"
              className="cursor-pointer transition-colors hover:text-fg"
            >
              GitHub
            </a>
            <a
              href="https://www.npmjs.com/package/motionwind-react"
              className="cursor-pointer transition-colors hover:text-fg"
            >
              npm
            </a>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-border-subtle pt-5 text-xs text-code-muted sm:flex-row sm:items-center sm:justify-between">
          <span>Built with Motion and Tailwind CSS</span>
          <span className="font-[family-name:var(--font-mono)]">
            MIT licensed
          </span>
        </div>
      </div>
    </footer>
  );
}
