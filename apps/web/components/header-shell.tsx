"use client";

import Link from "next/link";
import { m, useReducedMotion } from "motion/react";
import { GithubIcon } from "@repo/ui/github-icon";
import {
  MotionwindHorizontalLogo,
  MotionwindLogo,
} from "@repo/ui/motionwind-logo";
import { useLayoutEffect, useRef, useState } from "react";
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
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const transition = reduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, duration: 0.28, bounce: 0 };

  return (
    <header className="sticky top-4 z-200 px-4 sm:px-6 lg:px-8">
      <m.div
        layout
        transition={transition}
        className="relative mx-auto flex h-14 w-full items-center justify-between gap-3 rounded-full border border-border bg-surface-elevated px-3 shadow-[0_16px_40px_-24px_var(--color-shadow)] sm:px-4"
        animate={{ maxWidth: isScrolled ? 820 : 1440 }}
        style={{ borderRadius: 999 }}
      >
        <m.div layout className="flex min-w-0 items-center">
          <Link
            href="/"
            aria-label="Motionwind home"
            className="group flex h-12 cursor-pointer items-center rounded-full px-2 transition-opacity hover:opacity-70 sm:px-3"
          >
            {isScrolled ? (
              <m.span
                key="mark"
                layout
                initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={transition}
                className="flex h-8 w-10 items-center justify-center text-fg"
              >
                <MotionwindLogo className="h-8 w-10" />
              </m.span>
            ) : (
              <m.span
                key="wordmark"
                layout
                initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={transition}
              >
                <MotionwindHorizontalLogo className="h-8 w-32 text-fg sm:h-9 sm:w-36" />
              </m.span>
            )}
          </Link>
          <nav
            className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full border border-border-subtle bg-surface-elevated/90 px-2 py-1.5 md:flex"
            aria-label="Main navigation"
          >
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  item.href.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                className="cursor-pointer rounded-full px-3 py-1.5 font-[family-name:var(--font-mono)] text-xs tracking-wide text-fg-muted transition-colors hover:bg-surface hover:text-fg"
              >
                {item.label}
              </a>
            ))}
            <a
              href="https://www.motionwind.xyz/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer rounded-full px-3 py-1.5 font-[family-name:var(--font-mono)] text-xs tracking-wide text-fg-muted transition-colors hover:bg-surface hover:text-fg"
            >
              Docs
            </a>
          </nav>
        </m.div>
        <m.div layout className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href="https://github.com/piyushzingade/motionwind"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open Motionwind on GitHub"
            title="Open Motionwind on GitHub"
            className="inline-flex h-10 min-w-10 cursor-pointer items-center justify-center gap-2 rounded-full border border-border bg-surface-elevated px-2.5 text-fg-muted transition-colors hover:border-accent/20 hover:text-fg sm:h-12 sm:min-w-12 sm:px-3"
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
          <div className="flex size-10 items-center justify-center rounded-full border border-border bg-surface-elevated sm:size-12">
            <ThemeToggle className="size-8 rounded-full border-0 bg-transparent shadow-none" />
          </div>
        </m.div>
      </m.div>
    </header>
  );
}
