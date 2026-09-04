"use client";

import { useMemo } from "react";
import { ArrowConnector } from "./arrow-connector";
import { SectionHeader } from "./section-header";
import { Reveal } from "./reveal";

export function HowItWorks() {
  return (
    <section
      id="how"
      className="section-anchor relative py-20 sm:py-28 px-4 sm:px-6"
    >
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <SectionHeader
            label="Why Motionwind"
            title="The convenience stays in development."
            lede="A build transform reads your animation classes and emits Motion props. The work happens before your code reaches the browser."
          />
        </Reveal>

        <Reveal y={32}>
          <BeforeAfter />
        </Reveal>

        <ProcessSteps />
      </div>
    </section>
  );
}

function BeforeAfter() {
  return (
    <div className="grid items-stretch gap-4 md:grid-cols-[1fr_auto_1fr] md:gap-0">
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
            <span className="text-accent/80">{"className"}</span>
            <span className="code-dim">{"="}</span>
            <span className="syntax-string">{'"'}</span>
            {"\n"}
            {"    "}
            <span className="text-accent">{"animate-initial:opacity-0"}</span>
            {"\n"}
            {"    "}
            <span className="text-accent">{"animate-initial:y-20"}</span>
            {"\n"}
            {"    "}
            <span className="text-accent">{"animate-inview:opacity-100"}</span>
            {"\n"}
            {"    "}
            <span className="text-accent">{"animate-inview:y-0"}</span>
            {"\n"}
            {"    "}
            <span className="text-accent">{"animate-duration-500"}</span>
            {"\n"}
            {"    "}
            <span className="text-accent">{"animate-once"}</span>
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
            <span className="text-accent/80">{"import"}</span>
            {" { "}
            <span className="code-fg">{"motion"}</span>
            {" } "}
            <span className="text-accent/80">{"from"}</span>{" "}
            <span className="syntax-string">{'"motion/react"'}</span>
            {"\n\n"}
            <span className="code-dim">{"<"}</span>
            <span className="syntax-component">{"motion.div"}</span>
            {"\n"}
            {"  "}
            <span className="text-accent/80">{"className"}</span>
            <span className="code-dim">{"="}</span>
            <span className="syntax-string">{'"p-4 rounded-lg"'}</span>
            {"\n"}
            {"  "}
            <span className="text-accent/80">{"initial"}</span>
            <span className="code-dim">{"={"}</span>
            {"{ "}
            <span className="code-fg">{"opacity: 0, y: 20"}</span>
            {" }"}
            <span className="code-dim">{"}"}</span>
            {"\n"}
            {"  "}
            <span className="text-accent/80">{"whileInView"}</span>
            <span className="code-dim">{"={"}</span>
            {"{ "}
            <span className="code-fg">{"opacity: 1, y: 0"}</span>
            {" }"}
            <span className="code-dim">{"}"}</span>
            {"\n"}
            {"  "}
            <span className="text-accent/80">{"transition"}</span>
            <span className="code-dim">{"={"}</span>
            {"{ "}
            <span className="code-fg">{"duration: 0.5"}</span>
            {" }"}
            <span className="code-dim">{"}"}</span>
            {"\n"}
            {"  "}
            <span className="text-accent/80">{"viewport"}</span>
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
    <div className="rounded-xl border border-border-subtle bg-surface-elevated overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle">
        <span className="text-xs font-medium text-accent">{label}</span>
        <span className="text-[10px] text-code-muted font-[family-name:var(--font-mono)]">
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
        <Reveal key={step.num} delay={i * 0.08}>
          <div className="border-t border-border pt-5 sm:pt-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-accent text-sm font-[family-name:var(--font-mono)] shrink-0">
                {step.num}
              </div>
              <h3 className="text-sm font-semibold">{step.title}</h3>
            </div>
            <p className="text-xs text-code-muted leading-relaxed mb-3">
              {step.desc}
            </p>
            <div className="rounded-md bg-code-header border border-border-subtle px-3 py-2">
              <code className="text-[10px] font-[family-name:var(--font-mono)] text-accent/70">
                {step.code}
              </code>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
