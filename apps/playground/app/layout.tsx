import type { Metadata } from "next";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
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
    default: "Motionwind Playground — Interactive Animation Editor",
    template: "%s | Motionwind Playground",
  },
  description:
    "Interactive playground for Motionwind — write Motion animations as Tailwind-like utility classes, preview them live, and generate production-ready code.",
  metadataBase: new URL("https://play.motionwind.xyz"),
  keywords: [
    "motionwind",
    "playground",
    "animation",
    "interactive",
    "code editor",
    "live preview",
    "tailwind",
    "motion",
  ],
  authors: [{ name: "Piyush", url: "https://github.com/piyushzingade" }],
  alternates: {
    canonical: "https://play.motionwind.xyz",
  },
  openGraph: {
    type: "website",
    siteName: "Motionwind Playground",
    title: "Motionwind Playground — Interactive Animation Editor",
    description:
      "Interactive playground for Motionwind — write Motion animations as Tailwind-like utility classes, preview them live, and generate production-ready code.",
    url: "https://play.motionwind.xyz",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Motionwind Playground — Interactive Animation Editor",
    description:
      "Interactive playground for Motionwind — write Motion animations as Tailwind-like utility classes, preview them live, and generate production-ready code.",
    creator: "@piyushzingade",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
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
                  name: "Motionwind Playground",
                  url: "https://play.motionwind.xyz",
                  description:
                    "Interactive playground for Motionwind — write Motion animations as Tailwind-like utility classes, preview them live, and generate production-ready code.",
                  publisher: {
                    "@type": "Person",
                    name: "Piyush",
                    url: "https://github.com/piyushzingade",
                  },
                  inLanguage: "en",
                },
                {
                  "@type": "SoftwareApplication",
                  name: "Motionwind Playground",
                  applicationCategory: "DeveloperApplication",
                  operatingSystem: "Any",
                  description:
                    "Interactive playground for Motionwind — write Motion animations as Tailwind-like utility classes, preview them live, and generate production-ready code.",
                  url: "https://play.motionwind.xyz",
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
                },
              ],
            })
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
      </body>
    </html>
  );
}
