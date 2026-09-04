"use client";

import { useEffect, useRef } from "react";
import {
  LazyMotion,
  domAnimation,
  m,
  useMotionValue,
  useSpring,
  useMotionTemplate,
} from "motion/react";
import { OssProgramBadge } from "@repo/ui/oss-program-badge";
import { MintlifyLogo } from "./mintlify-logo";

const easeOutQuint: [number, number, number, number] = [0.23, 1, 0.32, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

const spring = { type: "spring" as const, stiffness: 300, damping: 22 };

export function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(40);
  const glowX = useSpring(mouseX, spring);
  const glowY = useSpring(mouseY, spring);
  const glow = useMotionTemplate`radial-gradient(480px circle at ${glowX}% ${glowY}%, var(--color-demo-glow), transparent 70%)`;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      mouseX.set(((e.clientX - rect.left) / rect.width) * 100);
      mouseY.set(((e.clientY - rect.top) / rect.height) * 100);
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, [mouseX, mouseY]);

  return (
    <LazyMotion features={domAnimation}>
      {/* Reduced-motion / SSR fallback glow so content is never bare */}
      <div className="pointer-events-none absolute inset-0 rotate-[0.5deg] overflow-hidden">
        <div className="surface-grid" aria-hidden="true" />
        <div
          className="absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 -translate-y-1/3 rounded-full"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 50% 50% at 50% 50%, var(--color-demo-glow), transparent 70%)",
          }}
        />
      </div>

      <section
        ref={ref}
        className="relative flex min-h-[calc(100svh-3.5rem)] items-center justify-center overflow-hidden px-4 sm:px-6"
      >
        {/* Spring-smoothed mouse-follow glow, composite-only */}
        <m.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden lg:block"
          style={{ background: glow }}
        />

        <div className="relative mx-auto flex max-w-3xl flex-col items-center py-20 text-center sm:py-28">
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
            transition={{ duration: 0.5, delay: 0.06, ease: easeOutQuint }}
            className="mt-8 text-balance font-[family-name:var(--font-display)] text-5xl italic tracking-[-0.02em] text-foreground sm:text-6xl md:text-7xl"
          >
            Motion, written like{" "}
            <span className="text-acid">Tailwind.</span>
          </m.h1>

          <m.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ duration: 0.5, delay: 0.13, ease: easeOutQuint }}
            className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-text-dim sm:text-lg"
          >
            Motionwind turns familiar utility classes into optimized Motion
            components during your build. Create expressive interactions
            without learning a new API or shipping a parser to your users.
          </m.p>

          <m.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ duration: 0.5, delay: 0.2, ease: easeOutQuint }}
            className="mt-9 flex flex-wrap justify-center gap-3"
          >
            <a
              href="https://www.motionwind.xyz/docs"
              className="inline-flex items-center gap-2 rounded-lg bg-acid px-5 py-3 text-sm font-semibold text-[var(--color-accent-fg)] transition-colors hover:bg-acid-dim focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acid"
            >
              Read the docs <ArrowIcon />
            </a>
            <a
              href="/play"
              className="inline-flex items-center gap-2 rounded-lg border border-border-strong bg-surface-raised px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-acid/30 hover:bg-surface-overlay focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acid"
            >
              Open playground <ArrowIcon />
            </a>
          </m.div>
        </div>
      </section>
    </LazyMotion>
  );
}

function ArrowIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
      />
    </svg>
  );
}
