import type { MetadataRoute } from "next";
import { blogPosts } from "@/lib/data/content";
import { brands, categories, products } from "@/lib/data";
import { CALCULATORS } from "@/lib/utils/calculators";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPaths = ["", "/categories", "/products", "/brands", "/blog", "/bulk-enquiry", "/about", "/contact", "/faq", "/shipping-policy", "/return-policy", "/privacy", "/terms"];
  return [
    ...staticPaths.map((p) => ({ url: `${base}${p}`, lastModified: now, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.6 })),
    ...categories.map((c) => ({ url: `${base}/category/${c.slug}`, lastModified: now, changeFrequency: "daily" as const, priority: 0.9 })),
    ...products.map((p) => ({ url: `${base}/product/${p.slug}`, lastModified: new Date(p.createdAt), changeFrequency: "weekly" as const, priority: 0.8 })),
    ...brands.map((b) => ({ url: `${base}/brand/${b.slug}`, lastModified: now, priority: 0.5 })),
    ...CALCULATORS.map((c) => ({ url: `${base}/calculators/${c.type}`, lastModified: now, priority: 0.5 })),
    ...blogPosts.map((b) => ({ url: `${base}/blog/${b.slug}`, lastModified: new Date(b.date), priority: 0.5 })),
  ];
}
