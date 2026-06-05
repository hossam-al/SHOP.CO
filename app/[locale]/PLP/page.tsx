import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { categories, filterProducts, getCategory, getProductsByCategory, sortProducts } from "@/lib/products";
import { buildMetadata, siteUrl } from "@/seo/metadata";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import { CategoryFilters } from "@/components/category/CategoryFilters";
import { CategorySort } from "@/components/category/CategorySort";
import { ProductCard } from "@/components/product/ProductCard";

const defaultCategorySlug = "casual";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const category = getCategory(defaultCategorySlug);
  if (!category) return {};
  const name = locale === "ar" ? category.name_ar : category.name_en;
  const site = await getTranslations({ locale, namespace: "site" });
  return buildMetadata({
    locale,
    path: "/PLP",
    title: `${name} | ${site("name")}`,
    description: site("description"),
  });
}

export default async function PlpPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ category?: string; sort?: string; color?: string; size?: string; min?: string; max?: string; page?: string }>;
}) {
  const { locale } = await params;
  const { category: categorySlug, sort, color, size, min, max, page } = await searchParams;
  const selectedCategorySlug = getCategory(categorySlug ?? "") ? categorySlug ?? defaultCategorySlug : defaultCategorySlug;
  const category = getCategory(selectedCategorySlug);
  if (!category) return null;

  const t = await getTranslations({ locale, namespace: "category" });
  const name = locale === "ar" ? category.name_ar : category.name_en;
  const categoryItems = getProductsByCategory(selectedCategorySlug);
  const prices = categoryItems.map((product) => product.price);
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 0;
  const colors = Array.from(new Set(categoryItems.flatMap((product) => product.colors))).sort();
  const sizes = Array.from(new Set(categoryItems.flatMap((product) => product.sizes)));
  const minFilter = min && !Number.isNaN(Number(min)) ? Number(min) : undefined;
  const maxFilter = max && !Number.isNaN(Number(max)) ? Number(max) : undefined;
  const filteredItems = filterProducts(categoryItems, {
    colors: color?.split(",").filter(Boolean),
    sizes: size?.split(",").filter(Boolean),
    minPrice: minFilter,
    maxPrice: maxFilter,
  });
  const items = sortProducts(filteredItems, sort);
  const pageSize = 6;
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(Math.max(Number(page) || 1, 1), totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedItems = items.slice(startIndex, startIndex + pageSize);
  const showingStart = items.length ? startIndex + 1 : 0;
  const showingEnd = Math.min(startIndex + pageSize, items.length);
  const paginationBaseParams = new URLSearchParams();
  if (selectedCategorySlug !== defaultCategorySlug) paginationBaseParams.set("category", selectedCategorySlug);
  if (sort) paginationBaseParams.set("sort", sort);
  if (color) paginationBaseParams.set("color", color);
  if (size) paginationBaseParams.set("size", size);
  if (min) paginationBaseParams.set("min", min);
  if (max) paginationBaseParams.set("max", max);

  function pageHref(nextPage: number) {
    const params = new URLSearchParams(paginationBaseParams);
    if (nextPage > 1) params.set("page", String(nextPage));
    else params.delete("page");
    const query = params.toString();
    return query ? `/PLP?${query}` : "/PLP";
  }
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/${locale}` },
      { "@type": "ListItem", position: 2, name, item: `${siteUrl}/${locale}/PLP?category=${selectedCategorySlug}` },
    ],
  };

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-muted" aria-label="Breadcrumb">
        <Link className="transition hover:text-[var(--fg)]" href="/home">
          {t("home")}
        </Link>
        <span aria-hidden="true">/</span>
        <Link className="font-bold text-[var(--fg)] transition hover:opacity-70" href={selectedCategorySlug === defaultCategorySlug ? "/PLP" : `/PLP?category=${selectedCategorySlug}`}>
          {name}
        </Link>
      </nav>

      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        {categories.map((item) => {
          const active = item.slug === selectedCategorySlug;
          const label = locale === "ar" ? item.name_ar : item.name_en;

          return (
            <Link
              key={item.slug}
              href={item.slug === defaultCategorySlug ? "/PLP" : `/PLP?category=${item.slug}`}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition ${
                active
                  ? "border-black bg-black text-white dark:border-white dark:bg-white dark:!text-black"
                  : "border-[var(--border)] bg-[var(--card)] text-[var(--fg)] hover:border-black"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </div>

      <div className="grid gap-5 lg:flex">
        <CategoryFilters
          colors={colors}
          sizes={sizes}
          minPrice={minPrice}
          maxPrice={maxPrice}
          locale={locale}
          currentCategory={selectedCategorySlug}
          categories={categories}
          showMobileButton={false}
        />

        <main className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-4xl font-black">{t("title", { category: name })}</h1>
            <div className="flex flex-wrap items-center gap-3 text-black/60 sm:justify-end">
              <span className="text-sm">
                {t("showing", { start: showingStart, end: showingEnd, total: items.length })}
              </span>
              <CategoryFilters
                colors={colors}
                sizes={sizes}
                minPrice={minPrice}
                maxPrice={maxPrice}
                locale={locale}
                currentCategory={selectedCategorySlug}
                categories={categories}
                showDesktopSidebar={false}
              />
              <CategorySort value={sort ?? "featured"} />
            </div>
          </div>

          {paginatedItems.length ? (
            <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 md:gap-x-5 md:gap-y-9 xl:grid-cols-3">
              {paginatedItems.map((product) => (
                <ProductCard key={product.id} product={product} locale={locale} compact />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-black/10 bg-white p-8 text-center">
              <h2 className="text-2xl font-bold">{t("noProducts")}</h2>
              <p className="mt-2 text-sm text-black/60">{t("tryClearing")}</p>
            </div>
          )}

          <div className="mt-10 flex items-center justify-between gap-3 border-t border-black/10 pt-5">
            {currentPage > 1 ? (
              <Link className="btn-secondary !px-5" href={pageHref(currentPage - 1)}>
                {t("previous")}
              </Link>
            ) : (
              <span className="btn-secondary !px-5 opacity-50">{t("previous")}</span>
            )}
            <div className="hidden gap-2 md:flex">
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                <Link
                  key={pageNumber}
                  href={pageHref(pageNumber)}
                  className={`grid h-10 w-10 place-items-center rounded-lg ${
                    pageNumber === currentPage ? "bg-[var(--background-soft)] font-bold" : ""
                  }`}
                >
                  {pageNumber}
                </Link>
              ))}
            </div>
            <span className="text-sm text-black/60 md:hidden">
              {currentPage} / {totalPages}
            </span>
            {currentPage < totalPages ? (
              <Link className="btn-secondary !px-5" href={pageHref(currentPage + 1)}>
                {t("next")}
              </Link>
            ) : (
              <span className="btn-secondary !px-5 opacity-50">{t("next")}</span>
            )}
          </div>
        </main>
      </div>
    </section>
  );
}
