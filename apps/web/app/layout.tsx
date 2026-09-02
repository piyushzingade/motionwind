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
  metadataBase: new URL("https://web.motionwind.xyz"),
  title: {
    default: "Motionwind — Motion animations as Tailwind classes",
    template: "%s | Motionwind",
  },
  description:
    "Motionwind lets you write Motion animations as Tailwind-like utility classes. A Babel plugin transforms them at build time — zero imports, zero boilerplate, zero runtime overhead.",
  keywords: [
    "motionwind",
    "motion",
    "animation",
    "tailwind",
    "tailwind css",
    "framer motion",
    "react animation",
    "vue animation",
    "javascript animation",
    "css animation",
    "utility classes",
    "babel plugin",
    "compile time animation",
  ],
  authors: [{ name: "Piyush", url: "https://github.com/piyushzingade" }],
  creator: "Piyush",
  alternates: {
    canonical: "https://web.motionwind.xyz",
  },
  openGraph: {
    type: "website",
    siteName: "Motionwind",
    url: "https://web.motionwind.xyz",
    title: "Motionwind — Motion animations as Tailwind classes",
    description:
      "Write Motion animations as Tailwind-like utility classes. Zero imports, zero boilerplate, zero runtime overhead.",
    locale: "en_US",
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
      "Write Motion animations as Tailwind-like utility classes. Zero imports, zero boilerplate, zero runtime overhead.",
    images: ["https://www.motionwind.xyz/og.png"],
    creator: "@piyushzingade",
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
              "@graph": [
                {
                  "@type": "WebSite",
                  name: "Motionwind",
                  url: "https://web.motionwind.xyz",
                  description:
                    "Write Motion animations as Tailwind-like utility classes. Zero imports, zero boilerplate, zero runtime overhead.",
                  publisher: {
                    "@type": "Person",
                    name: "Piyush",
                    url: "https://github.com/piyushzingade",
                  },
                  inLanguage: "en",
                },
                {
                  "@type": "SoftwareApplication",
                  name: "Motionwind",
                  applicationCategory: "DeveloperApplication",
                  operatingSystem: "Any",
                  description:
                    "Write Motion animations as Tailwind-like utility classes. A Babel plugin transforms them at build time.",
                  url: "https://web.motionwind.xyz",
                  offers: {
                    "@type": "Offer",
                    price: "0",
                    priceCurrency: "USD",
                  },
                  author: {
                    "@type": "Person",
                    name: "Piyush",
                    url: "https://github.com/piyushzingade",
                  },
                  softwareVersion: "2.0.0",
                },
              ],
            })
              .replace(/</g, "\\u003c")
              .replace(/>/g, "\\u003e")
              .replace(/&/g, "\\u0026"),
          }}
        />
      </head>
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
