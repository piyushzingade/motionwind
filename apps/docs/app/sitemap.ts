import type { MetadataRoute } from "next";
import { source } from "@/lib/source";

const BASE_URL = "https://www.motionwind.xyz";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = source.getPages();

  const docPages: MetadataRoute.Sitemap = pages.map((page) => ({
    url: `${BASE_URL}${page.url}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
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
