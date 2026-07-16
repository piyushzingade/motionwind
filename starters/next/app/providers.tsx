"use client";

import { MotionwindProvider } from "motionwind-react";
import motionwindConfig from "../motionwind.config";

export function Providers({ children }: { children: React.ReactNode }) {
  return <MotionwindProvider config={motionwindConfig}>{children}</MotionwindProvider>;
}
