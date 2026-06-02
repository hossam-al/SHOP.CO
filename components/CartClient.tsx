"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Minus, Plus, Tag, Trash2 } from "lucide-react";
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
  const discount = subtotal * 0.2;
  const delivery = 15;
  const total = Math.max(0, subtotal - discount + delivery);

  if (!lines.length) {
    return (
      <section className="container-page py-16 text-center">
        <h1 className="text-4xl font-black">{t("title")}</h1>
        <p className="mt-4 text-muted">{t("empty")}</p>
          <Link className="btn-primary mt-8" href="/category/casual">
          {t("continue")}
        </Link>
      </section>
    );
  }

  return (
    <section className="container-page py-8">
      <div className="mb-8 text-black/60">Home › <span className="text-black">Cart</span></div>
      <h1 className="shop-heading">{t("title")}</h1>
      <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_505px]">
        <div className="rounded-[20px] border border-black/10 p-5">
          {lines.map(({ product, quantity }) =>
            product ? (
              <article key={product.id} className="grid gap-4 border-b border-black/10 py-5 last:border-b-0 sm:grid-cols-[124px_1fr_auto]">
                <Image
                  src={product.image}
                  alt={localizedName(product, locale)}
                  width={120}
                  height={120}
                  className="aspect-square rounded-[9px] bg-[#f0f0f0] object-cover"
                />
                <div>
                  <h2 className="text-xl font-bold">{localizedName(product, locale)}</h2>
                  <p className="mt-1 text-sm">Size: <span className="text-black/60">Large</span></p>
                  <p className="mt-1 text-sm">Color: <span className="text-black/60">Blue</span></p>
                  <strong className="mt-4 block text-2xl">${product.price}</strong>
                </div>
                <div className="flex flex-col items-end justify-between gap-5">
                  <button className="text-[#ff3333]" onClick={() => removeFromCart(product.id)} aria-label={t("remove")}>
                    <Trash2 size={22} />
                  </button>
                  <div className="flex items-center gap-2 rounded-full bg-[#f0f0f0] px-4 py-3">
                  <button onClick={() => updateQuantity(product.id, quantity - 1)}>
                    <Minus size={16} />
                  </button>
                  <span className="min-w-8 text-center font-bold">{quantity}</span>
                  <button onClick={() => updateQuantity(product.id, quantity + 1)}>
                    <Plus size={16} />
                  </button>
                  </div>
                </div>
              </article>
            ) : null,
          )}
        </div>
        <aside className="h-fit rounded-[20px] border border-black/10 p-6">
          <h2 className="text-2xl font-bold">{t("summary")}</h2>
          <div className="mt-6 grid gap-5 text-xl">
            <div className="flex items-center justify-between">
              <span className="text-black/60">{t("subtotal")}</span>
              <strong>${subtotal.toFixed(0)}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-black/60">{t("discount")}</span>
              <strong className="text-[#ff3333]">-${discount.toFixed(0)}</strong>
            </div>
            <div className="flex items-center justify-between border-b border-black/10 pb-5">
              <span className="text-black/60">{t("delivery")}</span>
              <strong>${delivery}</strong>
            </div>
            <div className="flex items-center justify-between text-2xl">
              <span>{t("total")}</span>
              <strong>${total.toFixed(0)}</strong>
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <label className="relative flex-1">
              <Tag className="absolute start-4 top-4 h-5 w-5 text-black/40" />
              <input className="field ps-12" placeholder={t("promo")} />
            </label>
            <button className="btn-primary px-8">{t("apply")}</button>
          </div>
          <Link className="btn-primary mt-6 w-full" href="/checkout">
            {site("checkout")} →
          </Link>
          <button className="btn-secondary mt-3 w-full" onClick={clearCart}>
            {t("clear")}
          </button>
        </aside>
      </div>
    </section>
  );
}
