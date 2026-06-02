import productsJson from "@/data/products.json";
import type { Category, Product } from "./types";

export const products = productsJson as Product[];

export const categories: Category[] = [
  { slug: "apparel", name_en: "Apparel", name_ar: "ملابس" },
  { slug: "bags", name_en: "Bags", name_ar: "حقائب" },
  { slug: "home", name_en: "Home", name_ar: "المنزل" },
];

export function getProducts() {
  return products;
}

export function getProduct(id: string) {
  return products.find((product) => product.id === id);
}

export function getCategory(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export function getProductsByCategory(slug: string) {
  return products.filter((product) => product.category === slug);
}

export function sortProducts(items: Product[], sort?: string | null) {
  if (sort === "price-asc") {
    return [...items].sort((a, b) => a.price - b.price);
  }

  if (sort === "price-desc") {
    return [...items].sort((a, b) => b.price - a.price);
  }

  return items;
}
