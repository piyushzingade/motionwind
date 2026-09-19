"use client";

import Link from "next/link";
import { ArrowUpRightIcon } from "@phosphor-icons/react";
import { MotionwindHorizontalLogo } from "@repo/ui/motionwind-logo";

export function Footer() {
  return (
    <footer className="relative overflow-hidden px-4 py-32 sm:px-6 md:py-40">
      <div className="relative mx-auto flex min-h-[520px] max-w-[1120px] flex-col items-center justify-center text-center">
        <MotionwindHorizontalLogo className="mb-12 h-6 w-28 text-fg" />
        <h2 className="max-w-5xl text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.06em] sm:text-6xl md:text-8xl">
          Ship motion that{" "}
          <em className="font-display font-normal italic text-accent">
            matters
          </em>
        </h2>
        <p className="mt-7 max-w-md text-pretty text-base leading-relaxed text-fg-muted sm:text-lg">
          Motion as utility classes, compiled for the frameworks you ship.
        </p>
        <Link
          href="https://www.motionwind.xyz/docs/getting-started"
          className="mt-9 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-md bg-fg px-5 py-3 text-sm font-semibold text-bg transition-[background-color,transform] duration-200 hover:bg-fg-muted active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Start building
          <ArrowUpRightIcon size={16} weight="bold" aria-hidden="true" />
        </Link>
        <nav
          aria-label="Footer navigation"
          className="mt-20 flex flex-wrap justify-center gap-x-10 gap-y-4 text-sm text-code-muted"
        >
          <Link
            href="https://play.motionwind.xyz"
            className="cursor-pointer underline decoration-border underline-offset-4 transition-colors hover:text-fg"
          >
            Studio
          </Link>
          <a
            href="https://www.motionwind.xyz/docs/getting-started"
            className="cursor-pointer underline decoration-border underline-offset-4 transition-colors hover:text-fg"
          >
            Docs
          </a>
          <a
            href="https://github.com/piyushzingade/motionwind"
            className="cursor-pointer underline decoration-border underline-offset-4 transition-colors hover:text-fg"
          >
            GitHub
          </a>
          <a
            href="https://www.npmjs.com/package/motionwind-react"
            className="cursor-pointer underline decoration-border underline-offset-4 transition-colors hover:text-fg"
          >
            npm
          </a>
        </nav>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-1/2 bottom-[-1.2rem] -translate-x-1/2 select-none whitespace-nowrap text-[clamp(5rem,18vw,15rem)] font-semibold leading-[0.72] tracking-[-0.1em] text-accent/[0.09]"
        >
          MOTIONWIND
        </div>
        <div className="absolute inset-x-0 bottom-0 flex justify-between text-left font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-code-muted">
          <span>Built with Motion and Tailwind CSS</span>
          <span>MIT licensed</span>
        </div>
      </div>
    </footer>
  );
}
