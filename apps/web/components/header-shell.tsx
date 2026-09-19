"use client";

import Link from "next/link";
import { m, useReducedMotion } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";
import { GithubIcon } from "@repo/ui/github-icon";
import { MotionwindHorizontalLogo } from "@repo/ui/motionwind-logo";
import { ThemeToggle } from "./theme-toggle";

const NAV_ITEMS = [
  { label: "Demos", href: "#demos" },
  { label: "Playground", href: "https://play.motionwind.xyz" },
];

type HeaderShellProps = {
  starCount: number | null;
};

export function HeaderShell({ starCount }: HeaderShellProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const frameRef = useRef<number | null>(null);
  const reduceMotion = useReducedMotion();

  useLayoutEffect(() => {
    const update = () => {
      frameRef.current = null;
      setIsScrolled(window.scrollY > 24);
    };

    const onScroll = () => {
      if (frameRef.current === null) {
        frameRef.current = window.requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const transition = reduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, duration: 0.28, bounce: 0 };

  return (
    <header className="sticky top-4 z-200 px-4 sm:px-6 lg:px-8">
      <m.div
        layout
        animate={{ maxWidth: isScrolled ? 640 : 1120 }}
        transition={transition}
        className={`relative mx-auto flex h-14 w-full items-center justify-between transition-[gap] duration-200 ${isScrolled ? "gap-0" : "gap-3"}`}
      >
        <m.div layout className="flex min-w-0 items-center">
          <Link
            href="/"
            aria-label="Motionwind home"
            className={`group flex h-12 cursor-pointer items-center rounded-full border border-border bg-surface-elevated transition-[padding,opacity] duration-200 hover:opacity-70 ${isScrolled ? "px-2" : "px-5 shadow-[0_16px_40px_-24px_var(--color-shadow)]"}`}
          >
            <MotionwindHorizontalLogo className="h-8 w-32 text-fg sm:h-9 sm:w-36" />
          </Link>
          <nav
            className={`absolute left-1/2 hidden -translate-x-1/2 items-center rounded-full border border-border bg-surface-elevated shadow-[0_16px_40px_-24px_var(--color-shadow)] transition-[gap,padding] duration-200 md:flex ${isScrolled ? "gap-0 px-1 py-1" : "gap-1 px-3 py-2"}`}
            aria-label="Main navigation"
          >
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className={`cursor-pointer rounded-full font-[family-name:var(--font-mono)] tracking-wide text-fg-muted transition-[padding,background-color,color] duration-200 hover:bg-surface hover:text-fg ${isScrolled ? "px-2.5 py-1.5 text-[11px]" : "px-4 py-2 text-xs"}`}
              >
                {item.label}
              </a>
            ))}
            <a
              href="https://www.motionwind.xyz/docs"
              target="_blank"
              rel="noopener noreferrer"
              className={`cursor-pointer rounded-full font-[family-name:var(--font-mono)] tracking-wide text-fg-muted transition-[padding,background-color,color] duration-200 hover:bg-surface hover:text-fg ${isScrolled ? "px-2.5 py-1.5 text-[11px]" : "px-4 py-2 text-xs"}`}
            >
              Docs
            </a>
          </nav>
        </m.div>
        <m.div layout className={`flex shrink-0 items-center transition-[gap] duration-200 ${isScrolled ? "gap-1" : "gap-3"}`}>
          <Link
            href="https://github.com/piyushzingade/motionwind"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open Motionwind on GitHub"
            title="Open Motionwind on GitHub"
            className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-border bg-surface-elevated text-fg-muted transition-[height,min-width,padding,opacity] duration-200 hover:border-accent/20 hover:text-fg ${isScrolled ? "h-10 min-w-10 px-2.5" : "h-12 min-w-12 px-3 shadow-[0_16px_40px_-24px_var(--color-shadow)]"}`}
          >
            <GithubIcon className="size-5 text-fg" />
            {starCount !== null && (
              <>
                <span aria-hidden="true" className="h-5 w-px bg-border" />
                <span className="font-[family-name:var(--font-mono)] text-xs tabular-nums text-fg-muted">
                  {starCount}
                </span>
              </>
            )}
          </Link>
          <div className={`flex items-center justify-center rounded-full border border-border bg-surface-elevated transition-[height,width] duration-200 ${isScrolled ? "size-10" : "size-12 shadow-[0_16px_40px_-24px_var(--color-shadow)]"}`}>
            <ThemeToggle className="size-8 rounded-full border-0 bg-transparent shadow-none" />
          </div>
        </m.div>
      </m.div>
    </header>
  );
}
