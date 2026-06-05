"use client";

import { Heart } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { ProductCard } from "@/components/product/ProductCard";
import { Link, type Locale } from "@/i18n/routing";
import { products } from "@/lib/products";
import { useShopStore } from "@/store/use-shop-store";

export function WishlistClient() {
  const locale = useLocale() as Locale;
  const site = useTranslations("site");
  const t = useTranslations("accountPage");
  const wishlist = useShopStore((state) => state.wishlist);
  const savedProducts = products.filter((product) => wishlist.includes(product.id));

  if (!savedProducts.length) {
    return (
      <section className="container-page py-16 text-center">
        <Heart className="mx-auto h-12 w-12" />
        <h1 className="mt-4 text-4xl font-black">{site("wishlist")}</h1>
        <p className="mt-3 text-muted">{t("emptyWishlist")}</p>
        <Link className="btn-primary mt-8" href="/PLP">
          {t("browseProducts")}
        </Link>
      </section>
    );
  }

  return (
    <section className="container-page py-8">
      <div className="mb-8 text-black/60">
        {site("home")} <span aria-hidden="true">/</span> <span className="text-black">{site("wishlist")}</span>
      </div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="shop-heading">{site("wishlist")}</h1>
        <p className="text-sm text-black/60">{t("savedProductsCount", { count: savedProducts.length })}</p>
      </div>
      <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 md:gap-5 lg:grid-cols-4">
        {savedProducts.map((product) => (
          <ProductCard key={product.id} product={product} locale={locale} compact />
        ))}
      </div>
    </section>
  );
}
