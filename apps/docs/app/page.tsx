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

export default function DocsHome() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Hero />
    </div>
  );
}
