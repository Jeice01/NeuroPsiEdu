import type { MetadataRoute } from "next";
import { blogPosts } from "@/data/blog";
import { absoluteUrl, FAMAF_CANONICAL_PATH } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "monthly", priority: 1 },
    { url: absoluteUrl("/avaliacao-neuropsicologica/"), changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/fnp/"), changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl(FAMAF_CANONICAL_PATH), changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/blog/"), changeFrequency: "weekly", priority: 0.8 },
  ];

  const articles: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}/`),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...articles];
}
