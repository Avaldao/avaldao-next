import type { MetadataRoute } from "next";
import { getAbsoluteUrl } from "@/lib/seo";
import { languages, localizeHref } from "@/translations/locales";

const pages: { path: string; changeFrequency: "weekly" | "monthly"; priority: number }[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/invertir", changeFrequency: "monthly", priority: 0.6 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return pages.flatMap(({ path, changeFrequency, priority }) => {
    const alternates = {
      languages: Object.fromEntries(
        languages.map((l) => [l, getAbsoluteUrl(localizeHref(path, l))])
      ),
    };

    return languages.map((language) => ({
      url: getAbsoluteUrl(localizeHref(path, language)),
      lastModified,
      changeFrequency,
      priority,
      alternates,
    }));
  });
}
