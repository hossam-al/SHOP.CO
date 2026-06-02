import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { categories, getCategory, getProductsByCategory, sortProducts } from "@/lib/products";
import { buildMetadata, siteUrl } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";
import { ProductCard } from "@/components/ProductCard";
import { CategorySort } from "@/components/CategorySort";

export function generateStaticParams() {
  return categories.flatMap((category) => [
    { locale: "en", slug: category.slug },
    { locale: "ar", slug: category.slug },
  ]);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  const name = locale === "ar" ? category.name_ar : category.name_en;
  const site = await getTranslations({ locale, namespace: "site" });
  return buildMetadata({
    locale,
    path: `/category/${slug}`,
    title: `${name} | ${site("name")}`,
    description: site("description"),
  });
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
  searchParams: Promise<{ sort?: string }>;
}) {
  const { locale, slug } = await params;
  const { sort } = await searchParams;
  const category = getCategory(slug);
  if (!category) notFound();
  const t = await getTranslations({ locale, namespace: "category" });
  const name = locale === "ar" ? category.name_ar : category.name_en;
  const items = sortProducts(getProductsByCategory(slug), sort);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/${locale}` },
      { "@type": "ListItem", position: 2, name, item: `${siteUrl}/${locale}/category/${slug}` },
    ],
  };

  return (
    <section className="container-page py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-muted">{items.length} products</p>
          <h1 className="mt-2 text-4xl font-black">{t("title", { category: name })}</h1>
        </div>
        <CategorySort value={sort ?? "featured"} />
      </div>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} locale={locale} />
        ))}
      </div>
    </section>
  );
}
