"use client";

import Link from "next/link";
import { CaretDownIcon } from "@phosphor-icons/react";
import { MotionwindHorizontalLogo } from "@repo/ui/motionwind-logo";

export function Footer() {
  return (
    <footer className="px-4 pb-8 pt-16 sm:px-6 sm:pb-10 md:pt-20">
      <div className="mx-auto max-w-[1280px] border-t border-border-subtle pt-6">
        <div className="flex flex-col gap-8 md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-6">
          <Link
            href="/"
            aria-label="Motionwind home"
            className="inline-flex items-center gap-3 text-fg transition-opacity hover:opacity-70"
          >
            <MotionwindHorizontalLogo className="h-7 w-[126px]" />
            <span className="text-sm text-fg-muted">© 2026</span>
          </Link>
          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap items-center justify-start gap-x-6 gap-y-3 text-sm text-fg-muted md:justify-center"
          >
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
          </nav>
          <div className="inline-flex items-center gap-1 text-sm text-fg-muted md:justify-self-end">
            <span>EN</span>
            <CaretDownIcon size={14} aria-hidden="true" />
          </div>
        </div>
      </div>
    </footer>
  );
}
