import type { MetadataRoute } from "next";
import { getAbsoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["/", "/avales", "/register", "/users/signup"];
  const lastModified = new Date();

  return routes.map((route, index) => ({
    url: getAbsoluteUrl(route),
    lastModified,
    changeFrequency: index === 0 ? "weekly" : "monthly",
    priority: index === 0 ? 1 : 0.7,
  }));
}