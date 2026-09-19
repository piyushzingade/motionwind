import Link from "next/link";
import { ArrowUpRightIcon } from "@phosphor-icons/react";

type DownloadCTAProps = {
  className?: string;
};

export function DownloadCTA({ className = "" }: DownloadCTAProps) {
  return (
    <section
      aria-labelledby="download-cta-title"
      className={`relative aspect-square w-full max-w-[760px] overflow-hidden rounded-[28px] ${className}`}
      style={{
        backgroundColor:
          "color-mix(in srgb, var(--color-accent) 12%, var(--color-bg))",
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[-18%] bottom-[-20%] h-[82%] rounded-[50%] blur-[24px]"
        style={{
          background:
            "radial-gradient(ellipse at center, color-mix(in srgb, var(--color-accent) 96%, white) 0%, color-mix(in srgb, var(--color-accent) 76%, white) 27%, color-mix(in srgb, var(--color-accent) 42%, transparent) 52%, transparent 78%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[47%] h-[34%] w-[75%] -translate-x-1/2 opacity-25 [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]"
        style={{
          backgroundImage:
            "radial-gradient(circle, color-mix(in srgb, var(--color-fg) 34%, transparent) 1.5px, transparent 1.5px)",
          backgroundSize: "22px 22px",
        }}
      />
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-8 text-center sm:px-12">
        <h2
          id="download-cta-title"
          className="text-balance text-[clamp(2rem,5vw,3.4rem)] font-semibold leading-[1.05] tracking-[-0.045em] text-fg"
        >
          Ship motion that matters.
          <br />
          Start building today.
        </h2>
        <p className="mt-5 max-w-md text-pretty text-sm leading-relaxed text-fg-muted sm:text-base">
          Motion as utility classes, compiled for the frameworks you ship.
        </p>
        <Link
          href="https://www.motionwind.xyz/docs/getting-started"
          className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-[14px] bg-fg px-5 py-3 text-sm font-medium text-bg transition-[transform,opacity] duration-200 hover:opacity-85 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Start building
          <ArrowUpRightIcon size={16} weight="bold" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
