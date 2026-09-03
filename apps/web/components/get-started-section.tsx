"use client";

import { Typewriter } from "./typewriter";
import type { CodeKey } from "../lib/code-examples";
import { onActivateKey } from "../lib/on-activate-key";
import { SectionHeader } from "./section-header";

export function GetStartedSection({
  openCode,
}: {
  openCode: (key: CodeKey) => void;
}) {
  return (
    <section
      id="start"
      className="section-anchor relative py-20 sm:py-24 px-4 sm:px-6"
    >
      <div className="max-w-7xl mx-auto text-center">
        <div className="text-left">
          <SectionHeader
            index="05"
            eyebrow="Get Started"
            title={
              <>
                Up and running in{" "}
                <em className="font-display italic font-normal text-acid">
                  30 seconds
                </em>
              </>
            }
            lede="One command to install. One line to configure. Start animating immediately."
          />
        </div>

        <div className="animate-initial:opacity-0 animate-initial:y-15 animate-inview:opacity-100 animate-inview:y-0 animate-duration-500 animate-delay-200 animate-ease-out animate-once mt-10 sm:mt-12">
          <div className="inline-flex items-center gap-4 rounded-xl border border-border-strong bg-surface-raised/80 backdrop-blur-sm px-6 sm:px-8 py-4 shadow-lg shadow-black/20">
            <span className="text-acid/80 font-[family-name:var(--font-mono)] text-sm select-none">
              $
            </span>
            <code className="text-sm sm:text-[15px] font-[family-name:var(--font-mono)] text-foreground tracking-tight">
              <Typewriter text="npm i motionwind-react" />
            </code>
          </div>
        </div>

        <div className="animate-initial:opacity-0 animate-initial:y-15 animate-inview:opacity-100 animate-inview:y-0 animate-duration-500 animate-delay-300 animate-ease-out animate-once mt-8 sm:mt-10 grid sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
          <FrameworkCard
            name="Next.js"
            filename="next.config.js"
            icon={
              <svg
                className="w-4 h-4 text-text-dim"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 1-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 0 0-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 0 1-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 0 1-.157-.171l-.05-.106.006-4.703.007-4.705.072-.092a.645.645 0 0 1 .174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 0 0 4.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 0 0 2.466-2.163 11.944 11.944 0 0 0 2.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.86-8.292-8.208-9.695a12.597 12.597 0 0 0-2.499-.523A33.119 33.119 0 0 0 11.572 0zm4.069 7.217c.347 0 .408.005.486.047a.473.473 0 0 1 .237.277c.018.06.023 1.365.018 4.304l-.006 4.218-.744-1.14-.746-1.14v-3.066c0-1.982.01-3.097.023-3.15a.478.478 0 0 1 .233-.296c.096-.05.13-.054.5-.054z" />
              </svg>
            }
            code={
              <>
                <span className="text-acid/70">import</span>{" "}
                <span className="code-fg">withMotionwind</span>{" "}
                <span className="text-acid/70">from</span>{" "}
                <span className="syntax-string">{'"motionwind/next"'}</span>
                {"\n"}
                <span className="text-acid/70">export default</span>{" "}
                <span className="code-fg">withMotionwind</span>(config)
              </>
            }
            onClick={() => openCode("nextjs")}
          />
          <FrameworkCard
            name="Vite"
            filename="vite.config.ts"
            icon={
              <svg
                className="w-4 h-4 text-text-dim"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0L1.608 6v12L12 24l10.392-6V6L12 0zm-1.073 1.445h.001a1.8 1.8 0 0 1 2.138 0l7.534 4.35a1.794 1.794 0 0 1 .9 1.554v8.706c0 .641-.34 1.234-.9 1.554l-7.534 4.35a1.8 1.8 0 0 1-2.139 0l-7.534-4.35a1.794 1.794 0 0 1-.9-1.554V7.35c0-.642.34-1.234.9-1.554l7.534-4.35z" />
              </svg>
            }
            code={
              <>
                <span className="text-acid/70">import</span>{" "}
                <span className="code-fg">motionwind</span>{" "}
                <span className="text-acid/70">from</span>{" "}
                <span className="syntax-string">{'"motionwind/vite"'}</span>
                {"\n"}
                <span className="text-acid/70">plugins:</span> [
                <span className="code-fg">motionwind</span>(),{" "}
                <span className="code-fg">react</span>()]
              </>
            }
            onClick={() => openCode("vite")}
          />
        </div>

        <div className="animate-initial:opacity-0 animate-initial:y-15 animate-inview:opacity-100 animate-inview:y-0 animate-duration-500 animate-delay-400 animate-ease-out animate-once mt-12 sm:mt-14 flex gap-4 justify-center">
          <a
            href="https://www.motionwind.xyz/docs/getting-started"
            className="animate-hover:scale-105 animate-tap:scale-95 animate-spring group inline-flex items-center gap-2.5 rounded-xl bg-acid px-6 sm:px-8 py-3.5 text-sm font-semibold text-[var(--color-accent-fg)] transition-shadow hover:shadow-[0_0_30px_var(--acid-glow)]"
          >
            Read the Docs
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

function FrameworkCard({
  name,
  filename,
  icon,
  code,
  onClick,
}: {
  name: string;
  filename: string;
  icon: React.ReactNode;
  code: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`View the ${name} setup code`}
      onClick={onClick}
      onKeyDown={onActivateKey(onClick)}
      className="rounded-xl border border-border-strong bg-surface-raised overflow-hidden text-left cursor-pointer hover:border-acid/20 transition-colors"
    >
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border-subtle bg-surface-inset/40">
        {icon}
        <span className="text-xs font-semibold text-foreground">{name}</span>
        <span className="ml-auto text-[10px] text-text-muted font-[family-name:var(--font-mono)]">
          {filename}
        </span>
      </div>
      <pre className="px-4 py-4 text-[12px] leading-6 font-[family-name:var(--font-mono)] code-dim">
        <code>{code}</code>
      </pre>
    </div>
  );
}
