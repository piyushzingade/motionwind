import type { SVGProps } from "react";

export const MOTIONWIND_MARK_PATH =
  "M16 72C37 72 52 42 73 26c16-12 30-8 37 8l11 24c5 11 15 12 22 2l8-11c10-14 27-10 30 5l6 27c-11-4-21-12-26-24-2-5-7-6-11-1l-9 12c-14 19-34 16-43-3L87 42c-4-8-11-8-18-2C50 57 40 79 16 72Z";

export function MotionwindLogo({
  className,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 220 100"
      fill="currentColor"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d={MOTIONWIND_MARK_PATH} />
      <circle cx="198" cy="62" r="7" />
    </svg>
  );
}

export function MotionwindHorizontalLogo({
  className,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 650 180"
      fill="currentColor"
      className={className}
      role="img"
      aria-label="Motionwind"
      {...props}
    >
      <g
        transform="translate(20 48) scale(.7)"
        fill="var(--color-accent, #c6f82f)"
      >
        <path d={MOTIONWIND_MARK_PATH} />
        <circle cx="198" cy="62" r="7" />
      </g>
      <text
        x="250"
        y="112"
        fontFamily="Inter, Geist, ui-sans-serif, sans-serif"
        fontWeight="700"
        fontSize="67"
        letterSpacing="-3.5"
      >
        motionwind
      </text>
    </svg>
  );
}
