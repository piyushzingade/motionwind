"use client";

import { Reveal } from "./reveal";

export function GetStartedSection() {
  return (
    <section id="start" className="section-anchor px-4 py-16 sm:px-6 sm:py-22 lg:py-24">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
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
          <div className="mx-auto mt-8 w-fit rounded-lg border border-border bg-surface-elevated px-5 py-3 font-[family-name:var(--font-mono)] text-sm text-fg shadow-[0_18px_60px_-52px_var(--color-shadow)] sm:px-6">
            <span className="mr-4 text-accent">$</span>
            bun add motionwind-react
          </div>
        </Reveal>

        <Reveal y={28}>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
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

        <Reveal y={20} className="mt-8 flex justify-center">
          <a
            href="https://www.motionwind.xyz/docs/getting-started"
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-[var(--color-accent-fg)] transition-colors hover:bg-accent-hover active:scale-[0.98]"
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
    <article className="overflow-hidden rounded-xl border border-border bg-surface-elevated text-left shadow-[0_18px_60px_-52px_var(--color-shadow)]">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border-subtle">
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
