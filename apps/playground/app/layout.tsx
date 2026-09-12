import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = localFont({
  src: "../../web/app/fonts/GeistVF.woff",
  variable: "--font-sans",
  display: "swap",
});

const geistMono = localFont({
  src: "../../web/app/fonts/GeistMonoVF.woff",
  variable: "--font-mono",
  display: "swap",
});

const databuddyClientId = process.env.DATABUDDY_CLIENT_ID;

export const metadata: Metadata = {
  title: {
    default: "Motionwind Playground - Interactive Animation Editor",
    template: "%s | Motionwind Playground",
  },
  description:
    "Interactive playground for Motionwind. Write Motion animations as Tailwind-like utility classes, preview them live, and generate production-ready code.",
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
    title: "Motionwind Playground - Interactive Animation Editor",
    description:
      "Interactive playground for Motionwind. Write Motion animations as Tailwind-like utility classes, preview them live, and generate production-ready code.",
    url: "https://play.motionwind.xyz",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Motionwind Playground - Interactive Animation Editor",
    description:
      "Interactive playground for Motionwind. Write Motion animations as Tailwind-like utility classes, preview them live, and generate production-ready code.",
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

const fontVars = [geistSans, geistMono].map((f) => f.variable).join(" ");

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
                    "Interactive playground for Motionwind. Write Motion animations as Tailwind-like utility classes, preview them live, and generate production-ready code.",
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
                    "Interactive playground for Motionwind. Write Motion animations as Tailwind-like utility classes, preview them live, and generate production-ready code.",
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
        {databuddyClientId ? (
          <script
            src="https://cdn.databuddy.cc/databuddy.js"
            data-client-id={databuddyClientId}
            data-track-hash-changes="true"
            data-track-attributes="true"
            data-track-outgoing-links="true"
            data-track-interactions="true"
            data-track-web-vitals="true"
            data-track-errors="true"
            crossOrigin="anonymous"
            async
          />
        ) : null}
      </head>
      <body className={`${fontVars} antialiased`}>
        <ThemeProvider
          defaultTheme="dark"
          attribute="class"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
