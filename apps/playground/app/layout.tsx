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
    default: "Motionwind Playground",
    template: "%s | Motionwind Playground",
  },
  description:
    "Interactive playground for Motionwind — write Motion animations as Tailwind-like utility classes and see them live.",
  metadataBase: new URL("https://play.motionwind.xyz"),
  openGraph: {
    type: "website",
    siteName: "Motionwind Playground",
    title: "Motionwind Playground",
    description:
      "Interactive playground for Motionwind — write Motion animations as Tailwind-like utility classes and see them live.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Motionwind Playground",
    description:
      "Interactive playground for Motionwind — write Motion animations as Tailwind-like utility classes and see them live.",
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
