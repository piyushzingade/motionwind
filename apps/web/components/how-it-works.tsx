"use client";

import { generateMotionCode } from "motionwind-react/tooling";
import { highlightCode } from "../lib/highlight";
import { Reveal } from "./reveal";

const sourceCode = `<button className="animate-hover:scale-105 animate-tap:scale-95 animate-spring rounded-lg px-5 py-3">
  Save changes
</button>`;

const outputCode = generateMotionCode(
  "button",
  "animate-hover:scale-105 animate-tap:scale-95 animate-spring rounded-lg px-5 py-3",
  {
    text: "Save changes",
    target: "react",
  },
);

const STEPS = [
  {
    number: "01",
    title: "Write classes",
    body: "Use Tailwind-like animation utilities directly where the interaction lives.",
    code: "animate-hover:scale-105",
  },
  {
    number: "02",
    title: "Compile to props",
    body: "The transform separates animation intent from static styling during build.",
    code: "whileHover={{ scale: 1.05 }}",
  },
  {
    number: "03",
    title: "Ship interaction",
    body: "Users get Motion components, not a class parser running in the browser.",
    code: "runtime parser: none",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how"
      className="section-anchor relative px-4 py-20 sm:px-6 sm:py-28 lg:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="mb-14 max-w-2xl">
            <h2 className="text-balance text-3xl font-semibold tracking-[-0.035em] text-fg sm:text-4xl md:text-5xl">
              Write classes. Compile props. Ship motion.
            </h2>
            <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-fg-muted sm:text-lg">
              Motionwind keeps authoring simple while leaving production output
              explicit, inspectable, and framework-ready.
            </p>
          </div>
        </Reveal>

        {/* Steps — vertical numbered list */}
        <Reveal y={18}>
          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <div
                key={step.number}
                className="relative rounded-2xl border border-border bg-surface-elevated p-5 transition-colors hover:border-accent/25"
              >
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 font-[family-name:var(--font-mono)] text-xs font-semibold text-accent">
                    {step.number}
                  </span>
                  {i < STEPS.length - 1 && (
                    <div className="absolute left-[calc(50%+24px)] top-9 hidden h-px w-[calc(100%-48px)] bg-gradient-to-r from-border to-transparent sm:block" />
                  )}
                </div>
                <h3 className="text-[15px] font-semibold text-fg">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">
                  {step.body}
                </p>
                <code className="mt-4 block truncate rounded-lg bg-code-bg px-3 py-2 font-[family-name:var(--font-mono)] text-[11px] text-accent/80">
                  {step.code}
                </code>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Code comparison — full width */}
        <Reveal y={22} delay={0.06}>
          <div className="overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-[0_32px_80px_-60px_var(--color-shadow)]">
            <div className="grid md:grid-cols-2">
              <CodePanel
                title="Source"
                filename="component.tsx"
                code={sourceCode}
              />
              <CodePanel
                title="Compiled"
                filename="motion-output.tsx"
                code={outputCode}
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function CodePanel({
  title,
  filename,
  code,
}: {
  title: string;
  filename: string;
  code: string;
}) {
  return (
    <div className="min-w-0 border-t border-border-subtle first:border-t-0 md:border-l md:border-t-0 md:first:border-l-0">
      <div className="flex items-center justify-between border-b border-border-subtle px-5 py-3">
        <span className="text-sm font-semibold text-fg">{title}</span>
        <span className="font-[family-name:var(--font-mono)] text-[10px] text-code-muted">
          {filename}
        </span>
      </div>
      <pre className="max-h-[360px] overflow-auto p-5 font-[family-name:var(--font-mono)] text-[11px] leading-6">
        <code>{highlightCode(code)}</code>
      </pre>
    </div>
  );
}
