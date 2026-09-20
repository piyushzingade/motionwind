"use client";

import Link from "next/link";
import { MotionwindLogo } from "@repo/ui/motionwind-logo";
import { LegalLinks } from "@repo/ui/legal-links";
import { DownloadCTA } from "./download-cta";

export function Footer() {
  return (
    <footer className="px-4 pb-8 pt-10 sm:px-6 md:px-8 sm:pb-10 md:pt-14">
      <div className="mx-auto max-w-[1120px]">
        <DownloadCTA className="mx-auto mb-12" />
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between md:gap-10">
          <Link
            href="/"
            aria-label="Motionwind home"
            className="inline-flex items-center gap-3 text-fg transition-opacity hover:opacity-70"
          >
            <MotionwindLogo className="h-8 w-11 text-accent" />
            <span className="text-sm text-fg-muted">© 2026</span>
          </Link>
          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap items-center justify-start gap-x-6 gap-y-3 text-sm text-fg-muted md:whitespace-nowrap"
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
              NPM
            </a>
            <a
              href="mailto:piyushzingade@gmail.com"
              className="cursor-pointer transition-colors hover:text-fg"
            >
              Contact
            </a>
          </nav>
          <LegalLinks className="text-xs text-fg-muted md:whitespace-nowrap" />
        </div>
      </div>
    </footer>
  );
}
