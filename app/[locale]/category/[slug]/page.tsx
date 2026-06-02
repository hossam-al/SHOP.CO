import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { categories, getCategory, getProductsByCategory, sortProducts } from "@/lib/products";
import { buildMetadata, siteUrl } from "@/seo/metadata";
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

  const filters = ["T-shirts", "Shorts", "Shirts", "Hoodie", "Jeans"];
  const sizes = ["XX-Small", "X-Small", "Small", "Medium", "Large", "X-Large", "XX-Large", "3X-Large", "4X-Large"];
  const colors = ["#00C12B", "#F50606", "#F5DD06", "#F57906", "#06CAF5", "#063AF5", "#7D06F5", "#F506A4", "#FFFFFF", "#000000"];
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/${locale}` },
      { "@type": "ListItem", position: 2, name, item: `${siteUrl}/${locale}/category/${slug}` },
    ],
  };

  return (
    <section className="container-page py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <div className="mb-8 text-black/60">Home › <span className="text-black">{name}</span></div>
      <div className="grid gap-8 lg:grid-cols-[295px_1fr]">
        <aside className="hidden h-fit rounded-[20px] border border-black/10 p-6 lg:block">
          <div className="flex items-center justify-between border-b border-black/10 pb-5">
            <h2 className="text-xl font-bold">Filters</h2>
            <span>☷</span>
          </div>
          <div className="grid gap-4 border-b border-black/10 py-5 text-black/60">
            {filters.map((filter) => <span key={filter} className="flex justify-between">{filter}<b>›</b></span>)}
          </div>
          <div className="border-b border-black/10 py-5">
            <h3 className="mb-5 text-xl font-bold">Price</h3>
            <div className="h-2 rounded-full bg-black"></div>
            <div className="mt-2 flex justify-between text-sm"><span>$50</span><span>$200</span></div>
          </div>
          <div className="border-b border-black/10 py-5">
            <h3 className="mb-4 text-xl font-bold">Colors</h3>
            <div className="flex flex-wrap gap-3">
              {colors.map((color) => <span key={color} className="h-9 w-9 rounded-full border border-black/10" style={{ backgroundColor: color }} />)}
            </div>
          </div>
          <div className="border-b border-black/10 py-5">
            <h3 className="mb-4 text-xl font-bold">Size</h3>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => <span key={size} className={`rounded-full px-4 py-2 text-sm ${size === "Large" ? "bg-black text-white" : "bg-[var(--background-soft)] text-black/60"}`}>{size}</span>)}
            </div>
          </div>
          <div className="py-5">
            <h3 className="mb-4 text-xl font-bold">Dress Style</h3>
            <div className="grid gap-3 text-black/60">
              {["Casual", "Formal", "Party", "Gym"].map((style) => <span key={style} className="flex justify-between">{style}<b>›</b></span>)}
            </div>
          </div>
          <button className="btn-primary w-full">Apply Filter</button>
        </aside>
        <div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-4xl font-black">{t("title", { category: name })}</h1>
            <div className="flex items-center gap-4 text-black/60">
              <span className="hidden md:inline">Showing 1-{items.length} of 100 Products</span>
              <CategorySort value={sort ?? "featured"} />
            </div>
          </div>
          <div className="mt-6 grid gap-x-5 gap-y-9 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} locale={locale} compact />
            ))}
          </div>
          <div className="mt-10 flex items-center justify-between border-t border-black/10 pt-5">
            <button className="btn-secondary !px-5">← Previous</button>
            <div className="hidden gap-2 md:flex">
              {[1, 2, 3].map((page) => <span key={page} className={`grid h-10 w-10 place-items-center rounded-lg ${page === 1 ? "bg-[var(--background-soft)]" : ""}`}>{page}</span>)}
              <span className="grid h-10 w-10 place-items-center">...</span>
              <span className="grid h-10 w-10 place-items-center">10</span>
            </div>
            <button className="btn-secondary !px-5">Next →</button>
          </div>
        </div>
      </div>
    </section>
  );
}
