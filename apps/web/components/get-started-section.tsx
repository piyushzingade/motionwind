"use client";

import { Reveal } from "./reveal";

export function GetStartedSection() {
  return (
    <section
      id="start"
      className="section-anchor px-4 py-16 sm:px-6 sm:py-22 lg:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="max-w-2xl">
            <h2 className="text-balance text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">
              Up and running in{" "}
              <em className="font-display font-normal italic text-accent">
                30 seconds
              </em>
            </h2>
            <p className="mt-5 text-pretty text-base leading-relaxed text-fg-muted sm:text-lg">
              Add the package, wrap your framework config, and start writing
              motion classes.
            </p>
          </div>
        </Reveal>

        <Reveal y={20}>
          <div className="mt-8 w-full max-w-xl rounded-lg border border-border bg-surface-elevated px-5 py-3 font-[family-name:var(--font-mono)] text-sm text-fg sm:px-6">
            <span className="mr-4 text-accent">$</span>
            bun add motionwind-react
          </div>
        </Reveal>

        <Reveal y={28}>
          <div className="mt-8 flex flex-col gap-4 lg:flex-row">
            <FrameworkCard
              name="Next.js"
              filename="next.config.js"
              icon={<span className="text-sm font-semibold">N</span>}
              code={
                <>
                  <span className="text-accent/80">import</span> withMotionwind{" "}
                  <span className="text-accent/80">from</span>{" "}
                  <span className="syntax-string">{'"motionwind/next"'}</span>
                  {"\n"}
                  <span className="text-accent/80">export default</span>{" "}
                  withMotionwind(config)
                </>
              }
            />
            <FrameworkCard
              name="Vite"
              filename="vite.config.ts"
              icon={<span className="text-sm font-semibold">V</span>}
              code={
                <>
                  <span className="text-accent/80">import</span> motionwind{" "}
                  <span className="text-accent/80">from</span>{" "}
                  <span className="syntax-string">{'"motionwind/vite"'}</span>
                  {"\n"}
                  plugins: [motionwind(), react()]
                </>
              }
            />
          </div>
        </Reveal>

        <Reveal y={20} className="mt-8">
          <a
            href="https://www.motionwind.xyz/docs/getting-started"
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-fg px-5 py-3 text-sm font-semibold text-bg transition-colors hover:bg-fg-muted active:scale-[0.98]"
          >
            Read docs
          </a>
        </Reveal>
      </div>
    </section>
  );
}

function FrameworkCard({
  name,
  filename,
  icon,
  code,
}: {
  name: string;
  filename: string;
  icon: React.ReactNode;
  code: React.ReactNode;
}) {
  return (
    <article className="min-w-0 flex-1 overflow-hidden rounded-xl border border-border bg-surface-elevated text-left">
      <div className="flex items-center gap-2 border-b border-border-subtle px-4 py-3">
        <span className="flex h-5 w-5 items-center justify-center rounded-md border border-border text-fg-muted">
          {icon}
        </span>
        <span className="text-sm font-semibold text-fg">{name}</span>
        <span className="ml-auto font-[family-name:var(--font-mono)] text-[11px] text-code-muted">
          {filename}
        </span>
      </div>
      <pre className="overflow-x-auto px-4 py-4 font-[family-name:var(--font-mono)] text-[12px] leading-6 code-dim">
        <code>{code}</code>
      </pre>
    </article>
  );
}
