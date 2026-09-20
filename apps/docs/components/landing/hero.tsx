import Link from "next/link";
import {
  ArrowRightIcon,
  GithubLogoIcon,
  StarIcon,
} from "@phosphor-icons/react/dist/ssr";
import { MotionStage } from "./motion-stage";
import { MintlifyLogo } from "./mintlify-logo";
import { OssProgramBadge } from "@repo/ui/oss-program-badge";

const formatStars = (count: number) =>
  count >= 1000
    ? `${(count / 1000).toFixed(1).replace(/\.0$/, "")}k`
    : String(count);

export function Hero({ starCount }: { starCount: number | null }) {
  return (
    <main className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-[var(--color-bg)] lg:h-[100dvh]">
      <section className="landing-hero-pad relative z-10 flex shrink-0 flex-col justify-center pb-12 pt-20 lg:h-full lg:w-[44%] lg:min-w-[420px] lg:py-0">
        <div className="flex w-full max-w-[460px] flex-col gap-7">
          <OssProgramBadge
            brand={
              <MintlifyLogo className="h-3.5 w-auto text-[var(--color-fg)]" />
            }
          />
          <h1 className="max-w-[12ch] text-4xl font-semibold leading-[1.04] tracking-[-0.045em] text-[var(--color-fg)] sm:text-5xl lg:text-[3.5rem]">
            Motion as utility classes.
          </h1>
          <p className="max-w-[42ch] text-[15px] leading-7 text-[var(--color-fg-muted)]">
            One animation language for React, Vue, JavaScript, and React Native.
            Compiled at build time.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/docs"
              className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg bg-[var(--color-accent)] px-5 text-sm font-semibold text-[var(--color-accent-fg)] no-underline transition-[background-color,transform] duration-150 ease-out hover:bg-[var(--color-accent-hover)] active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
            >
              Get started{" "}
              <ArrowRightIcon size={16} weight="bold" aria-hidden="true" />
            </Link>
            <a
              href="https://github.com/piyushzingade/motionwind"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-4 text-sm font-medium text-[var(--color-fg)] no-underline transition-[border-color,background-color,transform] duration-150 ease-out hover:border-[var(--color-fg-muted)] hover:bg-[var(--color-surface)] active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
            >
              <GithubLogoIcon size={17} weight="fill" aria-hidden="true" />
              GitHub
              <StarIcon
                size={14}
                weight="fill"
                className="text-[#ffd700]"
                aria-hidden="true"
              />
              {starCount !== null ? (
                <span className="font-[family-name:var(--font-mono)] text-xs tabular-nums text-[var(--color-fg-muted)]">
                  {formatStars(starCount)}
                </span>
              ) : null}
            </a>
          </div>
        </div>
      </section>
      <div className="landing-preview-wrap">
        <MotionStage className="absolute inset-0" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[var(--color-bg)] to-transparent lg:hidden"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 hidden w-[18%] bg-gradient-to-r from-[var(--color-bg)] to-transparent lg:block"
        />
      </div>
    </main>
  );
}
