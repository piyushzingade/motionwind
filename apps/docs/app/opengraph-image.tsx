import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Motionwind — Motion animations as Tailwind classes";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0f",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Dot grid background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle, rgba(200,255,46,0.04) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Top accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "40%",
            height: "2px",
            background:
              "linear-gradient(90deg, transparent, #c8ff2e, transparent)",
          }}
        />

        {/* Logo mark */}
        <svg
          viewBox="0 0 512 512"
          fill="none"
          width={72}
          height={72}
          style={{ marginBottom: 28 }}
        >
          <polygon
            points="123,182 403,182 396,218 116,218"
            fill="#c8ff2e"
          />
          <polygon
            points="181,238 401,238 394,274 174,274"
            fill="#c8ff2e"
            opacity="0.78"
          />
          <polygon
            points="239,294 399,294 392,330 232,330"
            fill="#c8ff2e"
            opacity="0.59"
          />
          <polygon
            points="415,188 439,200 415,212"
            fill="#c8ff2e"
          />
        </svg>

        {/* Title */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "#f0f0f0",
            fontStyle: "italic",
            letterSpacing: "-0.03em",
            lineHeight: 1,
          }}
        >
          motionwind
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 24,
            color: "#8a8a9a",
            marginTop: 16,
            letterSpacing: "-0.01em",
          }}
        >
          Motion animations as Tailwind classes
        </div>

        {/* Bottom dashed line */}
        <div
          style={{
            position: "absolute",
            bottom: 60,
            display: "flex",
            gap: 8,
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 120,
              height: 1,
              background:
                "repeating-linear-gradient(90deg, #1e1e2a 0, #1e1e2a 6px, transparent 6px, transparent 10px)",
            }}
          />
          <span
            style={{
              fontSize: 13,
              color: "#5a5a6a",
              fontFamily: "monospace",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
            }}
          >
            docs
          </span>
          <div
            style={{
              width: 120,
              height: 1,
              background:
                "repeating-linear-gradient(90deg, #1e1e2a 0, #1e1e2a 6px, transparent 6px, transparent 10px)",
            }}
          />
        </div>
      </div>
    ),
    { ...size },
  );
}
