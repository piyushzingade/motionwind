"use client";

import { useState } from "react";
import {
  ArrowUpRightIcon,
  BracketsCurlyIcon,
  CheckIcon,
  CopyIcon,
  LightningIcon,
  TerminalWindowIcon,
} from "@phosphor-icons/react";
import { Reveal } from "./reveal";

export function GetStartedSection() {
  const [copied, setCopied] = useState(false);

  const copyCommand = async () => {
    try {
      await navigator.clipboard.writeText("bun add motionwind-react");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section
      id="start"
      className="section-anchor relative overflow-hidden px-4 py-24 sm:px-6 md:py-32 lg:py-40"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-border" />
      <div className="mx-auto grid max-w-[1120px] gap-14 lg:grid-cols-[0.76fr_1.24fr] lg:items-start lg:gap-24">
        <Reveal>
          <div className="max-w-xl">
            <p className="mb-6 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-accent">
              Start building
            </p>
            <h2 className="text-balance text-4xl font-semibold leading-[1.04] tracking-[-0.045em] sm:text-5xl md:text-6xl">
              Up and running in{" "}
              <em className="font-display font-normal italic text-accent">
                30 seconds
              </em>
            </h2>
            <p className="mt-6 max-w-md text-pretty text-base leading-relaxed text-fg-muted sm:text-lg">
              Add the package, wrap your framework config, and start writing
              motion classes.
            </p>
            <a
              href="https://www.motionwind.xyz/docs/getting-started"
              className="mt-8 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg bg-fg px-5 py-3 text-sm font-semibold text-bg transition-[background-color,transform] duration-150 ease-out hover:bg-fg-muted active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Read the guide
              <ArrowUpRightIcon size={16} weight="bold" aria-hidden="true" />
            </a>
          </div>
        </Reveal>

        <Reveal y={20}>
          <div className="overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-[0_24px_70px_-48px_var(--color-shadow)]">
            <div className="flex items-center justify-between border-b border-border-subtle px-5 py-4 sm:px-6">
              <div className="flex items-center gap-2 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.16em] text-code-muted">
                <TerminalWindowIcon
                  size={15}
                  className="text-accent"
                  aria-hidden="true"
                />
                Install
              </div>
              <span className="font-[family-name:var(--font-mono)] text-[10px] text-code-muted">
                package manager
              </span>
            </div>
            <div className="flex items-center justify-between gap-4 border-b border-border-subtle px-5 py-5 sm:px-6">
              <code className="min-w-0 truncate font-[family-name:var(--font-mono)] text-sm text-fg sm:text-base">
                <span className="mr-3 text-accent">$</span>
                bun add motionwind-react
              </code>
              <button
                type="button"
                onClick={copyCommand}
                aria-label={copied ? "Command copied" : "Copy install command"}
                className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-border text-code-muted transition-[background-color,color,transform] duration-150 ease-out hover:bg-surface hover:text-fg active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {copied ? (
                  <CheckIcon
                    size={17}
                    weight="bold"
                    className="text-accent"
                    aria-hidden="true"
                  />
                ) : (
                  <CopyIcon size={17} aria-hidden="true" />
                )}
              </button>
            </div>
            <div className="grid gap-px bg-border-subtle sm:grid-cols-2">
              <FrameworkCard
                name="Next.js"
                filename="next.config.js"
                icon={
                  <BracketsCurlyIcon
                    size={16}
                    weight="bold"
                    aria-hidden="true"
                  />
                }
                code={
                  <>
                    <span className="text-accent/80">import</span>{" "}
                    withMotionwind <span className="text-accent/80">from</span>{" "}
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
                icon={
                  <LightningIcon size={16} weight="fill" aria-hidden="true" />
                }
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
          </div>
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
