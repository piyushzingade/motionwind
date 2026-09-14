"use client";

export function TocSvg({ listH, pathD }: { listH: number; pathD: string }) {
  return (
    <svg className="toc-svg" width={22} height={listH} aria-hidden="true">
      {pathD && (
        <path
          d={pathD}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth="1.5"
          strokeDasharray="1 5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}
