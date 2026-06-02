import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getProduct, getProductsByCategory, products } from "@/lib/products";
import { buildMetadata, siteUrl } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";
import { localizedDescription, localizedName } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";
import { ProductQuickActions } from "@/components/ProductQuickActions";

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
    path: `/product/${id}`,
    title: localizedName(product, locale),
    description: localizedDescription(product, locale),
  });
}

export default async function ProductPage({ params }: { params: Promise<{ locale: Locale; id: string }> }) {
  const { locale, id } = await params;
  const product = getProduct(id);
  if (!product) notFound();
  const t = await getTranslations({ locale, namespace: "product" });
  const name = localizedName(product, locale);
  const description = localizedDescription(product, locale);
  const related = getProductsByCategory(product.category).filter((item) => item.id !== product.id).slice(0, 3);

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
      url: `${siteUrl}/${locale}/product/${product.id}`,
    },
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/${locale}` },
      { "@type": "ListItem", position: 2, name, item: `${siteUrl}/${locale}/product/${product.id}` },
    ],
  };

  return (
    <section className="container-page py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="card overflow-hidden bg-[#f1ede4]">
          <Image
            src={product.image}
            width={900}
            height={900}
            alt={name}
            priority
            className="aspect-square w-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-center">
          <p className="font-bold capitalize text-[var(--accent)]">{product.category}</p>
          <h1 className="mt-3 text-5xl font-black">{name}</h1>
          <p className="mt-5 text-lg leading-8 text-muted">{description}</p>
          <strong className="mt-6 text-3xl">${product.price.toFixed(2)}</strong>
          <p className={product.inStock ? "mt-3 text-green-700" : "mt-3 text-red-600"}>
            {product.inStock ? t("inStock") : t("outStock")}
          </p>
          <div className="mt-8 max-w-md">
            <ProductQuickActions productId={product.id} inStock={product.inStock} />
          </div>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-3xl font-black">{t("related")}</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((item) => (
            <ProductCard key={item.id} product={item} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  );
}
