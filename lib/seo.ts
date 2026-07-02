import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

type MetadataInput = {
  title?: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
  ogImagePath?: string;
};

export function getSiteUrl(): string {
  return normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL) ?? siteConfig.productionUrl;
}

export function absoluteUrl(path = "/"): string {
  const baseUrl = getSiteUrl().replace(/\/+$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const suffix = cleanPath === "/" ? "" : cleanPath;
  return `${baseUrl}${suffix}`;
}

export function buildMetadata(input: MetadataInput = {}): Metadata {
  const siteUrl = getSiteUrl();
  const description = input.description ?? siteConfig.description;
  const title = input.title
    ? `${input.title} | ${siteConfig.name}`
    : siteConfig.name;
  const canonical = absoluteUrl(input.path ?? "/");
  const noIndex = input.noIndex ?? siteUrl !== siteConfig.productionUrl;
  const ogImages = input.ogImagePath
    ? [
        {
          url: absoluteUrl(input.ogImagePath),
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} preview`
        }
      ]
    : undefined;

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: {
      canonical
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: siteConfig.name,
      type: "website",
      images: ogImages
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImages?.map((image) => image.url)
    },
    robots: noIndex
      ? {
          index: false,
          follow: false
        }
      : {
          index: true,
          follow: true
        }
  };
}

function normalizeUrl(value: string | undefined): string | undefined {
  if (!value) {
    return undefined;
  }

  const trimmed = value.trim().replace(/\/+$/, "");
  if (!trimmed) {
    return undefined;
  }

  try {
    return new URL(trimmed).toString().replace(/\/+$/, "");
  } catch {
    return undefined;
  }
}
