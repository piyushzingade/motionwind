import type { ReactNode } from "react";

const links = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/sitemap.xml", label: "Sitemap" },
] as const;

export function LegalLinks({
  className = "",
  separator = "·",
}: {
  className?: string;
  separator?: ReactNode;
}) {
  return (
    <nav
      aria-label="Legal"
      className={`flex flex-wrap items-center gap-3 ${className}`}
    >
      {links.map((link, index) => (
        <span key={link.href} className="inline-flex items-center gap-3">
          {index > 0 ? (
            <span aria-hidden="true" className="text-current/40">
              {separator}
            </span>
          ) : null}
          <a
            href={link.href}
            className="cursor-pointer transition-opacity hover:opacity-70"
          >
            {link.label}
          </a>
        </span>
      ))}
    </nav>
  );
}
