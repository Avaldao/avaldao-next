import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#312e81",
    lang: "es",
    icons: [
      {
        src: "/images/avaldao.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}