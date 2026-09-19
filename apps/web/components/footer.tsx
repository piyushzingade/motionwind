"use client";

import Link from "next/link";
import { ArrowUpRightIcon } from "@phosphor-icons/react";

export function Footer() {
  return (
    <footer className="px-4 pb-10 pt-20 sm:px-6 sm:pb-12 md:pt-24">
      <div className="mx-auto max-w-[1120px]">
        <div
          className="flex min-h-[360px] flex-col items-center justify-center rounded-[28px] border border-accent/20 px-6 py-20 text-center sm:min-h-[420px] sm:px-10 sm:py-24 md:py-28"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--color-accent) 12%, var(--color-bg))",
            backgroundImage:
              "radial-gradient(color-mix(in srgb, var(--color-accent) 22%, transparent) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        >
          <h2 className="max-w-3xl text-balance text-5xl font-semibold leading-[0.96] tracking-[-0.06em] sm:text-6xl md:text-7xl lg:text-[clamp(4rem,7vw,7rem)]">
            Ship motion that <span className="text-accent">matters</span>
          </h2>
          <p className="mt-6 max-w-md text-pretty text-base leading-relaxed text-fg-muted sm:text-lg">
            Motion as utility classes, compiled for the frameworks you ship.
          </p>
          <Link
            href="https://www.motionwind.xyz/docs/getting-started"
            className="mt-8 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-md bg-accent px-5 py-3 text-sm font-semibold text-accent-fg transition-[background-color,transform] duration-200 hover:bg-accent-hover active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Start building
            <ArrowUpRightIcon size={16} weight="bold" aria-hidden="true" />
          </Link>
        </div>
        <nav
          aria-label="Footer navigation"
          className="flex flex-wrap justify-center gap-x-8 gap-y-4 border-t border-border-subtle pt-6 text-sm text-code-muted sm:gap-x-10"
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
      </div>
    </footer>
  );
}
