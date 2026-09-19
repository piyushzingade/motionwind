"use client";

import { useMemo } from "react";
import { LazyMotion, domAnimation, m, useReducedMotion } from "motion/react";
import { mw } from "motionwind-react";
import { generateMotionCode } from "motionwind-react/tooling";
import { ArrowRightIcon, ArrowUpRightIcon } from "@phosphor-icons/react";
import { OssProgramBadge } from "@repo/ui/oss-program-badge";
import { highlightCode } from "../lib/highlight";
import { MintlifyLogo } from "./mintlify-logo";

const easeOutQuint: [number, number, number, number] = [0.23, 1, 0.32, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

const heroClasses =
  "animate-hover:scale-105 animate-tap:scale-95 animate-spring animate-stiffness-420 animate-damping-24 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-accent-fg cursor-pointer";

export function HeroSection() {
  const reduceMotion = useReducedMotion();
  const generated = useMemo(
    () =>
      generateMotionCode("button", heroClasses, {
        text: "Ship interaction",
        target: "react",
      }),
    [],
  );

  return (
    <LazyMotion features={domAnimation}>
      <section className="relative overflow-hidden px-4 sm:px-6">
        <div className="surface-glow" aria-hidden="true" />

        <div className="relative mx-auto flex min-h-[calc(100dvh-3.5rem)] max-w-[1120px] flex-col items-center justify-center py-20 sm:py-24 lg:py-28">
          <div className="flex w-full max-w-5xl flex-col items-center text-center">
            <m.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={{ duration: 0.5, ease: easeOutQuint }}
              className="inline-flex"
            >
              <OssProgramBadge
                brand={<MintlifyLogo className="h-3.5 w-auto" />}
              />
            </m.div>

            <m.h1
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={{ duration: 0.5, delay: 0.06, ease: easeOutQuint }}
              className="mt-8 max-w-5xl text-balance text-[clamp(3.6rem,7vw,7.5rem)] font-semibold leading-[0.92] tracking-[-0.065em] text-fg"
            >
              Motion as utility classes.
            </m.h1>

            <m.p
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={{ duration: 0.5, delay: 0.13, ease: easeOutQuint }}
              className="mt-7 max-w-2xl text-pretty text-base leading-relaxed text-fg-muted sm:text-lg"
            >
              Write animation intent in className. Motionwind compiles it into
              Motion props before your app ships.
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
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-[var(--color-accent-fg)] transition-colors hover:bg-accent-hover active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Read docs
                <ArrowUpRightIcon size={16} weight="bold" aria-hidden="true" />
              </a>
              <a
                href="https://play.motionwind.xyz"
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-surface-elevated px-5 py-3 text-sm font-semibold text-fg transition-colors hover:border-accent/30 hover:bg-surface active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Open playground
                <ArrowRightIcon size={16} weight="bold" aria-hidden="true" />
              </a>
            </m.div>
          </div>

          <m.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ duration: 0.6, delay: 0.16, ease: easeOutQuint }}
            className="relative mt-16 w-full max-w-[1040px] lg:ml-16"
          >
            <div className="overflow-hidden rounded-xl border border-border bg-surface">
              <div className="flex items-center justify-between px-5 py-4 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.16em] text-code-muted">
                <span>motionwind / compile</span>
                <span className="flex items-center gap-2 normal-case tracking-normal text-accent">
                  <span className="size-1.5 rounded-full bg-accent" />
                  ready
                </span>
              </div>
              <div className="grid gap-0 lg:grid-cols-[minmax(0,1.36fr)_minmax(260px,0.64fr)]">
                <div className="grid min-w-0 gap-4 border-b border-border-subtle bg-surface p-4 lg:border-b-0 lg:border-r lg:p-5">
                  <CodePane
                    title="className"
                    code={`<button className="${heroClasses}">\n  Ship interaction\n</button>`}
                    expanded
                  />
                  <div className="flex items-center justify-between border-y border-border-subtle px-1 py-2 font-[family-name:var(--font-mono)] text-[10px] text-code-muted">
                    <span>compile step</span>
                    <span className="text-fg-muted">Motion props</span>
                  </div>
                  <CodePane
                    title="generated output"
                    code={generated}
                    expanded
                  />
                </div>

                <div className="m-3 flex min-h-[300px] flex-col justify-between gap-8 rounded-xl border border-border-subtle bg-surface-elevated p-5 lg:p-7">
                  <div className="flex items-center justify-between font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.16em] text-code-muted">
                    <span>live result</span>
                    <span className="text-fg-muted">react</span>
                  </div>
                  <div className="flex flex-1 items-center justify-center py-4">
                    <mw.button
                      className={heroClasses}
                      data-demo-ready={!reduceMotion}
                    >
                      Ship interaction
                    </mw.button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {["hover", "tap", "spring", "build"].map((item) => (
                      <span
                        key={item}
                        className="rounded-lg border border-border-subtle bg-surface px-2.5 py-2.5 text-center font-[family-name:var(--font-mono)] text-[10px] text-code-muted transition-colors duration-200 hover:border-border hover:text-fg"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </m.div>
        </div>
      </section>
    </LazyMotion>
  );
}

function CodePane({
  title,
  code,
  expanded = false,
}: {
  title: string;
  code: string;
  expanded?: boolean;
}) {
  return (
    <div className="min-w-0 rounded-lg border border-border-subtle bg-surface-elevated">
      <div className="border-b border-border-subtle px-3 py-2 font-[family-name:var(--font-mono)] text-[10px] text-code-muted">
        {title}
      </div>
      <pre
        className={`code-scrollbar-hidden overflow-auto px-3 py-4 font-[family-name:var(--font-mono)] text-[11px] leading-5 ${expanded ? "max-h-56" : "max-h-40"}`}
      >
        <code>{highlightCode(code)}</code>
      </pre>
    </div>
  );
}
