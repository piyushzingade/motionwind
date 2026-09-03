"use client";

import { useMemo } from "react";
import type { CodeKey } from "../lib/code-examples";
import { onActivateKey } from "../lib/on-activate-key";
import { ArrowConnector } from "./arrow-connector";
import { SectionHeader } from "./section-header";

export function HowItWorks({ openCode }: { openCode: (key: CodeKey) => void }) {
  return (
    <section
      id="how"
      className="section-anchor relative py-20 sm:py-24 px-4 sm:px-6"
    >
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          index="02"
          eyebrow="How It Works"
          title="Build time, not runtime"
          lede="A Babel plugin reads your classes and emits optimized Motion components. Your users never pay for parsing."
        />

        <BeforeAfter openCode={openCode} />

        <ProcessSteps />
      </div>
    </section>
  );
}

function BeforeAfter({ openCode }: { openCode: (key: CodeKey) => void }) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="View the compiled output"
      onClick={() => openCode("compiled")}
      onKeyDown={onActivateKey(() => openCode("compiled"))}
      className="animate-initial:opacity-0 animate-initial:y-20 animate-inview:opacity-100 animate-inview:y-0 animate-duration-600 animate-ease-out animate-once relative grid md:grid-cols-[1fr_auto_1fr] gap-0 items-stretch cursor-pointer group/code"
    >
      <div className="absolute -top-8 right-0 text-[10px] text-text-muted opacity-0 group-hover/code:opacity-100 transition-opacity flex items-center gap-1">
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
        Click to see compiled output
      </div>

      <CodeBlock
        label="What you write"
        filename="source.tsx"
        code={
          <>
            <span className="code-comment">{"// No imports needed"}</span>
            {"\n"}
            <span className="code-dim">{"<"}</span>
            <span className="syntax-tag">{"div"}</span>
            {"\n"}
            {"  "}
            <span className="text-acid/80">{"className"}</span>
            <span className="code-dim">{"="}</span>
            <span className="syntax-string">{'"'}</span>
            {"\n"}
            {"    "}
            <span className="text-acid">{"animate-initial:opacity-0"}</span>
            {"\n"}
            {"    "}
            <span className="text-acid">{"animate-initial:y-20"}</span>
            {"\n"}
            {"    "}
            <span className="text-acid">{"animate-inview:opacity-100"}</span>
            {"\n"}
            {"    "}
            <span className="text-acid">{"animate-inview:y-0"}</span>
            {"\n"}
            {"    "}
            <span className="text-acid">{"animate-duration-500"}</span>
            {"\n"}
            {"    "}
            <span className="text-acid">{"animate-once"}</span>
            {"\n"}
            {"    "}
            <span className="code-dim">{"p-4 rounded-lg"}</span>
            {"\n"}
            {"  "}
            <span className="syntax-string">{'"'}</span>
            {"\n"}
            <span className="code-dim">{">"}</span>
            {"\n"}
            {"  Hello world"}
            {"\n"}
            <span className="code-dim">{"</"}</span>
            <span className="syntax-tag">{"div"}</span>
            <span className="code-dim">{">"}</span>
          </>
        }
      />

      <ArrowConnector />

      <CodeBlock
        label="What gets compiled"
        filename="output.js"
        code={
          <>
            <span className="code-comment">{"// Auto-injected by Babel"}</span>
            {"\n"}
            <span className="text-acid/80">{"import"}</span>
            {" { "}
            <span className="code-fg">{"motion"}</span>
            {" } "}
            <span className="text-acid/80">{"from"}</span>{" "}
            <span className="syntax-string">{'"motion/react"'}</span>
            {"\n\n"}
            <span className="code-dim">{"<"}</span>
            <span className="syntax-component">{"motion.div"}</span>
            {"\n"}
            {"  "}
            <span className="text-acid/80">{"className"}</span>
            <span className="code-dim">{"="}</span>
            <span className="syntax-string">{'"p-4 rounded-lg"'}</span>
            {"\n"}
            {"  "}
            <span className="text-acid/80">{"initial"}</span>
            <span className="code-dim">{"={"}</span>
            {"{ "}
            <span className="code-fg">{"opacity: 0, y: 20"}</span>
            {" }"}
            <span className="code-dim">{"}"}</span>
            {"\n"}
            {"  "}
            <span className="text-acid/80">{"whileInView"}</span>
            <span className="code-dim">{"={"}</span>
            {"{ "}
            <span className="code-fg">{"opacity: 1, y: 0"}</span>
            {" }"}
            <span className="code-dim">{"}"}</span>
            {"\n"}
            {"  "}
            <span className="text-acid/80">{"transition"}</span>
            <span className="code-dim">{"={"}</span>
            {"{ "}
            <span className="code-fg">{"duration: 0.5"}</span>
            {" }"}
            <span className="code-dim">{"}"}</span>
            {"\n"}
            {"  "}
            <span className="text-acid/80">{"viewport"}</span>
            <span className="code-dim">{"={"}</span>
            {"{ "}
            <span className="code-fg">{"once: true"}</span>
            {" }"}
            <span className="code-dim">{"}"}</span>
            {"\n"}
            <span className="code-dim">{">"}</span>
            {"\n"}
            {"  Hello world"}
            {"\n"}
            <span className="code-dim">{"</"}</span>
            <span className="syntax-component">{"motion.div"}</span>
            <span className="code-dim">{">"}</span>
          </>
        }
      />
    </div>
  );
}

function CodeBlock({
  label,
  filename,
  code,
}: {
  label: string;
  filename: string;
  code: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border-subtle bg-surface-raised overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle">
        <span className="text-xs font-medium text-acid">{label}</span>
        <span className="text-[10px] text-text-muted font-[family-name:var(--font-mono)]">
          {filename}
        </span>
      </div>
      <pre className="p-4 sm:p-5 text-[12px] sm:text-[13px] leading-7 font-[family-name:var(--font-mono)] overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function ProcessSteps() {
  const steps = useMemo(
    () => [
      {
        num: "1",
        title: "Write classes",
        desc: "Add motionwind classes to any element or component. No imports, no wrappers.",
        code: "animate-hover:scale-110",
        delay: "",
      },
      {
        num: "2",
        title: "Babel transforms",
        desc: "At build time, classes are parsed and converted to Motion component props.",
        code: "whileHover={{ scale: 1.1 }}",
        delay: "animate-delay-150",
      },
      {
        num: "3",
        title: "Ship zero overhead",
        desc: "Production bundle contains only optimized Motion components. No parser shipped.",
        code: "0kb runtime added",
        delay: "animate-delay-300",
      },
    ],
    [],
  );

  return (
    <div className="mt-12 sm:mt-16 grid sm:grid-cols-3 gap-6 sm:gap-4">
      {steps.map((step, i) => (
        <div
          key={step.num}
          className={`animate-initial:opacity-0 animate-initial:y-15 animate-inview:opacity-100 animate-inview:y-0 animate-duration-500 ${step.delay} animate-ease-out animate-once relative rounded-xl border border-border-subtle bg-surface-raised p-5 sm:p-6`}
        >
          {i < 2 && (
            <div className="hidden sm:block absolute top-1/2 -right-2 sm:-right-2 w-4 h-px bg-gradient-to-r from-acid/20 to-transparent z-10" />
          )}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg border border-acid/20 bg-acid/5 flex items-center justify-center text-acid text-xs font-bold font-[family-name:var(--font-mono)] shrink-0">
              {step.num}
            </div>
            <h3 className="text-sm font-semibold">{step.title}</h3>
          </div>
          <p className="text-xs text-text-muted leading-relaxed mb-3">
            {step.desc}
          </p>
          <div className="rounded-md bg-surface-inset border border-border-subtle px-3 py-2">
            <code className="text-[10px] font-[family-name:var(--font-mono)] text-acid/70">
              {step.code}
            </code>
          </div>
        </div>
      ))}
    </div>
  );
}
