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
    title: "Write classes",
    body: "Use Tailwind-like animation utilities directly where the interaction lives.",
    code: "animate-hover:scale-105",
  },
  {
    title: "Compile to props",
    body: "The transform separates animation intent from static styling during build.",
    code: "whileHover={{ scale: 1.05 }}",
  },
  {
    title: "Ship interaction",
    body: "Users get Motion components, not a class parser running in the browser.",
    code: "runtime parser: none",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how"
      className="section-anchor relative px-4 py-16 sm:px-6 sm:py-22 lg:py-24"
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

        <Reveal y={18}>
          <div className="border-y border-border">
            {STEPS.map((step) => (
              <div
                key={step.title}
                className="flex flex-col gap-4 border-b border-border py-6 last:border-b-0 md:flex-row md:items-start md:justify-between"
              >
                <div className="max-w-xl">
                  <h3 className="text-lg font-semibold tracking-[-0.02em] text-fg">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                    {step.body}
                  </p>
                </div>
                <code className="w-full shrink-0 rounded-md border border-border bg-code-bg px-3 py-2 font-[family-name:var(--font-mono)] text-[11px] text-accent/80 md:w-64">
                  {step.code}
                </code>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal y={22} delay={0.06}>
          <div className="mt-8 overflow-hidden rounded-xl border border-border bg-surface-elevated">
            <div className="flex flex-col md:flex-row">
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
    <div className="min-w-0 flex-1 border-t border-border-subtle first:border-t-0 md:border-l md:border-t-0 md:first:border-l-0">
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
