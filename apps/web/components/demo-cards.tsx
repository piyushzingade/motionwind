"use client";

import { useMemo } from "react";
import { SectionHeader } from "./section-header";
import { Reveal } from "./reveal";

function PreviewCard({
  title,
  children,
  codeSnippet,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  codeSnippet?: string;
  className?: string;
}) {
  return (
    <div className={`preview-card ${className}`}>
      <div className="preview-titlebar">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-60 animate-pulse-glow" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          <span className="text-[11px] font-medium tracking-[0.15em] uppercase text-fg-muted">
            {title}
          </span>
        </div>
        <svg
          className="w-4 h-4 text-code-muted"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M2.985 19.644l3.181-3.182"
          />
        </svg>
      </div>
      <div className="preview-stage">{children}</div>
      <div className="preview-code">
        <code className="text-[11px] font-[family-name:var(--font-mono)]">
          {codeSnippet}
        </code>
      </div>
    </div>
  );
}

function GestureTable() {
  const rows: [string, string, string][] = useMemo(
    () => [
      [
        "Hover",
        "animate-hover:",
        "Buttons, cards, links, any pointer interaction",
      ],
      ["Tap", "animate-tap:", "Button press feedback, click effects"],
      [
        "Focus",
        "animate-focus:",
        "Form inputs, accessibility focus indicators",
      ],
      ["Drag", "animate-drag:", "Draggable elements, sliders, sortable items"],
      [
        "InView",
        "animate-inview:",
        "Scroll-triggered reveals, lazy animations",
      ],
      [
        "Initial",
        "animate-initial:",
        "Starting state for enter/inview animations",
      ],
      ["Enter", "animate-enter:", "Target state on mount"],
      [
        "Exit",
        "animate-exit:",
        "Target state on unmount (requires AnimatePresence)",
      ],
    ],
    [],
  );

  return (
    <div className="px-5 sm:px-6 py-4 bg-surface/50 rounded-b-2xl">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-border-subtle">
            <th className="pb-3 text-[10px] font-semibold tracking-[0.15em] uppercase text-code-muted w-24">
              Gesture
            </th>
            <th className="pb-3 text-[10px] font-semibold tracking-[0.15em] uppercase text-code-muted w-44">
              Prefix
            </th>
            <th className="pb-3 text-[10px] font-semibold tracking-[0.15em] uppercase text-code-muted">
              Use Case
            </th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {rows.map(([gesture, prefix, useCase], i) => (
            <tr
              key={gesture}
              className={`border-b border-border-subtle ${i % 2 === 0 ? "bg-code-header/50" : ""}`}
            >
              <td className="py-3 text-fg font-medium text-xs">{gesture}</td>
              <td className="py-3">
                <code className="text-[11px] font-[family-name:var(--font-mono)] text-accent bg-accent/10 px-2 py-1 rounded">
                  {prefix}
                </code>
              </td>
              <td className="py-3 text-xs text-code-muted">{useCase}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DemoCards() {
  return (
    <section
      id="demos"
      className="section-anchor relative py-20 sm:py-28 px-4 sm:px-6 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <SectionHeader
            label="Try it in the browser"
            title="Feel the difference"
            lede="Every preview is powered by Motionwind classes. Hover, focus, drag, and scroll to see the same interactions you can use in your app."
          />
        </Reveal>

        <div className="grid gap-4 md:grid-cols-2">
          <Reveal delay={0.05} y={20}>
            <PreviewCard title="Search Bar Focus">
              <label htmlFor="demo-search" className="sr-only">
                Search
              </label>
              <input
                id="demo-search"
                type="text"
                placeholder="Search..."
                className="animate-focus:scale-105 animate-focus:y--2 animate-spring animate-stiffness-300 animate-damping-20 w-full max-w-md rounded-xl bg-code-header border border-border px-5 py-3 text-sm text-fg placeholder:text-code-muted outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 focus:shadow-[0_0_20px_var(--accent-glow)] transition-[border-color,box-shadow]"
              />
            </PreviewCard>
          </Reveal>

          <Reveal delay={0.1} y={20}>
            <PreviewCard title="Hover and tap">
              <div className="animate-hover:scale-110 animate-tap:scale-90 animate-spring animate-stiffness-400 animate-damping-15 px-8 py-4 rounded-xl bg-accent/20 border border-accent/40 text-sm text-accent font-semibold select-none cursor-pointer shadow-[0_0_24px_var(--accent-glow)]">
                Hover me, or tap me
              </div>
            </PreviewCard>
          </Reveal>

          <Reveal delay={0.05} y={20}>
            <PreviewCard title="Scroll reveal">
              <div className="animate-initial:opacity-0 animate-initial:y-20 animate-inview:opacity-100 animate-inview:y-0 animate-duration-500 animate-once px-10 py-5 rounded-xl bg-accent/20 border border-accent/40 text-sm text-accent font-semibold shadow-[0_0_24px_var(--accent-glow)]">
                I appear on scroll
              </div>
            </PreviewCard>
          </Reveal>

          <Reveal delay={0.1} y={20}>
            <PreviewCard title="Drag interaction">
              <div className="animate-drag-both animate-drag-elastic-30 animate-drag-snap animate-hover:scale-105 animate-spring px-8 py-4 rounded-xl bg-accent/20 border border-accent/40 text-sm text-accent font-semibold cursor-grab active:cursor-grabbing select-none shadow-[0_0_24px_var(--accent-glow)]">
                Drag me around
              </div>
            </PreviewCard>
          </Reveal>

          <Reveal delay={0.15} y={20}>
            <PreviewCard title="Infinite loop">
              <div className="animate-initial:rotate-0 animate-enter:rotate-360 animate-duration-2000 animate-ease-linear animate-repeat-infinite w-16 h-16 rounded-xl bg-accent/20 border border-accent/40 flex items-center justify-center shadow-[0_0_24px_var(--accent-glow)]">
                <svg
                  className="w-6 h-6 text-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M2.985 19.644l3.181-3.182"
                  />
                </svg>
              </div>
            </PreviewCard>
          </Reveal>

          <Reveal delay={0.2} y={20}>
            <PreviewCard title="Spring physics">
              <div className="animate-hover:rotate-12 animate-hover:scale-115 animate-tap:rotate-0 animate-tap:scale-85 animate-spring animate-stiffness-200 animate-damping-8 px-8 py-4 rounded-xl bg-accent/20 border border-accent/40 text-sm text-accent font-semibold cursor-pointer select-none shadow-[0_0_24px_var(--accent-glow)]">
                Hover for springy bounce
              </div>
            </PreviewCard>
          </Reveal>

          <Reveal delay={0.05} y={20}>
            <PreviewCard title="Gesture prefixes" className="md:col-span-2">
              <GestureTable />
            </PreviewCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
