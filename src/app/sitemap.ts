import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/** Only the public landing page. The app itself is private, per-device and not indexed. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: SITE_URL, changeFrequency: "monthly", priority: 1 }];
}
