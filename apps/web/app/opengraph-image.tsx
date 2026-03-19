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
        {/* Crosshatch grid with radial mask */}
        <svg
          width="1200"
          height="630"
          style={{ position: "absolute", inset: 0 }}
        >
          <defs>
            <radialGradient id="fade" cx="50%" cy="45%" r="50%">
              <stop offset="0%" stopColor="white" stopOpacity="1" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
            <mask id="gridMask">
              <rect width="1200" height="630" fill="url(#fade)" />
            </mask>
          </defs>
          <g mask="url(#gridMask)">
            {Array.from({ length: 34 }, (_, i) => (
              <line
                key={`v${i}`}
                x1={i * 36}
                y1={0}
                x2={i * 36}
                y2={630}
                stroke="rgba(200,255,46,0.04)"
                strokeWidth="1"
              />
            ))}
            {Array.from({ length: 18 }, (_, i) => (
              <line
                key={`h${i}`}
                x1={0}
                y1={i * 36}
                x2={1200}
                y2={i * 36}
                stroke="rgba(200,255,46,0.04)"
                strokeWidth="1"
              />
            ))}
          </g>
        </svg>

        {/* Radial glow */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "20%",
            width: "60%",
            height: "60%",
            background:
              "radial-gradient(ellipse at center, rgba(200,255,46,0.05), transparent 70%)",
          }}
        />

        {/* Top accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "35%",
            width: "30%",
            height: "2px",
            background:
              "linear-gradient(90deg, transparent, #c8ff2e, transparent)",
          }}
        />

        {/* Logo mark */}
        <svg
          viewBox="0 0 512 512"
          fill="none"
          width={64}
          height={64}
          style={{ marginBottom: 28 }}
        >
          <polygon
            points="123,182 403,182 396,218 116,218"
            fill="#c8ff2e"
          />
          <polygon
            points="181,238 401,238 394,274 174,274"
            fill="#c8ff2e"
            opacity="0.75"
          />
          <polygon
            points="239,294 399,294 392,330 232,330"
            fill="#c8ff2e"
            opacity="0.52"
          />
          <polygon
            points="415,188 439,200 415,212"
            fill="#c8ff2e"
          />
        </svg>

        {/* Title */}
        <div
          style={{
            fontSize: 68,
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
            fontSize: 22,
            color: "#8a8a9a",
            marginTop: 16,
            letterSpacing: "-0.01em",
          }}
        >
          Motion animations as Tailwind classes
        </div>

        {/* Thin accent rule below tagline */}
        <div
          style={{
            width: 48,
            height: 1,
            marginTop: 28,
            background:
              "linear-gradient(90deg, transparent, rgba(200,255,46,0.3), transparent)",
          }}
        />

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: 36,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            padding: "0 100px",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: 80,
                height: 1,
                background:
                  "repeating-linear-gradient(90deg, #1e1e2a 0, #1e1e2a 5px, transparent 5px, transparent 9px)",
              }}
            />
            <span
              style={{
                fontSize: 10,
                color: "#5a5a6a",
                fontFamily: "monospace",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
              }}
            >
              zero-runtime animations
            </span>
            <div
              style={{
                width: 80,
                height: 1,
                background:
                  "repeating-linear-gradient(90deg, #1e1e2a 0, #1e1e2a 5px, transparent 5px, transparent 9px)",
              }}
            />
          </div>
          <span
            style={{
              fontSize: 10,
              color: "#5a5a6a",
              fontFamily: "monospace",
              letterSpacing: "0.05em",
            }}
          >
            motionwind.xyz
          </span>
        </div>

        {/* Corner markers */}
        <svg
          width="1200"
          height="630"
          style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        >
          <line x1="24" y1="24" x2="34" y2="24" stroke="rgba(200,255,46,0.15)" strokeWidth="1" />
          <line x1="24" y1="24" x2="24" y2="34" stroke="rgba(200,255,46,0.15)" strokeWidth="1" />
          <line x1="1166" y1="24" x2="1176" y2="24" stroke="rgba(200,255,46,0.15)" strokeWidth="1" />
          <line x1="1176" y1="24" x2="1176" y2="34" stroke="rgba(200,255,46,0.15)" strokeWidth="1" />
          <line x1="24" y1="606" x2="34" y2="606" stroke="rgba(200,255,46,0.15)" strokeWidth="1" />
          <line x1="24" y1="596" x2="24" y2="606" stroke="rgba(200,255,46,0.15)" strokeWidth="1" />
          <line x1="1166" y1="606" x2="1176" y2="606" stroke="rgba(200,255,46,0.15)" strokeWidth="1" />
          <line x1="1176" y1="596" x2="1176" y2="606" stroke="rgba(200,255,46,0.15)" strokeWidth="1" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
