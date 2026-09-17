import Link from "next/link";
// NOTE: async Server Component — icons must come from the SSR build.
// The main entry calls createContext/forwardRef at module scope, which
// resolves against react-server here and crashes the build (same convention
// as the docs landing hero).
import { GithubLogoIcon, StarIcon } from "@phosphor-icons/react/dist/ssr";
import { MotionwindLogo } from "@repo/ui/motionwind-logo";
import { ThemeToggle } from "./theme-toggle";

const NAV_ITEMS = [
  { label: "Demos", href: "#demos" },
  { label: "How", href: "#how" },
];

async function getStarCount(): Promise<number | null> {
  try {
    const response = await fetch(
      "https://api.github.com/repos/piyushzingade/motionwind",
      { next: { revalidate: 3600 } },
    );
    const data = (await response.json()) as { stargazers_count?: unknown };
    return typeof data.stargazers_count === "number"
      ? data.stargazers_count
      : null;
  } catch {
    return null;
  }
}

export async function Header() {
  const starCount = await getStarCount();

  return (
    <header className="sticky top-0 z-200 bg-bg/85 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
      <div className="mx-auto flex h-14 max-w-[1120px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="group flex cursor-pointer items-center gap-2"
            aria-label="Motionwind home"
          >
            <MotionwindLogo className="size-5 text-accent" />
            <span className="font-sans text-[15px] font-semibold tracking-[-0.03em] text-fg transition-colors">
              motionwind
            </span>
          </Link>
          <nav
            className="hidden md:flex items-center gap-1"
            aria-label="Main navigation"
          >
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="cursor-pointer rounded-md px-3 py-1.5 font-[family-name:var(--font-mono)] text-xs tracking-wide text-fg-muted transition-colors hover:bg-surface hover:text-fg"
              >
                {item.label}
              </a>
            ))}
            <a
              href="https://www.motionwind.xyz/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer rounded-md px-3 py-1.5 font-[family-name:var(--font-mono)] text-xs tracking-wide text-fg-muted transition-colors hover:bg-surface hover:text-fg"
            >
              Docs
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="https://github.com/piyushzingade/motionwind"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-md border border-border bg-surface-elevated px-2.5 text-xs text-fg-muted transition-colors hover:border-accent/20 hover:text-fg"
          >
            <span>GitHub</span>
            <GithubLogoIcon
              aria-hidden="true"
              className="size-3.5 text-fg-muted"
              weight="fill"
            />
            <StarIcon
              aria-hidden="true"
              className="size-3.5 text-accent"
              weight="fill"
            />
            {starCount !== null && (
              <>
                <span className="h-3 w-px bg-border" />
                <span>{starCount}</span>
              </>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
