import type { ReactNode } from "react";

export function ControlLabel({
  htmlFor,
  children,
  value,
}: {
  htmlFor: string;
  children: ReactNode;
  value?: ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-code-muted"
    >
      <span>{children}</span>
      {value ? <span className="text-accent">{value}</span> : null}
    </label>
  );
}
