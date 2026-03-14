import type { Metadata } from "next";
import {
  Instrument_Serif,
  Inter,
  JetBrains_Mono,
} from "next/font/google";
import { RootProvider } from "fumadocs-ui/provider/next";
import { Analytics } from "@vercel/analytics/next";
import "fumadocs-ui/style.css";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
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
  title: {
    default: "Motionwind — Motion animations as Tailwind classes",
    template: "%s | Motionwind",
  },
  description:
    "Write Motion animations as Tailwind-like utility classes. Build-time Babel transform, zero runtime overhead, no imports needed. Hover, tap, scroll, drag — all as class names.",
  metadataBase: new URL("https://motionwind.dev"),
  keywords: [
    "motionwind",
    "motion",
    "framer motion",
    "tailwind",
    "tailwind css",
    "animation",
    "react animation",
    "css animation",
    "utility classes",
    "babel plugin",
    "zero runtime",
    "next.js animation",
    "vite animation",
    "spring physics",
    "gesture animation",
    "scroll animation",
  ],
  authors: [{ name: "Piyush" }],
  creator: "Piyush",
  alternates: {
    canonical: "https://motionwind.dev",
  },
  openGraph: {
    type: "website",
    siteName: "Motionwind",
    url: "https://motionwind.dev",
    title: "Motionwind — Motion animations as Tailwind classes",
    description:
      "Write Motion animations as Tailwind-like classes. Zero imports, zero boilerplate, zero runtime overhead. Supports hover, tap, scroll, drag, and spring physics.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Motionwind — Motion animations as Tailwind classes",
    description:
      "Write Motion animations as Tailwind-like classes. Zero imports, zero boilerplate, zero runtime overhead.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const fontVars = [instrumentSerif, inter, jetbrainsMono]
  .map((f) => f.variable)
  .join(" ");

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Motionwind",
              applicationCategory: "DeveloperApplication",
              operatingSystem: "Any",
              description:
                "Write Motion animations as Tailwind-like utility classes. Build-time Babel transform with zero runtime overhead.",
              url: "https://motionwind.dev",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
            }),
          }}
        />
      </head>
      <body className={`${fontVars} antialiased`}>
        <RootProvider
          theme={{
            defaultTheme: "light",
            attribute: "class",
            enableSystem: true,
          }}
        >
          {children}
        </RootProvider>
        <Analytics />
      </body>
    </html>
  );
}
