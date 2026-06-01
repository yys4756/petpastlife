import type { MetadataRoute } from "next";
import { posts } from "./blog/_posts";

const BASE = "https://pawlabo.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const blogPosts = posts.map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const mostRecentPost = blogPosts.reduce((a, b) =>
    a.lastModified > b.lastModified ? a : b
  );

  return [
    { url: BASE, lastModified: mostRecentPost.lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/horoscope`, lastModified: (() => { const d = new Date(); d.setHours(0,0,0,0); return d; })(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/blog`, lastModified: mostRecentPost.lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/about`, lastModified: new Date("2026-06-01"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/cat-past-life`, lastModified: new Date("2026-06-01"), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/dog-past-life`, lastModified: new Date("2026-06-01"), changeFrequency: "monthly", priority: 0.9 },
    ...blogPosts,
  ];
}
