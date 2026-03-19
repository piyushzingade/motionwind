import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
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
        url: "/opengraph-image",
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
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-[family-name:var(--font-geist-sans)] bg-gray-950 text-white antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
