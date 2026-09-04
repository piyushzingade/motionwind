import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

const NAV_ITEMS = [
  { label: "Demos", href: "#demos" },
  { label: "How", href: "#how" },
  { label: "Features", href: "#features" },
  { label: "Syntax", href: "#syntax" },
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
    <header className="sticky top-0 z-200 bg-background/85 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
      <div className="mx-auto max-w-7xl flex items-center justify-between h-14 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
        <Link
          href="/"
          className="group flex items-center gap-2.5"
          aria-label="Motionwind home"
        >
          <span className="font-display text-xl italic tracking-[-0.02em] text-text-strong transition-colors group-hover:text-fg">
            motionwind
          </span>
          <span className="hidden text-[10px] text-text-muted font-[family-name:var(--font-mono)] sm:inline">
            / landing
          </span>
        </Link>
        <nav
          className="hidden md:flex items-center gap-1"
          aria-label="Main navigation"
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-md px-3 py-1.5 font-[family-name:var(--font-mono)] text-xs tracking-wide text-text-dim hover:text-text-strong hover:bg-surface-overlay transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="https://www.motionwind.xyz/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md px-3 py-1.5 font-[family-name:var(--font-mono)] text-xs tracking-wide text-text-dim hover:text-text-strong hover:bg-surface-overlay transition-colors"
          >
            Docs
          </Link>
        </nav>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="https://github.com/piyushzingade/motionwind"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-7 items-center gap-1.5 rounded-md border border-border-strong bg-surface-raised px-2.5 text-xs text-text-dim transition-colors hover:border-acid/20 hover:text-foreground"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3" aria-hidden="true">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 1.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            <svg viewBox="0 0 24 24" fill="#FFD700" className="h-3.5 w-3.5" aria-hidden="true">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span>Star</span>
            {starCount !== null && (
              <>
                <span className="h-3 w-px bg-border-strong" />
                <span>{starCount}</span>
              </>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
