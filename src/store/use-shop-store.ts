"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLine } from "@/lib/types";

type User = {
  name: string;
  email: string;
};

type ShopState = {
  cart: CartLine[];
  wishlist: string[];
  user: User | null;
  theme: "light" | "dark";
  addToCart: (productId: string, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  login: (user: User) => void;
  logout: () => void;
  toggleTheme: () => void;
};

export const useShopStore = create<ShopState>()(
  persist(
    (set) => ({
      cart: [],
      wishlist: [],
      user: null,
      theme: "light",
      addToCart: (productId, quantity = 1) =>
        set((state) => {
          const existing = state.cart.find((line) => line.productId === productId);
          if (existing) {
            return {
              cart: state.cart.map((line) =>
                line.productId === productId
                  ? { ...line, quantity: line.quantity + quantity }
                  : line,
              ),
            };
          }
          return { cart: [...state.cart, { productId, quantity }] };
        }),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          cart: quantity <= 0
            ? state.cart.filter((line) => line.productId !== productId)
            : state.cart.map((line) =>
                line.productId === productId ? { ...line, quantity } : line,
              ),
        })),
      removeFromCart: (productId) =>
        set((state) => ({ cart: state.cart.filter((line) => line.productId !== productId) })),
      clearCart: () => set({ cart: [] }),
      toggleWishlist: (productId) =>
        set((state) => ({
          wishlist: state.wishlist.includes(productId)
            ? state.wishlist.filter((id) => id !== productId)
            : [...state.wishlist, productId],
        })),
      login: (user) => set({ user }),
      logout: () => set({ user: null }),
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
    }),
    { name: "nordic-cart-store" },
  ),
);
