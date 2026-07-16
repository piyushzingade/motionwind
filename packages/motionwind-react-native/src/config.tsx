import React, { createContext, useContext } from "react";
import type { MotionwindConfig } from "motionwind-core";

const MotionwindConfigContext = createContext<MotionwindConfig | undefined>(
  undefined,
);

export function MotionwindProvider({
  config,
  children,
}: {
  config: MotionwindConfig;
  children: React.ReactNode;
}) {
  return (
    <MotionwindConfigContext.Provider value={config}>
      {children}
    </MotionwindConfigContext.Provider>
  );
}

export function useMotionwindConfig(): MotionwindConfig | undefined {
  return useContext(MotionwindConfigContext);
}
