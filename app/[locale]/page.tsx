import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { categories, products } from "@/lib/products";
import { buildMetadata } from "@/lib/seo";
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
      <section className="container-page grid items-center gap-10 py-12 md:grid-cols-[1.05fr_0.95fr] md:py-20">
        <div>
          <p className="font-bold uppercase tracking-[0.2em] text-[var(--accent)]">Nordic Cart</p>
          <h1 className="mt-4 max-w-3xl text-5xl font-black leading-tight md:text-7xl">
            {home("title")}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">{home("subtitle")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="btn-primary" href="/category/apparel">
              {home("cta")} <ArrowRight size={18} />
            </Link>
            <Link className="btn-secondary" href="#categories">
              {home("secondaryCta")}
            </Link>
          </div>
        </div>
        <div className="relative min-h-[420px] overflow-hidden rounded-lg bg-[#e8dfd0]">
          <Image
            src="/images/basic-tee.svg"
            alt=""
            fill
            priority
            className="object-cover p-10"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </section>

      <section id="categories" className="container-page py-10">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-3xl font-black">{home("featuredCategories")}</h2>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="card flex min-h-36 items-end justify-between p-5 transition hover:-translate-y-1"
            >
              <span className="text-2xl font-black">
                {locale === "ar" ? category.name_ar : category.name_en}
              </span>
              <span className="text-muted">{products.filter((p) => p.category === category.slug).length}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-page py-10">
        <h2 className="text-3xl font-black">{home("preview")}</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.slice(0, 6).map((product) => (
            <ProductCard key={product.id} product={product} locale={locale} />
          ))}
        </div>
      </section>

      <section className="container-page py-10">
        <div className="card grid gap-4 bg-[var(--fg)] p-8 text-[var(--bg)] md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 className="text-3xl font-black">{home("newsletter")}</h2>
            <p className="mt-2 opacity-80">{home("newsletterCopy")}</p>
          </div>
          <Link className="btn-primary" href="/contact">
            {home("cta")}
          </Link>
        </div>
      </section>
    </>
  );
}
