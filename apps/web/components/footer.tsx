"use client";

import Link from "next/link";
import { MotionwindHorizontalLogo } from "@repo/ui/motionwind-logo";

export function Footer() {
  return (
    <footer className="px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-[1120px]">
        <div className="relative overflow-hidden rounded-[2rem] border border-accent/20 bg-surface-elevated px-7 pb-7 pt-8 shadow-[0_28px_100px_-64px_var(--color-shadow)] sm:px-10 sm:pb-9 sm:pt-10 lg:px-14 lg:pb-10 lg:pt-12">
          <div className="relative z-10 flex flex-col gap-8">
            <div className="flex flex-col gap-7 md:flex-row md:items-start md:justify-between">
              <div className="max-w-sm">
                <MotionwindHorizontalLogo className="h-8 w-40 text-fg" />
                <p className="mt-4 text-sm leading-relaxed text-fg-muted">
                  Motion as utility classes, compiled for the frameworks you
                  ship.
                </p>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-code-muted">
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
            <Link
              href="https://www.motionwind.xyz/docs/getting-started"
              className="inline-flex w-fit cursor-pointer items-center rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-accent-fg transition-[background-color,transform] duration-200 hover:bg-accent-hover active:translate-y-px"
            >
              Start building
            </Link>
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none -mb-3 mt-14 select-none whitespace-nowrap text-[clamp(5rem,15vw,12rem)] font-semibold leading-[0.72] tracking-[-0.09em] text-fg/[0.055]"
          >
            MOTIONWIND
          </div>
          <div className="relative z-10 mt-8 flex flex-col gap-3 border-t border-border-subtle pt-5 text-xs text-code-muted sm:flex-row sm:items-center sm:justify-between">
            <span>Built with Motion and Tailwind CSS</span>
            <span className="font-[family-name:var(--font-mono)]">
              MIT licensed
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
