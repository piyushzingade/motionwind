"use client";

import { LazyMotion, domAnimation, m } from "motion/react";
import Link from "next/link";
import { OssProgramBadge } from "@repo/ui/oss-program-badge";
import { MintlifyLogo } from "./mintlify-logo";

/**
 * Animated hero for the docs landing page. Uses the same motion/react
 * primitives as the docs sidebar (wrapped in LazyMotion + domAnimation).
 */

const easeOutQuint: [number, number, number, number] = [0.23, 1, 0.32, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export function Hero() {
  return (
    <LazyMotion features={domAnimation}>
      <section className="relative flex min-h-screen flex-col justify-center overflow-hidden">
        {/* Radial glow behind the hero */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 -translate-y-1/3 rounded-full"
          style={{
            background:
              "radial-gradient(ellipse 50% 50% at 50% 50%, var(--color-demo-glow), transparent 70%)",
          }}
        />

        <div className="flex flex-col items-center justify-center px-6 py-20 text-center sm:py-24">
          <m.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ duration: 0.5, ease: easeOutQuint }}
            className="inline-flex"
          >
            <OssProgramBadge brand={<MintlifyLogo className="h-3 w-auto" />} />
          </m.div>

          <m.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ duration: 0.5, delay: 0.05, ease: easeOutQuint }}
            className="mt-6 font-[family-name:var(--font-display)] text-5xl italic tracking-tight text-[var(--color-fg)] md:text-7xl"
          >
            <span className="text-[var(--color-accent)]">motionwind</span> docs
          </m.h1>

          <m.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ duration: 0.5, delay: 0.12, ease: easeOutQuint }}
            className="mt-5 max-w-xl text-center text-[var(--color-fg-muted)] leading-relaxed"
          >
            One tested{" "}
            <span className="text-[var(--color-accent)]">animate-*</span>{" "}
            language for React, Vue, JavaScript, and React Native, with
            compile-time transforms and explicit runtime adapters.
          </m.p>

          <m.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ duration: 0.5, delay: 0.2, ease: easeOutQuint }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-[var(--color-accent-fg)] no-underline transition-colors hover:bg-[var(--color-accent-hover)]"
            >
              Get Started
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
            <a
              href="https://web.motionwind.xyz/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-accent)] bg-[var(--color-accent)]/[0.06] px-6 py-3 text-sm font-semibold text-[var(--color-accent)] no-underline transition-colors hover:bg-[var(--color-accent)]/[0.12]"
            >
              Live Example
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                />
              </svg>
            </a>
          </m.div>
        </div>
      </section>
    </LazyMotion>
  );
}
