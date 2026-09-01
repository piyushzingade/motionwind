"use client";

import { useMemo } from "react";
import type { CodeKey } from "../lib/code-examples";
import { onActivateKey } from "../lib/on-activate-key";

function PreviewCard({
  codeKey,
  title,
  delay,
  onClick,
  children,
  codeSnippet,
}: {
  codeKey: CodeKey;
  title: string;
  delay?: string;
  onClick: (key: CodeKey) => void;
  children: React.ReactNode;
  codeSnippet?: string;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`View code for the ${title.toLowerCase()} demo`}
      onClick={() => onClick(codeKey)}
      onKeyDown={onActivateKey(() => onClick(codeKey))}
      className={`animate-initial:opacity-0 animate-initial:y-20 animate-inview:opacity-100 animate-inview:y-0 animate-duration-500 ${delay ? `${delay} ` : ""}animate-ease-out animate-once preview-card cursor-pointer`}
    >
      <div className="preview-titlebar">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-acid opacity-60 animate-pulse-glow" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-acid" />
          </span>
          <span className="text-[11px] font-medium tracking-[0.15em] uppercase text-text-dim">
            {title}
          </span>
        </div>
        <svg
          className="w-4 h-4 text-text-muted"
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
            <th className="pb-3 text-[10px] font-semibold tracking-[0.15em] uppercase text-text-muted w-24">
              Gesture
            </th>
            <th className="pb-3 text-[10px] font-semibold tracking-[0.15em] uppercase text-text-muted w-44">
              Prefix
            </th>
            <th className="pb-3 text-[10px] font-semibold tracking-[0.15em] uppercase text-text-muted">
              Use Case
            </th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {rows.map(([gesture, prefix, useCase], i) => (
            <tr
              key={gesture}
              className={`border-b border-border-subtle ${i % 2 === 0 ? "bg-surface-inset/50" : ""}`}
            >
              <td className="py-3 text-foreground font-medium text-xs">
                {gesture}
              </td>
              <td className="py-3">
                <code className="text-[11px] font-[family-name:var(--font-mono)] text-acid bg-acid-soft px-2 py-1 rounded">
                  {prefix}
                </code>
              </td>
              <td className="py-3 text-xs text-text-muted">{useCase}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DemoCards({ openCode }: { openCode: (key: CodeKey) => void }) {
  return (
    <section className="relative py-20 sm:py-24 px-4 sm:px-6 overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <div className="animate-initial:opacity-0 animate-initial:y-20 animate-inview:opacity-100 animate-inview:y-0 animate-duration-600 animate-ease-out animate-once text-center mb-12 sm:mb-16">
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-acid/70 mb-4 block">
            Interactive Playground
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Feel the difference
          </h2>
          <p className="mt-4 text-text-dim text-base sm:text-lg max-w-xl mx-auto">
            Every preview below is powered by motionwind classes. Interact to
            feel them live.
          </p>
        </div>

        <div className="flex flex-col gap-8">
          <PreviewCard
            codeKey="scroll"
            title="Search Bar Focus"
            onClick={openCode}
          >
            <label htmlFor="demo-search" className="sr-only">
              Search
            </label>
            <input
              id="demo-search"
              type="text"
              placeholder="Search..."
              onClick={(e) => e.stopPropagation()}
              className="animate-focus:scale-105 animate-focus:y--2 animate-spring animate-stiffness-300 animate-damping-20 w-full max-w-md rounded-xl bg-surface-inset border border-border-strong px-5 py-3 text-sm text-foreground placeholder:text-text-muted outline-none focus:border-acid/50 focus:ring-2 focus:ring-acid/20 focus:shadow-[0_0_20px_var(--acid-glow)] transition-[border-color,box-shadow]"
            />
          </PreviewCard>

          <PreviewCard
            codeKey="hover"
            title="All Gesture States"
            delay="animate-delay-100"
            onClick={openCode}
          >
            <div className="animate-hover:scale-110 animate-tap:scale-90 animate-spring animate-stiffness-400 animate-damping-15 px-8 py-4 rounded-xl bg-acid/15 border border-acid/25 text-sm text-acid font-semibold select-none cursor-pointer shadow-[0_0_24px_var(--acid-glow)]">
              Hover me, or tap me
            </div>
          </PreviewCard>

          <PreviewCard
            codeKey="syntax"
            title="All Gesture Prefixes"
            delay="animate-delay-200"
            onClick={openCode}
          >
            <GestureTable />
          </PreviewCard>

          <PreviewCard
            codeKey="scroll"
            title="Scroll Reveal (Fade Up)"
            delay="animate-delay-300"
            onClick={openCode}
          >
            <div className="animate-initial:opacity-0 animate-initial:y-20 animate-inview:opacity-100 animate-inview:y-0 animate-duration-500 animate-once px-10 py-5 rounded-xl bg-acid/15 border border-acid/25 text-sm text-acid font-semibold shadow-[0_0_24px_var(--acid-glow)]">
              I appear on scroll
            </div>
          </PreviewCard>

          <PreviewCard
            codeKey="drag"
            title="Drag Interaction"
            delay="animate-delay-100"
            onClick={openCode}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="animate-drag-both animate-drag-elastic-30 animate-drag-snap animate-hover:scale-105 animate-spring px-8 py-4 rounded-xl bg-acid/15 border border-acid/25 text-sm text-acid font-semibold cursor-grab active:cursor-grabbing select-none shadow-[0_0_24px_var(--acid-glow)]"
            >
              Drag me around
            </div>
          </PreviewCard>

          <PreviewCard
            codeKey="loop"
            title="Infinite Rotation"
            delay="animate-delay-200"
            onClick={openCode}
          >
            <div className="animate-initial:rotate-0 animate-enter:rotate-360 animate-duration-2000 animate-ease-linear animate-repeat-infinite w-16 h-16 rounded-xl bg-acid/15 border border-acid/25 flex items-center justify-center shadow-[0_0_24px_var(--acid-glow)]">
              <svg
                className="w-6 h-6 text-acid"
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

          <PreviewCard
            codeKey="spring"
            title="Spring Physics"
            delay="animate-delay-300"
            onClick={openCode}
          >
            <div className="animate-hover:rotate-12 animate-hover:scale-115 animate-tap:rotate-0 animate-tap:scale-85 animate-spring animate-stiffness-200 animate-damping-8 px-8 py-4 rounded-xl bg-acid/15 border border-acid/25 text-sm text-acid font-semibold cursor-pointer select-none shadow-[0_0_24px_var(--acid-glow)]">
              Hover for springy bounce
            </div>
          </PreviewCard>
        </div>
      </div>
    </section>
  );
}
