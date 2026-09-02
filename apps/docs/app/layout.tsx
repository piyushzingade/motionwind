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
    default: "Motionwind — Motion animations as utility classes",
    template: "%s | Motionwind Docs",
  },
  description:
    "Motionwind is a shared Motion utility language for React, Vue, JavaScript, and React Native. Write animate-* classes that compile to Motion at build time with zero runtime overhead.",
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
    "animation library",
    "ui animation",
    "frontend animation",
  ],
  authors: [{ name: "Piyush", url: "https://github.com/piyushzingade" }],
  creator: "Piyush",
  publisher: "Piyush",
  alternates: {
    canonical: "https://www.motionwind.xyz",
  },
  openGraph: {
    type: "website",
    siteName: "Motionwind",
    url: "https://www.motionwind.xyz",
    title: "Motionwind — Motion animations as utility classes",
    description:
      "Write Motion animations as Tailwind-like utility classes. Transformed at build time. Zero runtime overhead. Supports React, Vue, JavaScript, and React Native.",
    locale: "en_US",
    images: [
      {
        url: "https://www.motionwind.xyz/og-docs.png",
        width: 1200,
        height: 630,
        alt: "Motionwind — Motion animations as utility classes across frameworks",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Motionwind — Motion animations as utility classes",
    description:
      "Write Motion animations as Tailwind-like utility classes. Transformed at build time. Zero runtime overhead.",
    images: ["https://www.motionwind.xyz/og-docs.png"],
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
              "@graph": [
                {
                  "@type": "WebSite",
                  name: "Motionwind",
                  url: "https://www.motionwind.xyz",
                  description:
                    "Motionwind is a shared Motion utility language for React, Vue, JavaScript, and React Native. Write animate-* classes that compile to Motion at build time.",
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
                    "A shared Motion utility language for React, Vue, JavaScript, and React Native with compile-time transforms, explicit runtime adapters, presets, plugins, and strict diagnostics.",
                  url: "https://www.motionwind.xyz",
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
                  downloadUrl: "https://www.npmjs.com/package/motionwind-react",
                  installUrl: "https://www.npmjs.com/package/motionwind-react",
                  screenshot: "https://www.motionwind.xyz/og-docs.png",
                  featureList:
                    "Compile-time animation transforms, gesture animations, scroll animations, layout animations, spring physics, variants, drag, SVG animation, reduced motion support",
                  keywords:
                    "motionwind, animation, framer motion, tailwind, react, vue, javascript, react native",
                },
                {
                  "@type": "Person",
                  name: "Piyush",
                  url: "https://github.com/piyushzingade",
                  jobTitle: "Creator of Motionwind",
                  knowsAbout: [
                    "React",
                    "Vue",
                    "JavaScript",
                    "TypeScript",
                    "Animation",
                    "Motion",
                    "Tailwind CSS",
                    "React Native",
                  ],
                  sameAs: [
                    "https://github.com/piyushzingade",
                    "https://www.npmjs.com/~piyushzingade",
                  ],
                },
              ],
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
