import Link from "next/link";
import { ArrowUpRightIcon } from "@phosphor-icons/react";

type DownloadCTAProps = {
  className?: string;
};

export function DownloadCTA({ className = "" }: DownloadCTAProps) {
  return (
    <section
      aria-labelledby="download-cta-title"
<<<<<<< HEAD
      className={`download-cta-surface relative aspect-[4/3] w-full max-w-[760px] overflow-hidden rounded-[28px] sm:aspect-[16/9] ${className}`}
    >
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-8 text-center sm:px-12">
        <h2
          id="download-cta-title"
          className="download-cta-title text-balance text-[clamp(2rem,5vw,3.4rem)] font-semibold leading-[1.05] tracking-[-0.045em] text-black"
=======
      className={`relative aspect-[4/3] w-full max-w-[760px] overflow-hidden rounded-[28px] sm:aspect-[16/9] ${className}`}
      style={{
        backgroundColor: "#ffffff",
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[-18%] bottom-[-20%] h-[82%] rounded-[50%] blur-[24px]"
        style={{
          background:
            "radial-gradient(ellipse at center, var(--cta-glow-start) 0%, var(--cta-glow-mid) 27%, var(--cta-glow-soft) 52%, transparent 78%)",
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
          className="text-balance text-[clamp(2rem,5vw,3.4rem)] font-semibold leading-[1.05] tracking-[-0.045em] text-black"
>>>>>>> origin/codex/playground-ui-reliability
        >
          Ship motion that matters.
          <br />
          Start building today.
        </h2>
<<<<<<< HEAD
        <p className="download-cta-description mt-5 max-w-md text-pretty text-sm leading-relaxed text-black/65 sm:text-base">
=======
        <p className="mt-5 max-w-md text-pretty text-sm leading-relaxed text-black/65 sm:text-base">
>>>>>>> origin/codex/playground-ui-reliability
          Motion as utility classes, compiled for the frameworks you ship.
        </p>
        <Link
          href="https://www.motionwind.xyz/docs/getting-started"
<<<<<<< HEAD
          className="download-cta-button mt-8 inline-flex min-h-11 items-center gap-2 rounded-[14px] bg-[#0a0a0f] px-5 py-3 text-sm font-medium text-white transition-[transform,opacity] duration-200 hover:opacity-85 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
=======
          className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-[14px] bg-[#0a0a0f] px-5 py-3 text-sm font-medium text-white transition-[transform,opacity] duration-200 hover:opacity-85 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
>>>>>>> origin/codex/playground-ui-reliability
        >
          Start building
          <ArrowUpRightIcon size={16} weight="bold" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
