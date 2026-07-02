import type { MetadataRoute } from "next";
import { absoluteUrl, getSiteUrl } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const isProductionUrl = getSiteUrl() === siteConfig.productionUrl;

  return {
    rules: {
      userAgent: "*",
      ...(isProductionUrl ? { allow: "/" } : { disallow: "/" })
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: getSiteUrl()
  };
}
