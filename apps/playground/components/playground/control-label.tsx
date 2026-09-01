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
      className="mb-2 flex items-center justify-between font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.16em] text-[var(--color-fg-muted)]"
    >
      <span>{children}</span>
      {value ? (
        <span className="text-[var(--color-accent)]">{value}</span>
      ) : null}
    </label>
  );
}
