import type { MetadataRoute } from "next";
import { categories, products } from "@/lib/products";
import { siteUrl } from "@/lib/seo";
import { routing } from "@/i18n/routing";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/cart", "/checkout", "/login", "/signup", "/about", "/contact"];
  const categoryRoutes = categories.map((category) => `/category/${category.slug}`);
  const productRoutes = products.map((product) => `/product/${product.id}`);

  return routing.locales.flatMap((locale) =>
    [...staticRoutes, ...categoryRoutes, ...productRoutes].map((route) => ({
      url: `${siteUrl}/${locale}${route}`,
      lastModified: new Date(),
      alternates: {
        languages: {
          en: `${siteUrl}/en${route}`,
          ar: `${siteUrl}/ar${route}`,
        },
      },
    })),
  );
}
