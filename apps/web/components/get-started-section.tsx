"use client";

import { useState } from "react";
import {
  ArrowUpRightIcon,
  CheckIcon,
  CopyIcon,
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
      <div className="mx-auto flex max-w-[1120px] flex-col items-center gap-12">
        <Reveal>
          <div className="max-w-3xl text-center">
            <p className="mb-6 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-accent">
              Start building
            </p>
            <h2 className="mx-auto max-w-4xl text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-6xl md:text-7xl">
              Up and running in{" "}
              <em className="font-sans font-normal italic text-accent">
                30 seconds
              </em>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-fg-muted sm:text-lg">
              Add the package, wrap your framework config, and start writing
              motion classes.
            </p>
            <a
              href="https://www.motionwind.xyz/docs/getting-started"
              className="mt-8 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-md bg-fg px-5 py-3 text-sm font-semibold text-bg transition-[background-color,transform] duration-150 ease-out hover:bg-fg-muted active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Read the guide
              <ArrowUpRightIcon size={16} weight="bold" aria-hidden="true" />
            </a>
          </div>
        </Reveal>

        <Reveal y={20}>
          <div className="w-full max-w-4xl overflow-hidden rounded-xl border border-border bg-surface">
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
                className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-md border border-border text-code-muted transition-[background-color,color,transform] duration-150 ease-out hover:bg-surface-elevated hover:text-fg active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
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
            <div className="grid-flow-dense grid gap-3 bg-surface p-4 sm:grid-cols-2 sm:p-5">
              <FrameworkCard
                name="Next.js"
                filename="next.config.js"
                icon={<NextLogo />}
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
                name="React"
                filename="motionwind.config.ts"
                icon={<ReactLogo />}
                code={
                  <>
                    <span className="text-accent/80">import</span> motionwind{" "}
                    <span className="text-accent/80">from</span>{" "}
                    <span className="syntax-string">
                      {'"motionwind/react"'}
                    </span>
                    {"\n"}
                    <span className="text-accent/80">export default</span>{" "}
                    motionwind()
                  </>
                }
              />
              <FrameworkCard
                name="Vue"
                filename="vite.config.ts"
                icon={<VueLogo />}
                code={
                  <>
                    <span className="text-accent/80">import</span> motionwind{" "}
                    <span className="text-accent/80">from</span>{" "}
                    <span className="syntax-string">{'"motionwind/vue"'}</span>
                    {"\n"}
                    plugins: [motionwind()]
                  </>
                }
              />
              <FrameworkCard
                name="JavaScript"
                filename="motionwind.config.js"
                icon={<JavaScriptLogo />}
                code={
                  <>
                    <span className="text-accent/80">import</span> motionwind{" "}
                    <span className="text-accent/80">from</span>{" "}
                    <span className="syntax-string">{'"motionwind"'}</span>
                    {"\n"}
                    motionwind()
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
    <article className="min-w-0 flex-1 overflow-hidden rounded-lg border border-border bg-surface-elevated text-left">
      <div className="flex items-center gap-2 border-b border-border-subtle px-4 py-3">
        <span className="flex h-6 w-6 items-center justify-center rounded-md border border-border bg-surface text-fg-muted">
          {icon}
        </span>
        <span className="text-sm font-semibold text-fg">{name}</span>
        <span className="ml-auto font-[family-name:var(--font-mono)] text-[11px] text-code-muted">
          {filename}
        </span>
      </div>
      <pre className="code-scrollbar-hidden overflow-x-auto px-4 py-4 font-[family-name:var(--font-mono)] text-[12px] leading-6 code-dim">
        <code>{code}</code>
      </pre>
    </article>
  );
}

function NextLogo() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      <path
        d="M8 7.5v9M8 7.5l8 9m0-9v9"
        fill="none"
        stroke="var(--color-surface)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function ReactLogo() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-4 text-[#61dafb]"
      aria-hidden="true"
    >
      <ellipse
        cx="12"
        cy="12"
        rx="9.5"
        ry="3.7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <ellipse
        cx="12"
        cy="12"
        rx="9.5"
        ry="3.7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        transform="rotate(60 12 12)"
      />
      <ellipse
        cx="12"
        cy="12"
        rx="9.5"
        ry="3.7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        transform="rotate(120 12 12)"
      />
      <circle cx="12" cy="12" r="1.7" fill="currentColor" />
    </svg>
  );
}

function VueLogo() {
  return (
    <svg
      viewBox="0 0 24 22"
      className="size-4 text-[#42b883]"
      aria-hidden="true"
    >
      <path d="M1 2h5l6 10 6-10h5L12 20 1 2Z" fill="currentColor" />
      <path d="M6 2h3l3 5 3-5h3l-6 10L6 2Z" fill="var(--color-surface)" />
    </svg>
  );
}

function JavaScriptLogo() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <rect width="24" height="24" rx="3" fill="#f7df1e" />
      <path
        d="M13.2 17.8c.5.8 1.2 1.2 2.1 1.2 1 0 1.6-.5 1.6-1.1 0-.7-.6-.9-1.7-1.4l-.6-.3c-1.7-.7-2.8-1.5-2.8-3.3 0-1.6 1.2-2.8 3.2-2.8 1.4 0 2.4.5 3.1 1.8l-1.7 1.1c-.4-.7-.8-.9-1.4-.9-.6 0-1 .3-1 .8 0 .6.4.8 1.4 1.2l.6.3c2 .9 3.1 1.7 3.1 3.5 0 2-1.6 3.1-3.8 3.1-2.1 0-3.4-1-4.1-2.3l2-.9Zm-7.1.2c.4.7.8 1.3 1.8 1.3.9 0 1.4-.5 1.4-1.7V10.2h2.2v7.4c0 2.2-1.3 3.4-3.5 3.4-1.9 0-3-.9-3.7-2l1.8-1Z"
        fill="#111"
      />
    </svg>
  );
}
