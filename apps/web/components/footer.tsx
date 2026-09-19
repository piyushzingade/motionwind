"use client";

import Link from "next/link";
import { ArrowUpRightIcon } from "@phosphor-icons/react";
import { MotionwindFluidText } from "./motionwind-fluid-text";

export function Footer() {
  return (
    <footer className="relative overflow-hidden px-4 pb-0 pt-32 sm:px-6 md:pt-40">
      <div className="relative mx-auto flex min-h-[700px] max-w-[1120px] flex-col items-center justify-start pt-20 text-center sm:pt-28 md:min-h-[760px] md:pt-32">
        <h2 className="relative z-10 max-w-5xl text-balance text-6xl font-semibold leading-[0.94] tracking-[-0.065em] sm:text-7xl md:text-8xl lg:text-[clamp(5rem,8vw,8.5rem)]">
          Ship motion that <span className="text-accent">matters</span>
        </h2>
        <p className="relative z-10 mt-8 max-w-md text-pretty text-base leading-relaxed text-fg-muted sm:text-lg">
          Motion as utility classes, compiled for the frameworks you ship.
        </p>
        <Link
          href="https://www.motionwind.xyz/docs/getting-started"
          className="relative z-10 mt-10 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-md bg-accent px-5 py-3 text-sm font-semibold text-accent-fg transition-[background-color,transform] duration-200 hover:bg-accent-hover active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Start building
          <ArrowUpRightIcon size={16} weight="bold" aria-hidden="true" />
        </Link>
        <nav
          aria-label="Footer navigation"
          className="relative z-10 mt-28 flex flex-wrap justify-center gap-x-10 gap-y-4 text-sm text-code-muted"
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
        <MotionwindFluidText />
      </div>
    </footer>
  );
}
