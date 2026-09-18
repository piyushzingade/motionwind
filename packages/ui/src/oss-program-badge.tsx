import type { ReactNode } from "react";

export function OssProgramBadge({ brand }: { brand: ReactNode }) {
  return (
    <span
      className="rounded-full border text-[var(--color-fg)]"
      style={{
        display: "inline-flex",
        width: "fit-content",
        alignItems: "center",
        gap: "10px",
        padding: "6px 20px 6px 16px",
        borderRadius: "9999px",
        borderColor: "var(--color-border)",
        backgroundColor:
          "color-mix(in srgb, var(--color-surface-elevated) 70%, transparent)",
        backdropFilter: "blur(8px)",
        fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
        fontSize: "16px",
        fontWeight: 400,
        lineHeight: 1.5,
      }}
    >
      <span style={{ color: "var(--color-fg-muted)" }}>Backed by</span>
      <span className="shrink-0">{brand}</span>
    </span>
  );
}
