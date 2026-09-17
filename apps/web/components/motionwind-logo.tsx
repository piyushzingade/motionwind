/** Motionwind ribbon mark. Renders in `currentColor` so it adapts to light/dark. */
export function MotionwindLogo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 220 100"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M16 72C37 72 52 42 73 26c16-12 30-8 37 8l11 24c5 11 15 12 22 2l8-11c10-14 27-10 30 5l6 27c-11-4-21-12-26-24-2-5-7-6-11-1l-9 12c-14 19-34 16-43-3L87 42c-4-8-11-8-18-2C50 57 40 79 16 72Z" />
      <circle cx="198" cy="62" r="7" />
    </svg>
  );
}
