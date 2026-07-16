import type { Metadata } from "next";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import { RootProvider } from "fumadocs-ui/provider/next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
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
    default:
      "Motionwind v2 — Motion utility classes for every official adapter",
    template: "%s | Motionwind",
  },
  description:
    "A shared Motion utility language for React, Vue, JavaScript, and React Native, with compile-time transforms, explicit runtime adapters, presets, plugins, and strict diagnostics.",
  metadataBase: new URL("https://www.motionwind.xyz"),
  keywords: [
    "motionwind",
    "motion",
    "framer motion",
    "tailwind",
    "tailwind css",
    "animation",
    "react animation",
    "vue animation",
    "react native animation",
    "javascript animation",
    "css animation",
    "utility classes",
    "babel plugin",
    "compile time animation",
    "next.js animation",
    "vite animation",
    "spring physics",
    "gesture animation",
    "scroll animation",
  ],
  authors: [{ name: "Piyush" }],
  creator: "Piyush",
  alternates: {
    canonical: "https://www.motionwind.xyz",
  },
  openGraph: {
    type: "website",
    siteName: "Motionwind",
    url: "https://www.motionwind.xyz",
    title: "Motionwind v2 — Motion utility classes across frameworks",
    description:
      "One tested animate-* language for React, Vue, JavaScript, and React Native, backed by a shared parser and explicit adapter capabilities.",
    locale: "en_US",
    images: [
      {
        url: "https://www.motionwind.xyz/og-docs.png",
        width: 1200,
        height: 630,
        alt: "Motionwind v2 — Motion utility classes across frameworks",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Motionwind v2 — Motion utility classes across frameworks",
    description:
      "One tested animate-* language for React, Vue, JavaScript, and React Native.",
    images: ["https://www.motionwind.xyz/og-docs.png"],
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
                "A shared Motion utility language for React, Vue, JavaScript, and React Native with compile-time transforms and explicit runtime adapters.",
              url: "https://www.motionwind.xyz",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
            })
              // Escape so data can never break out of the <script> tag (e.g. "</script>").
              .replace(/</g, "\\u003c")
              .replace(/>/g, "\\u003e")
              .replace(/&/g, "\\u0026"),
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
        <SpeedInsights />
      </body>
    </html>
  );
}
