import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { categories, products } from "@/lib/products";
import { buildMetadata } from "@/seo/metadata";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import { ProductCard } from "@/components/ProductCard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "site" });
  return buildMetadata({
    locale,
    path: "/",
    title: `${t("name")} | ${t("tagline")}`,
    description: t("description"),
  });
}

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const home = await getTranslations({ locale, namespace: "home" });

  return (
    <>
      <section className="bg-[#f2f0f1]">
        <div className="container-page grid min-h-[590px] items-center gap-10 md:grid-cols-[1fr_0.95fr]">
        <div>
          <h1 className="shop-heading max-w-2xl">
            {home("title")}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">{home("subtitle")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="btn-primary" href="/category/casual">
              {home("cta")}
            </Link>
          </div>
          <div className="mt-12 grid max-w-2xl grid-cols-3 gap-6">
            <div><strong className="text-4xl">200+</strong><p className="text-sm text-muted">International Brands</p></div>
            <div><strong className="text-4xl">2,000+</strong><p className="text-sm text-muted">High-Quality Products</p></div>
            <div><strong className="text-4xl">30,000+</strong><p className="text-sm text-muted">Happy Customers</p></div>
          </div>
        </div>
        <div className="relative min-h-[590px] overflow-hidden">
          <div className="absolute bottom-0 end-8 h-[520px] w-[320px] rounded-t-full bg-black/10" />
          <Image src="/images/polo.svg" alt="" fill priority className="object-contain object-bottom" sizes="(max-width: 768px) 100vw, 50vw" />
          <span className="absolute end-8 top-24 text-8xl">✦</span>
          <span className="absolute start-8 top-72 text-5xl">✦</span>
        </div>
        </div>
      </section>

      <section id="brands" className="bg-black py-8 text-white">
        <div className="container-page flex flex-wrap items-center justify-between gap-8 text-3xl font-black tracking-wide md:text-4xl">
          <span>VERSACE</span><span>ZARA</span><span>GUCCI</span><span>PRADA</span><span>Calvin Klein</span>
        </div>
      </section>

      <section id="new-arrivals" className="container-page py-16">
        <h2 className="section-title">{home("preview")}</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} locale={locale} compact />
          ))}
        </div>
        <div className="mt-9 text-center"><Link className="btn-secondary min-w-52" href="/category/casual">{home("secondaryCta")}</Link></div>
      </section>

      <section className="container-page border-t border-black/10 py-16">
        <h2 className="section-title">{home("topSelling")}</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(4, 8).map((product) => (
            <ProductCard key={product.id} product={product} locale={locale} compact />
          ))}
        </div>
        <div className="mt-9 text-center"><Link className="btn-secondary min-w-52" href="/category/casual">{home("secondaryCta")}</Link></div>
      </section>

      <section id="categories" className="container-page rounded-[40px] bg-[var(--background-soft)] p-8 md:p-14">
        <h2 className="section-title">{home("featuredCategories")}</h2>
        <div className="mt-10 grid auto-rows-[190px] gap-5 md:grid-cols-3">
          {categories.map((category, index) => (
            <Link key={category.slug} href={`/category/${category.slug}`} className={`relative overflow-hidden rounded-[20px] bg-white p-8 text-3xl font-bold ${index === 1 || index === 2 ? "md:col-span-2" : ""}`}>
              {locale === "ar" ? category.name_ar : category.name_en}
              <Image src={products[index + 1]?.image ?? "/images/basic-tee.svg"} alt="" width={340} height={240} className="absolute bottom-0 end-0 h-full w-1/2 object-contain" />
            </Link>
          ))}
        </div>
      </section>

      <section className="container-page py-20">
        <h2 className="text-4xl font-black uppercase md:text-5xl">{home("customers")}</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {["Sarah M.", "Alex K.", "James L."].map((name) => (
            <article key={name} className="card p-6">
              <p className="stars">★★★★★</p>
              <h3 className="mt-3 font-bold">{name} <span className="text-green-500">●</span></h3>
              <p className="mt-3 text-sm leading-6 text-muted">I'm blown away by the quality and style of the clothes I received from Shop.co. The range of options is impressive.</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
