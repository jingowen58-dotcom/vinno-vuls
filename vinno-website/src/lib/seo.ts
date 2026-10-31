import type { Metadata } from "next";
import { brand } from "@/config/brand";
import { getContent } from "@/content";
import type { Locale } from "@/content/types";
import { siteOrigin, siteUrl } from "@/lib/site";

const keywords = [
  "Global Life Science Network",
  "Life Science Data Infrastructure",
  "Open Science Network",
  "Healthspan Research",
  "Pet Healthspan",
  "Comparative Aging",
  "Longevity Research",
  "Universal Life Science Data Standard",
  "AI Research Engine",
];

export function buildMetadata(locale: Locale, path = ""): Metadata {
  const content = getContent(locale);
  const localized = `${siteUrl}/${locale}${path}/`;

  return {
    metadataBase: new URL(siteOrigin),
    title: content.meta.title,
    description: content.meta.description,
    keywords,
    alternates: {
      canonical: localized,
      languages: {
        en: `${siteUrl}/en${path}/`,
        "zh-CN": `${siteUrl}/zh${path}/`,
      },
    },
    openGraph: {
      title: content.meta.title,
      description: content.meta.description,
      url: localized,
      siteName: brand.name,
      locale: content.meta.ogLocale,
      type: "website",
      images: [{ url: `${siteUrl}/og.png`, width: 1200, height: 630, alt: content.meta.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: content.meta.title,
      description: content.meta.description,
      images: [`${siteUrl}/og.png`],
    },
  };
}

export function organizationJsonLd(locale: Locale) {
  const content = getContent(locale);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brand.name,
    url: `${siteUrl}/${locale}/`,
    description: content.meta.description,
    slogan: brand.slogan,
    sameAs: [brand.repository],
  };
}
