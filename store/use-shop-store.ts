"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLine, Order } from "@/types/product";

type User = {
  name: string;
  email: string;
};

type ShopState = {
  cart: CartLine[];
  orders: Order[];
  wishlist: string[];
  user: User | null;
  theme: "light" | "dark";
  addToCart: (productId: string, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  addOrder: (order: Order) => void;
  toggleWishlist: (productId: string) => void;
  login: (user: User) => void;
  updateUser: (user: User) => void;
  logout: () => void;
  toggleTheme: () => void;
};

export const useShopStore = create<ShopState>()(
  persist(
    (set) => ({
      cart: [],
      orders: [],
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
      addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
      toggleWishlist: (productId) =>
        set((state) => ({
          wishlist: state.wishlist.includes(productId)
            ? state.wishlist.filter((id) => id !== productId)
            : [...state.wishlist, productId],
        })),
      login: (user) => set({ user }),
      updateUser: (user) => set({ user }),
      logout: () => set({ user: null }),
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
    }),
    { name: "nordic-cart-store" },
  ),
);
