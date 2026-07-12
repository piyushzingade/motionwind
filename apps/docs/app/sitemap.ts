import type { MetadataRoute } from "next";
import { source } from "@/lib/source";

const BASE_URL = "https://www.motionwind.xyz";

// High-intent landing pages that should rank first get a priority bump.
const HIGH_PRIORITY = new Set([
  "/docs",
  "/docs/getting-started",
  "/docs/installation",
  "/docs/frameworks",
  "/docs/frameworks/react",
  "/docs/frameworks/vue",
  "/docs/frameworks/vanilla",
  "/docs/react-native",
]);

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = source.getPages();

  const docPages: MetadataRoute.Sitemap = pages.map((page) => ({
    url: `${BASE_URL}${page.url}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: HIGH_PRIORITY.has(page.url) ? 0.9 : 0.7,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/docs`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...docPages,
  ];
}
