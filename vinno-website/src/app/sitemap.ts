import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/en", "/zh", "/en/privacy", "/zh/privacy", "/en/terms", "/zh/terms"];
  return paths.map((path) => ({
    url: `${siteUrl}${path}/`,
    lastModified: new Date("2026-10-31"),
  }));
}
