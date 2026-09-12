"use client";

export function TocSvg({
  listH,
  pathD,
  totalLen,
  dashOff,
  scrollDir,
}: {
  listH: number;
  pathD: string;
  totalLen: number;
  dashOff: number;
  scrollDir: "down" | "up";
}) {
  return (
    <svg className="toc-svg" width={22} height={listH} aria-hidden="true">
      <defs>
        <linearGradient
          id="toc-accent-grad"
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1={scrollDir === "down" ? "0" : String(listH)}
          x2="0"
          y2={scrollDir === "down" ? String(listH) : "0"}
        >
          <stop
            offset="0%"
            stopColor="var(--color-accent)"
            stopOpacity="0.05"
          />
          <stop
            offset="40%"
            stopColor="var(--color-accent)"
            stopOpacity="0.3"
          />
          <stop
            offset="75%"
            stopColor="var(--color-accent)"
            stopOpacity="0.7"
          />
          <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="1" />
        </linearGradient>
      </defs>
      {pathD && (
        <path
          d={pathD}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {pathD && totalLen > 0 && (
        <path
          d={pathD}
          fill="none"
          stroke="url(#toc-accent-grad)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={totalLen}
          strokeDashoffset={dashOff}
          className="toc-path-fill"
        />
      )}
    </svg>
  );
}
