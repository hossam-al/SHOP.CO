"use client";

import { useEffect } from "react";
import { useShopStore } from "@/store/use-shop-store";

export function ThemeSync() {
  const theme = useShopStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return null;
}
