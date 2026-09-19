"use client";

import type { HTMLAttributes } from "react";
import { FluidTexture } from "./fluid-texture";

type FluidOrbProps = HTMLAttributes<HTMLDivElement> & {
  size?: number | string;
  color?: string;
};

export function FluidOrb({
  size = 240,
  color = "#22c55e",
  className,
  style,
  ...props
}: FluidOrbProps) {
  return (
    <div
      {...props}
      className={`overflow-hidden rounded-full ${className ?? ""}`}
      style={{ width: size, height: size, ...style }}
    >
      <FluidTexture color={color} className="block size-full" />
    </div>
  );
}
