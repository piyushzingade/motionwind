import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { Providers } from "./providers";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.motionwind.xyz"),
  title: "Motionwind — Motion animations as Tailwind classes",
  description:
    "Write Motion animations as Tailwind-like classes. A Babel plugin transforms them at build time — zero imports needed.",
  openGraph: {
    type: "website",
    siteName: "Motionwind",
    title: "Motionwind — Motion animations as Tailwind classes",
    description:
      "Write Motion animations as Tailwind-like classes. Zero imports, zero boilerplate, zero runtime overhead.",
    url: "https://www.motionwind.xyz",
    images: [
      {
        url: "https://www.motionwind.xyz/og.png",
        width: 1200,
        height: 630,
        alt: "Motionwind — Motion animations as Tailwind classes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Motionwind — Motion animations as Tailwind classes",
    description:
      "Write Motion animations as Tailwind-like classes. Zero imports, zero boilerplate, zero runtime overhead.",
    images: ["https://www.motionwind.xyz/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-[family-name:var(--font-geist-sans)] bg-surface text-foreground theme-fade antialiased`}
      >
        <Providers>
          {children}
          <div className="progressive-blur" aria-hidden="true">
            <div className="blur-layer blur-1" />
            <div className="blur-layer blur-2" />
            <div className="blur-layer blur-3" />
            <div className="blur-layer blur-4" />
            <div className="blur-layer blur-5" />
            <div className="blur-layer blur-6" />
          </div>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
