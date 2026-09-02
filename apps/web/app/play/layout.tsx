import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Motion Studio — Interactive Animation Playground",
  description:
    "Design and preview Motionwind animations live. Write Tailwind-like utility classes and see production-ready Motion code instantly.",
  alternates: {
    canonical: "https://web.motionwind.xyz/play",
  },
  openGraph: {
    title: "Motion Studio — Interactive Animation Playground",
    description:
      "Design and preview Motionwind animations live. Write Tailwind-like utility classes and see production-ready Motion code instantly.",
    url: "https://web.motionwind.xyz/play",
    type: "website",
    siteName: "Motionwind",
    images: [
      {
        url: "https://www.motionwind.xyz/og.png",
        width: 1200,
        height: 630,
        alt: "Motion Studio — Interactive Animation Playground",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Motion Studio — Interactive Animation Playground",
    description:
      "Design and preview Motionwind animations live. Write Tailwind-like utility classes and see production-ready Motion code instantly.",
    images: ["https://www.motionwind.xyz/og.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PlayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
