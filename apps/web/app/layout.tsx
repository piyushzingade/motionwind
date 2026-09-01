import type { Metadata } from "next";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Providers } from "./providers";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
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
        className={`${instrumentSerif.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased`}
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
