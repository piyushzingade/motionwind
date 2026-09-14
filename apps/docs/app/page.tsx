import type { Metadata } from "next";
import { Hero } from "@/components/landing/hero";

export const metadata: Metadata = {
  title: "Motionwind — Motion animations as utility classes",
  description:
    "Motionwind is a shared Motion utility language for React, Vue, JavaScript, and React Native. Write animate-* classes that compile to Motion at build time with zero runtime overhead.",
  alternates: {
    canonical: "https://www.motionwind.xyz",
  },
  openGraph: {
    title: "Motionwind — Motion animations as utility classes",
    description:
      "Write Motion animations as Tailwind-like utility classes. Transformed at build time. Zero runtime overhead.",
    url: "https://www.motionwind.xyz",
    type: "website",
    images: [
      {
        url: "https://www.motionwind.xyz/og-docs.png",
        width: 1200,
        height: 630,
        alt: "Motionwind — Motion animations as utility classes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Motionwind — Motion animations as utility classes",
    description:
      "Write Motion animations as Tailwind-like utility classes. Transformed at build time. Zero runtime overhead.",
    images: ["https://www.motionwind.xyz/og-docs.png"],
  },
};

export const revalidate = 3600;

async function getGithubStars(): Promise<number | null> {
  try {
    const response = await fetch(
      "https://api.github.com/repos/piyushzingade/motionwind",
      {
        next: { revalidate: 3600 },
        headers: { Accept: "application/vnd.github+json" },
      },
    );
    if (!response.ok) return null;
    const data = (await response.json()) as { stargazers_count?: number };
    return typeof data.stargazers_count === "number"
      ? data.stargazers_count
      : null;
  } catch {
    return null;
  }
}

export default async function DocsHome() {
  return <Hero starCount={await getGithubStars()} />;
}
