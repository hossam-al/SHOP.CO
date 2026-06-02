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
    <section className="container-page py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <div className="mb-8 text-black/60">Home › Shop › Men › <span className="text-black">{name}</span></div>
      <div className="grid gap-10 lg:grid-cols-[610px_1fr]">
        <div className="grid gap-4 md:grid-cols-[152px_1fr]">
          <div className="grid grid-cols-3 gap-3 md:grid-cols-1">
            {[0, 1, 2].map((thumb) => (
              <div key={thumb} className={`overflow-hidden rounded-[20px] bg-[#f0f0f0] ${thumb === 0 ? "ring-2 ring-black" : ""}`}>
                <Image src={product.image} width={152} height={167} alt="" className="aspect-[152/167] w-full object-cover" />
              </div>
            ))}
          </div>
          <div className="overflow-hidden rounded-[20px] bg-[#f0f0f0]">
            <Image src={product.image} width={900} height={900} alt={name} priority className="aspect-square w-full object-cover" />
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="shop-heading text-[40px]">{name}</h1>
          <div className="mt-3 flex items-center gap-3"><span className="stars">★★★★★</span><span>{product.rating}/5</span></div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <strong className="text-3xl">${product.price}</strong>
            {product.oldPrice ? <span className="text-3xl font-bold text-black/30 line-through">${product.oldPrice}</span> : null}
            {product.discount ? <span className="discount-pill">-{product.discount}%</span> : null}
          </div>
          <p className="mt-5 border-b border-black/10 pb-6 leading-7 text-muted">{description}</p>
          <div className="border-b border-black/10 py-6">
            <p className="mb-4 text-black/60">Select Colors</p>
            <div className="flex gap-3">
              {product.colors.map((color, index) => (
                <span key={color} className="grid h-9 w-9 place-items-center rounded-full border border-black/10 text-white" style={{ backgroundColor: color }}>{index === 0 ? "✓" : ""}</span>
              ))}
            </div>
          </div>
          <div className="border-b border-black/10 py-6">
            <p className="mb-4 text-black/60">Choose Size</p>
            <div className="flex flex-wrap gap-3">
              {product.sizes.map((size) => <span key={size} className={`rounded-full px-6 py-3 ${size === "Large" ? "bg-black text-white" : "bg-[#f0f0f0] text-black/60"}`}>{size}</span>)}
            </div>
          </div>
          <div className="mt-6 max-w-xl">
            <ProductQuickActions productId={product.id} inStock={product.inStock} />
          </div>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-3 border-b border-black/10 text-center">
        <span className="pb-5 text-black/60">Product Details</span>
        <span className="border-b-2 border-black pb-5 font-medium">Rating & Reviews</span>
        <span className="pb-5 text-black/60">FAQs</span>
      </div>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">All Reviews <span className="text-base text-black/40">(451)</span></h2>
        <div className="flex gap-3"><button className="btn-secondary !px-5">Latest⌄</button><button className="btn-primary">Write a Review</button></div>
      </div>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {["Samantha D.", "Alex M.", "Ethan R.", "Olivia P.", "Liam K.", "Ava H."].map((reviewer) => (
          <article key={reviewer} className="card p-7">
            <p className="stars">★★★★★</p>
            <h3 className="mt-3 font-bold">{reviewer} <span className="text-green-500">●</span></h3>
            <p className="mt-3 leading-7 text-muted">This t-shirt is a must-have for anyone who appreciates good design. The fabric is soft and the fit is perfect.</p>
            <p className="mt-5 text-sm text-black/60">Posted on August 14, 2023</p>
          </article>
        ))}
      </div>
      <div className="mt-8 text-center"><button className="btn-secondary">Load More Reviews</button></div>

      <div className="mt-20">
        <h2 className="section-title">{t("related")}</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item) => (
            <ProductCard key={item.id} product={item} locale={locale} compact />
          ))}
        </div>
      </div>
    </section>
  );
}
