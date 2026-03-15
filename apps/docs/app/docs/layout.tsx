import type { ReactNode } from "react";
import type { Metadata } from "next";
import { DocsLayoutClient } from "@/components/docs-layout";

export const metadata: Metadata = {
  openGraph: {
    type: "website",
    siteName: "Motionwind",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <DocsLayoutClient>{children}</DocsLayoutClient>;
}
