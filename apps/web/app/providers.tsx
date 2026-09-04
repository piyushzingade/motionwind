"use client";

import { ThemeProvider } from "next-themes";
import { LazyMotion, domAnimation } from "motion/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <LazyMotion features={domAnimation}>{children}</LazyMotion>
    </ThemeProvider>
  );
}
