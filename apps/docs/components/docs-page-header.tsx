"use client";

import { LazyMotion, domAnimation, m } from "motion/react";

const easeOutQuint: [number, number, number, number] = [0.23, 1, 0.32, 1];

export function DocsPageHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <LazyMotion features={domAnimation}>
    <header className="mb-10">
      {/* Mono label */}
      <m.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: easeOutQuint, delay: 0 }}
        className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-muted)] mb-3"
      >
        Documentation
      </m.p>

      <m.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: easeOutQuint, delay: 0.05 }}
        className="font-[family-name:var(--font-display)] text-3xl italic text-[var(--color-fg)] sm:text-4xl tracking-tight"
      >
        {title}
      </m.h1>

      {description && (
        <m.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: easeOutQuint, delay: 0.1 }}
          className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--color-fg-muted)]"
        >
          {description}
        </m.p>
      )}

      {/* Dashed accent underline */}
      <m.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5, ease: easeOutQuint, delay: 0.2 }}
        className="mt-6 origin-left"
      >
        <svg
          width="100%"
          height="1"
          preserveAspectRatio="none"
          className="block"
        >
          <line
            x1="0"
            y1="0.5"
            x2="100%"
            y2="0.5"
            stroke="var(--color-border)"
            strokeDasharray="6 4"
            strokeWidth="1"
          />
        </svg>
      </m.div>
    </header>
    </LazyMotion>
  );
}
