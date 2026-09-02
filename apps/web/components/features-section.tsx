"use client";

import type { CodeKey } from "../lib/code-examples";
import { onActivateKey } from "../lib/on-activate-key";

const FEATURES = [
  {
    icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z",
    title: "Zero Runtime",
    desc: "Static classes compiled away at build time. No parser, no overhead in production.",
  },
  {
    icon: "M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z",
    title: "Familiar Syntax",
    desc: "If you know Tailwind, you already know motionwind. Same utility-first approach.",
  },
  {
    icon: "M11.42 15.17l-5.385-5.383a1.855 1.855 0 010-2.627l.603-.606a1.855 1.855 0 012.627 0l2.252 2.251 5.146-5.147a1.855 1.855 0 012.627 0l.603.607a1.855 1.855 0 010 2.626L11.42 15.17z",
    title: "8 Gesture Types",
    desc: "Hover, tap, focus, in-view, drag, initial, enter, and exit gestures.",
  },
  {
    icon: "M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z",
    title: "Framework Ready",
    desc: "First-class integrations for Next.js and Vite. One line to configure.",
    icon2: "M15 12a3 3 0 11-6 0 3 3 0 016 0z",
  },
  {
    icon: "M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.58-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z",
    title: "Spring Physics",
    desc: "Stiffness, damping, mass, and bounce — all controllable through classes.",
  },
  {
    icon: "M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5",
    title: "Drag Support",
    desc: "Enable dragging on any axis with elastic constraints.",
  },
  {
    icon: "M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5",
    title: "Custom Components",
    desc: "Works on <Card>, <Button>, any component. No mw.* wrappers needed.",
  },
  {
    icon: "M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3",
    title: "Template Literals",
    desc: "Static animate classes extracted from template literals at build time.",
  },
];

export function FeaturesSection({
  openCode,
}: {
  openCode: (key: CodeKey) => void;
}) {
  return (
    <section className="relative py-20 sm:py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div
          role="button"
          tabIndex={0}
          aria-label="View code for the features section"
          onClick={() => openCode("features")}
          onKeyDown={onActivateKey(() => openCode("features"))}
          className="animate-initial:opacity-0 animate-initial:y-20 animate-inview:opacity-100 animate-inview:y-0 animate-duration-600 animate-ease-out animate-once text-center mb-12 sm:mb-16 cursor-pointer group/feat"
        >
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-acid/70 mb-4 block">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight group-hover/feat:text-acid/90 transition-colors">
            Everything you need
          </h2>
          <p className="mt-2 text-[11px] text-text-muted opacity-0 group-hover/feat:opacity-100 transition-opacity flex items-center gap-1 justify-center">
            <svg
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
              />
            </svg>
            Click to see code
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className={`animate-initial:opacity-0 animate-initial:y-15 animate-inview:opacity-100 animate-inview:y-0 animate-duration-500 ${i > 0 ? `animate-delay-${Math.min(i, 4) * 100}` : ""} animate-ease-out animate-once animate-hover:y--2 group rounded-2xl border border-border-subtle bg-surface-raised p-5 sm:p-6 transition-colors hover:border-acid/10`}
            >
              <div className="w-10 h-10 rounded-xl bg-acid/10 flex items-center justify-center mb-4">
                <svg
                  className="w-5 h-5 text-acid"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={f.icon}
                  />
                  {f.icon2 && (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d={f.icon2}
                    />
                  )}
                </svg>
              </div>
              <h3 className="text-sm font-semibold mb-2">{f.title}</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
