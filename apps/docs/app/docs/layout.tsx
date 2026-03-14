import type { ReactNode } from "react";
import { DocsLayoutClient } from "@/components/docs-layout";

export default function Layout({ children }: { children: ReactNode }) {
  return <DocsLayoutClient>{children}</DocsLayoutClient>;
}
