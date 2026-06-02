import type { Locale } from "@/i18n/routing";

export type Product = {
  id: string;
  name_en: string;
  name_ar: string;
  price: number;
  category: string;
  image: string;
  description_en: string;
  description_ar: string;
  inStock: boolean;
  oldPrice?: number;
  discount?: number;
  rating: number;
  colors: string[];
  sizes: string[];
};

export type Category = {
  slug: string;
  name_en: string;
  name_ar: string;
};

export type CartLine = {
  productId: string;
  quantity: number;
};

export function localizedName(product: Product, locale: Locale) {
  return locale === "ar" ? product.name_ar : product.name_en;
}

export function localizedDescription(product: Product, locale: Locale) {
  return locale === "ar" ? product.description_ar : product.description_en;
}
