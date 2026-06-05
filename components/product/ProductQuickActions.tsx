"use client";

import { Heart, Minus, Plus, ShoppingCart } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { useShopStore } from "@/store/use-shop-store";
import { Toast, type ToastType } from "@/components/feedback/Toast";

export function ProductQuickActions({
  productId,
  inStock,
  compact = false,
}: {
  productId: string;
  inStock: boolean;
  compact?: boolean;
}) {
  const t = useTranslations("product");
  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState<{ message: string; type: ToastType; isVisible: boolean }>({
    message: "",
    type: "success",
    isVisible: false,
  });
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cart = useShopStore((state) => state.cart);
  const addToCart = useShopStore((state) => state.addToCart);
  const toggleWishlist = useShopStore((state) => state.toggleWishlist);
  const saved = useShopStore((state) => state.wishlist.includes(productId));
  const inCart = cart.some((line) => line.productId === productId);

  useEffect(() => {
    return () => {
      if (toastTimer.current) {
        clearTimeout(toastTimer.current);
      }
    };
  }, []);

  function showToast(message: string, type: ToastType = "success") {
    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }

    setToast({ message, type, isVisible: true });
    toastTimer.current = setTimeout(() => {
      setToast((current) => ({ ...current, isVisible: false }));
    }, 2500);
  }

  function closeToast() {
    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }

    setToast((current) => ({ ...current, isVisible: false }));
  }

  function decreaseQuantity() {
    setQuantity((current) => Math.max(1, current - 1));
  }

  function increaseQuantity() {
    setQuantity((current) => current + 1);
  }

  function handleAddToCart() {
    if (inCart) {
      showToast(t("alreadyCart"), "info");
      return;
    }

    addToCart(productId, compact ? 1 : quantity);
    showToast(t("addedCart"), "cart");
  }

  function handleWishlist() {
    if (saved) {
      showToast(t("alreadyWishlist"), "info");
      return;
    }

    toggleWishlist(productId);
    showToast(t("addedWishlist"), "wishlist");
  }

  return (
    <>
      <div className={compact ? "grid grid-cols-[1fr_auto] gap-2" : "grid grid-cols-[96px_1fr] gap-2 sm:grid-cols-[136px_1fr_auto]"}>
        {!compact ? (
          <div className="flex h-11 items-center justify-between rounded-full bg-[var(--background-soft)] px-2 text-sm font-bold text-black sm:text-base">
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-black/10"
              onClick={decreaseQuantity}
              aria-label={t("decreaseQuantity")}
            >
              <Minus size={16} />
            </button>
            <span>{quantity}</span>
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-black/10"
              onClick={increaseQuantity}
              aria-label={t("increaseQuantity")}
            >
              <Plus size={16} />
            </button>
          </div>
        ) : null}

        <button
          type="button"
          className="btn-primary min-h-11 px-4 transition duration-300 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={handleAddToCart}
          disabled={!inStock}
        >
          <ShoppingCart size={18} />
          <span className={compact ? "hidden min-[420px]:inline" : ""}>{t("addToCart")}</span>
        </button>

        <button
          type="button"
          className={`btn-secondary min-h-11 !px-4 transition duration-300 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 ${
            saved ? "border-black bg-black text-white" : ""
          } hidden sm:inline-flex`}
          onClick={handleWishlist}
          aria-pressed={saved}
        >
          <Heart size={18} fill={saved ? "currentColor" : "none"} />
          <span className="sr-only">{saved ? t("alreadyWishlist") : t("addWishlist")}</span>
        </button>
      </div>
      <Toast message={toast.message} type={toast.type} isVisible={toast.isVisible} onClose={closeToast} />
    </>
  );
}
