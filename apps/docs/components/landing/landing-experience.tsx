"use client";

import { useRef, type ReactNode } from "react";
import { CodeIcon } from "@phosphor-icons/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";
import { AnimatedCheckboxDemo } from "@/components/demos/animated-checkbox-demo";
import { CircularProgressDemo } from "@/components/demos/circular-progress-demo";
import { SharedLayoutTabsDemo } from "@/components/demos/layout-demos";
import { StaggeredGridDemo } from "@/components/demos/staggered-grid-demo";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const frameworks = ["React", "Vue", "JavaScript", "React Native"];

function PreviewFrame({
  title,
  className,
  children,
}: {
  title: string;
  className: string;
  children: ReactNode;
}) {
  return (
    <article
      data-showcase-card
      className={`relative min-h-[320px] overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-2 shadow-[0_24px_80px_var(--color-shadow)] ${className}`}
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
            { opacity: 0.18, scale: 0.86, y: 80 },
            { opacity: 1, scale: 1, y: 0, duration: 0.45, ease: "none" },
          )
          .to(
            card,
            { opacity: 0.24, scale: 0.96, y: -34, duration: 0.25 },
            0.75,
          );

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
              Four demos. One motion language.
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[var(--color-fg-muted)]">
              The essentials are visible at a glance: entrance, SVG drawing,
              progress, and shared layout. No abstract showcase pieces.
            </p>
          </div>

          <div className="grid grid-flow-dense grid-cols-1 gap-5 lg:grid-cols-12 lg:grid-rows-2 lg:auto-rows-[270px]">
            <PreviewFrame
              title="staggered-entrance.tsx"
              className="lg:col-span-6 lg:row-span-2 lg:min-h-[560px]"
            >
              <div className="[&_button]:hidden">
                <StaggeredGridDemo />
              </div>
            </PreviewFrame>
            <PreviewFrame
              title="svg-checkbox.tsx"
              className="lg:col-span-3 lg:row-span-1"
            >
              <AnimatedCheckboxDemo />
            </PreviewFrame>
            <PreviewFrame
              title="circular-progress.tsx"
              className="lg:col-span-3 lg:row-span-2 lg:min-h-[560px]"
            >
              <div className="[&_button]:hidden">
                <CircularProgressDemo />
              </div>
            </PreviewFrame>
            <PreviewFrame
              title="shared-layout-tabs.tsx"
              className="lg:col-span-3 lg:row-span-1"
            >
              <SharedLayoutTabsDemo />
            </PreviewFrame>
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
