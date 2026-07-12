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

/** Fetch the repo star count server-side (cached for an hour) so the header
 * badge doesn't rely on a client `useEffect` fetch that can race or double-fire. */
async function getStarCount(): Promise<number | null> {
  try {
    const res = await fetch(
      "https://api.github.com/repos/piyushzingade/motionwind",
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return null;
    const data = await res.json();
    return typeof data.stargazers_count === "number"
      ? data.stargazers_count
      : null;
  } catch {
    return null;
  }
}

export default async function Layout({ children }: { children: ReactNode }) {
  const starCount = await getStarCount();
  return (
    <DocsLayoutClient starCount={starCount}>{children}</DocsLayoutClient>
  );
}
