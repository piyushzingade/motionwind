import Link from "next/link";
import { GithubIcon } from "@repo/ui/github-icon";
import { MotionwindHorizontalLogo } from "@repo/ui/motionwind-logo";
import { ThemeToggle } from "./theme-toggle";

const NAV_ITEMS = [{ label: "Demos", href: "#demos" }];

export async function Header() {
  return (
    <header className="sticky top-4 z-200 px-4 sm:px-6">
      <div className="relative mx-auto flex h-14 max-w-[1120px] items-center justify-between gap-3">
        <div className="flex min-w-0 items-center">
          <Link
            href="/"
            className="group flex h-12 cursor-pointer items-center rounded-full border border-border bg-surface-elevated px-5 shadow-[0_16px_40px_-24px_var(--color-shadow)] transition-colors hover:border-accent/30"
            aria-label="Motionwind home"
          >
            <MotionwindHorizontalLogo className="h-8 w-32 text-fg sm:h-9 sm:w-36" />
          </Link>
          <nav
            className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full border border-border bg-surface-elevated px-3 py-2 shadow-[0_16px_40px_-24px_var(--color-shadow)] md:flex"
            aria-label="Main navigation"
          >
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="cursor-pointer rounded-full px-4 py-2 font-[family-name:var(--font-mono)] text-xs tracking-wide text-fg-muted transition-colors hover:bg-surface hover:text-fg"
              >
                {item.label}
              </a>
            ))}
            <a
              href="https://www.motionwind.xyz/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer rounded-full px-4 py-2 font-[family-name:var(--font-mono)] text-xs tracking-wide text-fg-muted transition-colors hover:bg-surface hover:text-fg"
            >
              Docs
            </a>
          </nav>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <Link
            href="https://github.com/piyushzingade/motionwind"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open Motionwind on GitHub"
            title="Open Motionwind on GitHub"
            className="inline-flex size-12 cursor-pointer items-center justify-center rounded-full border border-border bg-surface-elevated text-fg-muted shadow-[0_16px_40px_-24px_var(--color-shadow)] transition-colors hover:border-accent/20 hover:text-fg"
          >
            <GithubIcon className="size-5 text-fg" />
          </Link>
          <div className="flex size-12 items-center justify-center rounded-full border border-border bg-surface-elevated shadow-[0_16px_40px_-24px_var(--color-shadow)]">
            <ThemeToggle className="size-8 rounded-full border-0 bg-transparent shadow-none" />
          </div>
        </div>
      </div>
    </header>
  );
}
