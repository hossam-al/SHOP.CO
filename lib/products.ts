import productsJson from "@/data/products.json";
import type { Category, Product } from "@/types/product";

export const products = productsJson as Product[];

export const categories: Category[] = [
  { slug: "casual", name_en: "Casual", name_ar: "كاجوال" },
  { slug: "formal", name_en: "Formal", name_ar: "رسمي" },
  { slug: "party", name_en: "Party", name_ar: "حفلات" },
  { slug: "gym", name_en: "Gym", name_ar: "رياضي" },
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

export type ProductFilters = {
  colors?: string[];
  sizes?: string[];
  minPrice?: number;
  maxPrice?: number;
};

export function filterProducts(items: Product[], filters: ProductFilters) {
  return items.filter((product) => {
    if (filters.colors?.length && !filters.colors.some((color) => product.colors.includes(color))) {
      return false;
    }

    if (filters.sizes?.length && !filters.sizes.some((size) => product.sizes.includes(size))) {
      return false;
    }

    if (typeof filters.minPrice === "number" && product.price < filters.minPrice) {
      return false;
    }

    if (typeof filters.maxPrice === "number" && product.price > filters.maxPrice) {
      return false;
    }

    return true;
  });
}

export function sortProducts(items: Product[], sort?: string | null) {
  if (sort === "price-asc") {
    return [...items].sort((a, b) => a.price - b.price);
  }

  if (sort === "price-desc") {
    return [...items].sort((a, b) => b.price - a.price);
  }

  if (sort === "rating") {
    return [...items].sort((a, b) => b.rating - a.rating);
  }

  return items;
}
