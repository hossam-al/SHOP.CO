"use client";

import { CheckCircle, Heart, ShoppingCart, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export type ToastType = "cart" | "wishlist" | "info" | "success";

type ToastProps = {
  message: string;
  type?: ToastType;
  isVisible: boolean;
  onClose?: () => void;
};

export function Toast({ message, type = "success", isVisible, onClose }: ToastProps) {
  const [mounted, setMounted] = useState(false);
  const Icon = type === "cart" ? ShoppingCart : type === "wishlist" ? Heart : CheckCircle;
  const title = type === "info" ? "Notice" : "Success";

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <div
      className={`fixed right-4 top-4 z-[9999] w-[calc(100vw-32px)] transition-all duration-300 ease-out sm:right-5 sm:top-5 sm:w-[360px] ${
        isVisible ? "translate-x-0 scale-100 opacity-100" : "translate-x-5 scale-95 opacity-0 pointer-events-none"
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-3 rounded-2xl border border-black/10 bg-white px-5 py-4 text-black shadow-xl">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black text-white">
          <Icon size={18} fill={type === "wishlist" ? "currentColor" : "none"} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-black">{title}</p>
          <p className="text-sm text-black/60">{message}</p>
        </div>
        {onClose ? (
          <button
            type="button"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-black/50 transition hover:bg-black/5 hover:text-black"
            onClick={onClose}
            aria-label="Close notification"
          >
            <X size={16} />
          </button>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
