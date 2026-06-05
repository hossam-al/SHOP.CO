import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductDetailClient } from "@/components/product/ProductDetailClient";
import type { Locale } from "@/i18n/routing";
import { categories, getProduct, getProductsByCategory, products } from "@/lib/products";
import { buildMetadata, siteUrl } from "@/seo/metadata";
import { localizedDescription, localizedName } from "@/types/product";

export function generateStaticParams() {
  return products.flatMap((product) => [
    { locale: "en", id: product.id },
    { locale: "ar", id: product.id },
  ]);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const product = getProduct(id);
  if (!product) return {};

  return buildMetadata({
    locale,
    path: `/PDP/${id}`,
    title: localizedName(product, locale),
    description: localizedDescription(product, locale),
  });
}

export default async function ProductPage({ params }: { params: Promise<{ locale: Locale; id: string }> }) {
  const { locale, id } = await params;
  const product = getProduct(id);
  if (!product) notFound();

  const name = localizedName(product, locale);
  const description = localizedDescription(product, locale);
  const category = categories.find((item) => item.slug === product.category);
  const categoryName = category ? (locale === "ar" ? category.name_ar : category.name_en) : product.category;
  const related = getProductsByCategory(product.category).filter((item) => item.id !== product.id).slice(0, 4);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image: `${siteUrl}${product.image}`,
    sku: product.id,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "USD",
      availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${siteUrl}/${locale}/PDP/${product.id}`,
    },
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: locale === "ar" ? "الرئيسية" : "Home", item: `${siteUrl}/${locale}/home` },
      { "@type": "ListItem", position: 2, name: categoryName, item: `${siteUrl}/${locale}/PLP` },
      { "@type": "ListItem", position: 3, name, item: `${siteUrl}/${locale}/PDP/${product.id}` },
    ],
  };

  return (
    <section className="container-page py-4 sm:py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <ProductDetailClient
        product={product}
        locale={locale}
        name={name}
        description={description}
        categoryName={categoryName}
      />

      <div className="mt-14 sm:mt-20">
        <h2 className="section-title text-[32px] sm:text-[clamp(32px,4vw,48px)]">
          {locale === "ar" ? "منتجات قد تعجبك" : "YOU MIGHT ALSO LIKE"}
        </h2>
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 md:mt-10 md:gap-5 lg:grid-cols-4">
          {related.map((item) => (
            <ProductCard key={item.id} product={item} locale={locale} compact />
          ))}
        </div>
      </div>
    </section>
  );
}
