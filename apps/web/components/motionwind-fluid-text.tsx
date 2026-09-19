"use client";

import { FluidTexture } from "./fluid-texture";

type MotionwindFluidTextProps = {
  text?: string;
  color?: string;
  className?: string;
};

function maskForText(text: string) {
  const safeText = text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 220"><rect width="1000" height="220" fill="black"/><text x="500" y="172" text-anchor="middle" textLength="920" lengthAdjust="spacingAndGlyphs" font-family="Inter, Arial, sans-serif" font-size="170" font-weight="900" fill="white">${safeText}</text></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

export function MotionwindFluidText({
  text = "MOTIONWIND",
  color = "#22c55e",
  className,
}: MotionwindFluidTextProps) {
  const mask = maskForText(text);
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute bottom-0 left-1/2 z-0 h-[clamp(7rem,17vw,20rem)] w-[min(145vw,1800px)] -translate-x-1/2 translate-y-[22%] overflow-hidden ${className ?? ""}`}
      style={{
        maskImage: mask,
        maskPosition: "center",
        maskRepeat: "no-repeat",
        maskSize: "100% 100%",
        WebkitMaskImage: mask,
        WebkitMaskPosition: "center",
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskSize: "100% 100%",
      }}
    >
      <FluidTexture color={color} className="block size-full" />
    </div>
  );
}
