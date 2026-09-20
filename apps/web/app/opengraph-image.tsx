import { ImageResponse } from "next/og";
import { MOTIONWIND_MARK_PATH } from "@repo/ui/motionwind-logo";

export const alt = "Motionwind — Motion animations as Tailwind classes";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0a0f",
          color: "#f0f0f0",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
          padding: "72px",
          width: "100%",
        }}
      >
        <div style={{ alignItems: "center", display: "flex", gap: 22 }}>
          <svg height="58" viewBox="0 0 220 100" width="128" fill="#c9ff33">
            <path d={MOTIONWIND_MARK_PATH} />
            <circle cx="198" cy="62" r="7" />
          </svg>
          <span
            style={{ fontSize: 34, fontWeight: 700, letterSpacing: "-0.04em" }}
          >
            Motionwind
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div
            style={{
              color: "#c9ff33",
              fontSize: 22,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
            }}
          >
            Motion for utility classes
          </div>
          <div
            style={{
              fontSize: 68,
              fontWeight: 700,
              letterSpacing: "-0.06em",
              lineHeight: 1.02,
            }}
          >
            Ship motion that matters.
          </div>
          <div style={{ color: "#a2a2b0", fontSize: 25 }}>
            Write animation intent. Compile it into production-ready Motion
            props.
          </div>
        </div>
        <div style={{ color: "#737383", fontSize: 20 }}>motionwind.xyz</div>
      </div>
    ),
    { ...size },
  );
}
