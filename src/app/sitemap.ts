import { MetadataRoute } from "next";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { BLOG_POSTS } from "@/lib/blog";

const BASE = "https://www.sellz.pk";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();

  // Static pages
  const CATEGORY_SLUGS = [
    "mobiles", "vehicles", "property", "electronics",
    "furniture", "fashion", "books-sports", "kids",
    "services", "animals", "jobs", "other",
  ];

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                        lastModified: now, changeFrequency: "daily",   priority: 1.0 },
    { url: `${BASE}/search`,            lastModified: now, changeFrequency: "daily",   priority: 0.9 },
    { url: `${BASE}/how-it-works`,      lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/about`,             lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/safety`,            lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/contact`,           lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/blog`,              lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
    ...BLOG_POSTS.map(p => ({
      url: `${BASE}/blog/${p.slug}`,
      lastModified: p.date,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    { url: `${BASE}/terms`,             lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE}/privacy`,           lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    // Category landing pages (SEO-optimised, server-rendered)
    ...CATEGORY_SLUGS.map(slug => ({
      url: `${BASE}/${slug}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.85,
    })),
  ];

  // Dynamic ad pages
  let adPages: MetadataRoute.Sitemap = [];
  try {
    const { data: ads } = await supabaseAdmin
      .from("ads")
      .select("id, updated_at, edited_at, created_at")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(5000);

    if (ads) {
      adPages = ads.map(ad => ({
        url: `${BASE}/ads/${ad.id}`,
        lastModified: ad.edited_at ?? ad.updated_at ?? ad.created_at,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
    }
  } catch {
    // fail silently — static pages still included
  }

  return [...staticPages, ...adPages];
}
