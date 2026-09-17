"use client";

import { useRef, type ReactNode } from "react";
import {
  BellIcon,
  CaretDownIcon,
  CheckIcon,
  CodeIcon,
  GearSixIcon,
  LightningIcon,
  PlusIcon,
  SparkleIcon,
} from "@phosphor-icons/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const frameworks = ["React", "Vue", "JavaScript", "React Native"];

const loopCards = [
  { title: "staggered-grid.tsx", variant: "staggered" },
  { title: "svg-checkbox.tsx", variant: "checkbox" },
  { title: "circular-progress.tsx", variant: "progress" },
  { title: "pulse-ring.tsx", variant: "pulse" },
  { title: "shared-tabs.tsx", variant: "tabs" },
  { title: "notification.tsx", variant: "notification" },
  { title: "accordion.tsx", variant: "accordion" },
  { title: "magnetic-button.tsx", variant: "button" },
  { title: "loading-dots.tsx", variant: "loading" },
] as const;

function LoopingPreview({
  variant,
}: {
  variant: (typeof loopCards)[number]["variant"];
}) {
  if (variant === "staggered") {
    return (
      <div className="grid w-full max-w-[210px] grid-cols-2 gap-2">
        {[LightningIcon, SparkleIcon, GearSixIcon, PlusIcon].map(
          (Icon, index) => (
            <div
              key={index}
              className="landing-loop-stagger rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-3"
              style={{ animationDelay: `${index * 160}ms` }}
            >
              <Icon
                size={16}
                weight="fill"
                className="text-[var(--color-accent)]"
                aria-hidden="true"
              />
              <span className="mt-2 block text-[11px] font-semibold text-[var(--color-fg)]">
                {["Fast", "Fluid", "Typed", "Ready"][index]}
              </span>
            </div>
          ),
        )}
      </div>
    );
  }

  if (variant === "checkbox") {
    return (
      <div className="flex flex-col gap-3 text-xs font-medium text-[var(--color-fg-muted)]">
        {["Design", "Develop", "Ship"].map((label, index) => (
          <div key={label} className="flex items-center gap-3">
            <span
              className="landing-loop-check flex size-7 items-center justify-center rounded-lg border-2 border-[var(--color-accent)]/60"
              style={{ animationDelay: `${index * 220}ms` }}
            >
              <CheckIcon size={15} weight="bold" aria-hidden="true" />
            </span>
            {label}
          </div>
        ))}
      </div>
    );
  }

  if (variant === "progress") {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="landing-loop-progress relative size-28 rounded-full p-[7px]">
          <div className="flex size-full items-center justify-center rounded-full bg-[var(--color-bg)] font-mono text-lg font-bold text-[var(--color-accent)]">
            72%
          </div>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-fg-muted)]">
          Build complete
        </span>
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <div className="relative flex size-36 items-center justify-center">
        {[
          "landing-loop-pulse-a",
          "landing-loop-pulse-b",
          "landing-loop-pulse-c",
        ].map((className) => (
          <span
            key={className}
            className={`absolute size-full rounded-full border border-[var(--color-accent)]/55 ${className}`}
          />
        ))}
        <span className="relative size-4 rounded-full bg-[var(--color-accent)]" />
      </div>
    );
  }

  if (variant === "tabs") {
    return (
      <div className="w-full max-w-[230px] rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-1">
        <div className="relative grid grid-cols-3 gap-1">
          <span className="landing-loop-tab absolute inset-y-0 left-0 w-1/3 rounded-lg bg-[var(--color-accent)]" />
          {["Overview", "Motion", "Tokens"].map((label) => (
            <span
              key={label}
              className="relative z-10 px-2 py-2 text-center text-[10px] font-semibold text-[var(--color-fg-muted)] first:text-[var(--color-accent-fg)]"
            >
              {label}
            </span>
          ))}
        </div>
        <div className="mt-4 space-y-2 px-2 pb-2">
          <span className="block h-2 w-4/5 rounded-full bg-[var(--color-border)]" />
          <span className="block h-2 w-3/5 rounded-full bg-[var(--color-border)]" />
        </div>
      </div>
    );
  }

  if (variant === "notification") {
    return (
      <div className="landing-loop-notification flex w-full max-w-[230px] items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent)]/15 text-[var(--color-accent)]">
          <BellIcon size={16} weight="fill" aria-hidden="true" />
        </span>
        <span className="min-w-0">
          <strong className="block truncate text-xs text-[var(--color-fg)]">
            Animation ready
          </strong>
          <small className="block truncate text-[10px] text-[var(--color-fg-muted)]">
            Compiled in the build
          </small>
        </span>
      </div>
    );
  }

  if (variant === "accordion") {
    return (
      <div className="w-full max-w-[230px] space-y-2">
        {["What changes?", "Where it runs?", "How it ships?"].map(
          (label, index) => (
            <div
              key={label}
              className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3 py-2"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-[var(--color-fg)]">
                <span>{label}</span>
                <CaretDownIcon
                  size={14}
                  className={`landing-loop-caret ${index === 0 ? "text-[var(--color-accent)]" : "text-[var(--color-fg-muted)]"}`}
                  aria-hidden="true"
                />
              </div>
              <div
                className={`landing-loop-panel text-[10px] leading-5 text-[var(--color-fg-muted)] ${index === 0 ? "landing-loop-panel-active" : ""}`}
              >
                Only the class changes. The intent stays close to the element.
              </div>
            </div>
          ),
        )}
      </div>
    );
  }

  if (variant === "button") {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="landing-loop-button rounded-xl bg-[var(--color-accent)] px-5 py-3 text-xs font-bold text-[var(--color-accent-fg)]">
          Animate this
        </div>
        <span className="font-mono text-[10px] text-[var(--color-fg-muted)]">
          whileHover: scale-105
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-end gap-2">
      {[0, 1, 2, 3].map((index) => (
        <span
          key={index}
          className="landing-loop-dot h-3 w-3 rounded-full bg-[var(--color-accent)]"
          style={{ animationDelay: `${index * 140}ms` }}
        />
      ))}
    </div>
  );
}

function PreviewFrame({
  title,
  className,
  children,
}: {
  title: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <article
      data-showcase-card
      className={`relative aspect-square overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-2 shadow-[0_24px_80px_var(--color-shadow)] ${className ?? ""}`}
    >
      <div className="flex h-10 items-center px-2">
        <span className="flex min-w-0 items-center gap-2 font-[family-name:var(--font-mono)] text-[11px] text-[var(--color-fg-muted)]">
          <CodeIcon size={14} aria-hidden="true" />
          <span className="truncate">{title}</span>
        </span>
      </div>
      <div
        data-preview-visual
        className="flex h-[calc(100%-2.5rem)] min-h-0 items-center justify-center overflow-hidden rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg)] p-6"
        aria-hidden="true"
        inert={true}
      >
        {children}
      </div>
    </article>
  );
}

export function LandingExperience() {
  const scope = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reduceMotion) return;

      const cards = gsap.utils.toArray<HTMLElement>("[data-showcase-card]");
      cards.forEach((card) => {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: card,
              start: "top 92%",
              end: "bottom 8%",
              scrub: 0.65,
            },
          })
          .fromTo(
            card,
            { opacity: 0.18, y: 80 },
            { opacity: 1, y: 0, duration: 0.45, ease: "none" },
          )
          .to(card, { opacity: 0.24, y: -34, duration: 0.25 }, 0.75);

        const visual = card.querySelector<HTMLElement>("[data-preview-visual]");
        if (visual) {
          gsap.fromTo(
            visual,
            { yPercent: 8 },
            {
              yPercent: -8,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.8,
              },
            },
          );
        }
      });

      gsap.to("[data-story-word]", {
        opacity: 1,
        stagger: 0.08,
        ease: "none",
        scrollTrigger: {
          trigger: "[data-story-copy]",
          start: "top 78%",
          end: "bottom 46%",
          scrub: true,
        },
      });

      gsap.to("[data-framework-track]", {
        xPercent: -50,
        duration: 20,
        repeat: -1,
        ease: "none",
      });
    },
    { scope, dependencies: [reduceMotion], revertOnUpdate: true },
  );

  const story =
    "Author motion beside the element, compile it before runtime, and ship the same intent across every framework.";

  return (
    <div ref={scope}>
      <section
        id="components"
        data-landing-section="components"
        className="px-5 py-32 sm:px-8 md:py-44 lg:px-12"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-16 max-w-3xl text-center md:mb-24">
            <h2 className="text-4xl font-semibold tracking-[-0.045em] text-[var(--color-fg)] sm:text-5xl md:text-6xl">
              Nine components. One motion language.
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[var(--color-fg-muted)]">
              A compact field guide to the interactions you can author with a
              class beside the element.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {loopCards.map(({ title, variant }) => (
              <PreviewFrame key={title} title={title}>
                <LoopingPreview variant={variant} />
              </PreviewFrame>
            ))}
          </div>
        </div>
      </section>

      <section
        data-landing-section="story"
        className="border-y border-[var(--color-border-subtle)] px-5 py-32 sm:px-8 md:py-48 lg:px-12"
      >
        <div className="mx-auto max-w-7xl">
          <h2
            data-story-copy
            className="max-w-5xl text-4xl font-semibold leading-[1.08] tracking-[-0.045em] text-[var(--color-fg)] sm:text-5xl md:text-7xl"
          >
            {story.split(" ").map((word, index) => (
              <span
                key={`${word}-${index}`}
                data-story-word
                className="mr-[0.24em] inline-block opacity-10 motion-reduce:opacity-100"
              >
                {word}
              </span>
            ))}
          </h2>

          <div className="mt-20 flex flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] md:flex-row">
            {[
              ["Write", "animate-hover:scale-105"],
              ["Compile", "Motion props at build time"],
              ["Ship", "Zero Motionwind runtime"],
            ].map(([title, detail]) => (
              <article
                key={title}
                className="group flex min-h-48 flex-1 flex-col justify-between border-b border-[var(--color-border)] p-7 transition-[flex-grow,background-color] duration-500 ease-out last:border-b-0 hover:flex-[1.2] hover:bg-[var(--color-surface-elevated)] md:border-b-0 md:border-r md:last:border-r-0"
              >
                <h3 className="text-2xl font-semibold tracking-tight text-[var(--color-fg)]">
                  {title}
                </h3>
                <code className="mt-10 break-words font-[family-name:var(--font-mono)] text-xs leading-6 text-[var(--color-accent)]">
                  {detail}
                </code>
              </article>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-20 max-w-7xl overflow-hidden border-y border-[var(--color-border-subtle)] py-5">
          <div
            data-framework-track
            className="flex w-max items-center will-change-transform"
          >
            {[...frameworks, ...frameworks].map((framework, index) => (
              <span
                key={`${framework}-${index}`}
                className="mx-10 whitespace-nowrap font-[family-name:var(--font-mono)] text-sm uppercase tracking-[0.22em] text-[var(--color-fg-muted)]"
              >
                {framework}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
