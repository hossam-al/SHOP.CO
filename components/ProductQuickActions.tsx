"use client";

import { Heart, ShoppingBag } from "lucide-react";
import { useTranslations } from "next-intl";
import { useShopStore } from "@/store/use-shop-store";

export function ProductQuickActions({ productId, inStock }: { productId: string; inStock: boolean }) {
  const t = useTranslations("product");
  const addToCart = useShopStore((state) => state.addToCart);
  const toggleWishlist = useShopStore((state) => state.toggleWishlist);
  const saved = useShopStore((state) => state.wishlist.includes(productId));

  return (
    <div className="flex gap-2">
      <div className="flex min-w-36 items-center justify-between rounded-full bg-[var(--background-soft)] px-5 font-bold text-black">
        <span>−</span><span>1</span><span>+</span>
      </div>
      <button
        className="btn-primary flex-1 disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => addToCart(productId)}
        disabled={!inStock}
      >
        <ShoppingBag size={18} /> {t("addToCart")}
      </button>
      <button className="btn-secondary !px-4" onClick={() => toggleWishlist(productId)}>
        <Heart size={18} fill={saved ? "currentColor" : "none"} />
        <span className="sr-only">{saved ? t("removeWishlist") : t("addWishlist")}</span>
      </button>
    </div>
  );
}
