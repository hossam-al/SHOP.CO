"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "@/i18n/routing";
import { products } from "@/lib/products";
import type { Locale } from "@/i18n/routing";
import { localizedName } from "@/lib/types";
import { useShopStore } from "@/store/use-shop-store";

export function CartClient() {
  const t = useTranslations("cart");
  const site = useTranslations("site");
  const locale = useLocale() as Locale;
  const cart = useShopStore((state) => state.cart);
  const updateQuantity = useShopStore((state) => state.updateQuantity);
  const removeFromCart = useShopStore((state) => state.removeFromCart);
  const clearCart = useShopStore((state) => state.clearCart);
  const lines = cart
    .map((line) => ({ ...line, product: products.find((product) => product.id === line.productId) }))
    .filter((line) => line.product);
  const subtotal = lines.reduce((sum, line) => sum + (line.product?.price ?? 0) * line.quantity, 0);

  if (!lines.length) {
    return (
      <section className="container-page py-16 text-center">
        <h1 className="text-4xl font-black">{t("title")}</h1>
        <p className="mt-4 text-muted">{t("empty")}</p>
        <Link className="btn-primary mt-8" href="/category/apparel">
          {t("continue")}
        </Link>
      </section>
    );
  }

  return (
    <section className="container-page py-12">
      <h1 className="text-4xl font-black">{t("title")}</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-4">
          {lines.map(({ product, quantity }) =>
            product ? (
              <article key={product.id} className="card grid gap-4 p-4 sm:grid-cols-[120px_1fr_auto]">
                <Image
                  src={product.image}
                  alt={localizedName(product, locale)}
                  width={120}
                  height={120}
                  className="aspect-square rounded-md bg-[#f1ede4] object-cover"
                />
                <div>
                  <h2 className="text-xl font-bold">{localizedName(product, locale)}</h2>
                  <p className="mt-2 text-muted">${product.price.toFixed(2)}</p>
                  <button className="mt-4 inline-flex items-center gap-2 text-red-600" onClick={() => removeFromCart(product.id)}>
                    <Trash2 size={16} /> {t("remove")}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button className="btn-secondary !px-3" onClick={() => updateQuantity(product.id, quantity - 1)}>
                    <Minus size={16} />
                  </button>
                  <span className="min-w-8 text-center font-bold">{quantity}</span>
                  <button className="btn-secondary !px-3" onClick={() => updateQuantity(product.id, quantity + 1)}>
                    <Plus size={16} />
                  </button>
                </div>
              </article>
            ) : null,
          )}
        </div>
        <aside className="card h-fit p-5">
          <div className="flex items-center justify-between text-lg">
            <span>{t("subtotal")}</span>
            <strong>${subtotal.toFixed(2)}</strong>
          </div>
          <Link className="btn-primary mt-6 w-full" href="/checkout">
            {site("checkout")}
          </Link>
          <button className="btn-secondary mt-3 w-full" onClick={clearCart}>
            {t("clear")}
          </button>
        </aside>
      </div>
    </section>
  );
}
