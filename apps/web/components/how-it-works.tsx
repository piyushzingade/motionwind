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

export function HowItWorks() {
  return (
    <section
      id="how"
      className="section-anchor relative px-4 py-16 sm:px-6 sm:py-22 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="mb-8 max-w-2xl sm:mb-10">
            <h2 className="text-balance text-3xl font-semibold tracking-[-0.035em] text-fg sm:text-4xl md:text-5xl">
              Write classes. Compile props. Ship motion.
            </h2>
            <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-fg-muted sm:text-lg">
              Motionwind keeps authoring simple while leaving production output
              explicit, inspectable, and framework-ready.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
          <Reveal y={24}>
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              <PrincipleCard
                title="Write classes"
                body="Use Tailwind-like animation utilities directly where the interaction lives."
                code="animate-hover:scale-105"
              />
              <PrincipleCard
                title="Compile to props"
                body="The transform separates animation intent from static styling during build."
                code="whileHover={{ scale: 1.05 }}"
              />
              <PrincipleCard
                title="Ship interaction"
                body="Users get Motion components, not a class parser running in the browser."
                code="runtime parser: none"
              />
            </div>
          </Reveal>

          <Reveal y={24} delay={0.08}>
            <div className="grid overflow-hidden rounded-[1.4rem] border border-border bg-surface-elevated shadow-[0_24px_80px_-60px_var(--color-shadow)] md:grid-cols-2">
              <CodePanel title="Source" filename="component.tsx" code={sourceCode} />
              <CodePanel title="Compiled" filename="motion-output.tsx" code={outputCode} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function PrincipleCard({
  title,
  body,
  code,
}: {
  title: string;
  body: string;
  code: string;
}) {
  return (
    <article className="rounded-xl border border-border bg-surface-elevated p-5 shadow-[0_18px_60px_-52px_var(--color-shadow)]">
      <h3 className="text-sm font-semibold text-fg">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-fg-muted">{body}</p>
      <code className="mt-4 block truncate rounded-md bg-code-bg px-3 py-2 font-[family-name:var(--font-mono)] text-[11px] text-accent/80">
        {code}
      </code>
    </article>
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
      <div className="flex items-center justify-between border-b border-border-subtle px-4 py-3">
        <span className="text-sm font-semibold text-fg">{title}</span>
        <span className="font-[family-name:var(--font-mono)] text-[10px] text-code-muted">
          {filename}
        </span>
      </div>
      <pre className="max-h-[360px] overflow-auto p-4 font-[family-name:var(--font-mono)] text-[11px] leading-6">
        <code>{highlightCode(code)}</code>
      </pre>
    </div>
  );
}
