import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { products } from "@/lib/products";
import { siteUrl } from "@/seo/metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "/home",
    "/PLP",
    "/CHEKOUT",
    "/CART",
    "/WISHLIST",
    "/LOGIN",
    "/SINUP",
    "/ACCOUNT",
    "/ACCOUNT/MY-ORDERS",
  ];
  const productRoutes = products.map((product) => `/PDP/${product.id}`);

  return routing.locales.flatMap((locale) =>
    [...staticRoutes, ...productRoutes].map((route) => ({
      url: `${siteUrl}/${locale}${route}`,
      lastModified: new Date(),
    })),
  );
}
