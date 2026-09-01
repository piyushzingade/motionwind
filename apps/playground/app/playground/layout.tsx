import type { ReactNode } from "react";
import { PlaygroundLayoutClient } from "@/components/playground-layout";

export default function Layout({ children }: { children: ReactNode }) {
  return <PlaygroundLayoutClient>{children}</PlaygroundLayoutClient>;
}
