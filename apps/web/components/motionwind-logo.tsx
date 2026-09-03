/**
 * Motionwind logomark — three wind bars with progressive offset plus an
 * arrow accent. Renders in `currentColor` so it adapts to light/dark.
 */
export function MotionwindLogo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <polygon points="123,182  403,182  396,218  116,218" />
      <polygon points="181,238  401,238  394,274  174,274" opacity="0.78" />
      <polygon points="239,294  399,294  392,330  232,330" opacity="0.59" />
      <polygon points="415,188 439,200 415,212" />
    </svg>
  );
}
