"use client";

import { FluidTexture } from "./fluid-texture";

type MotionwindFluidTextProps = {
  text?: string;
  color?: string;
  className?: string;
};

export function MotionwindFluidText({
  text = "MOTIONWIND",
  color,
  className,
}: MotionwindFluidTextProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute bottom-0 left-1/2 z-0 h-[clamp(7rem,17vw,20rem)] w-[min(145vw,1800px)] -translate-x-1/2 translate-y-[22%] overflow-hidden ${className ?? ""}`}
    >
      <FluidTexture color={color} maskText={text} className="block size-full" />
    </div>
  );
}
