import type { Metadata } from "next";
import type { Locale } from "@/i18n/routing";

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function localizedPath(locale: Locale, path = "") {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${clean === "/" ? "" : clean}`;
}

export function buildMetadata({
  locale,
  path,
  title,
  description,
}: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
}): Metadata {
  const enPath = localizedPath("en", path);
  const arPath = localizedPath("ar", path);
  const canonical = `${siteUrl}${localizedPath(locale, path)}`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: `${siteUrl}${enPath}`,
        ar: `${siteUrl}${arPath}`,
        "x-default": `${siteUrl}${enPath}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Nordic Cart",
      locale,
      type: "website",
      images: [{ url: `${siteUrl}/api/og?title=${encodeURIComponent(title)}` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${siteUrl}/api/og?title=${encodeURIComponent(title)}`],
    },
  };
}
