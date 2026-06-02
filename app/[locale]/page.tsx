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

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const home = await getTranslations({ locale, namespace: "home" });

  return (
    <>
      <section className="overflow-hidden bg-[#F2F0F1]">
        <div className="mx-auto flex min-h-[590px] max-w-[1240px] flex-col px-4 pt-8 md:flex-row md:items-center md:justify-between md:gap-8 md:px-6 lg:px-8 lg:pt-0">
          {/* Left content */}
          <div className="relative z-10 w-full md:w-1/2">
            <h1
              className="max-w-[577px] uppercase font-black leading-tight tracking-tight
                     text-[32px] sm:text-[40px] md:text-[52px] lg:text-[64px] lg:tracking-[-2px]"
            >
              FIND CLOTHES
              <br />
              THAT MATCHES
              <br />
              YOUR STYLE
            </h1>
            <p
              className="mt-4 max-w-[550px] text-[14px] leading-[22px] text-gray-600
                     sm:text-base lg:mt-6 lg:text-lg lg:leading-8"
            >
              Browse through our diverse range of meticulously crafted garments,
              designed to bring out your individuality and cater to your sense
              of style.
            </p>
            <button
              className="mt-5 w-full rounded-full bg-black px-12 py-4 text-white transition hover:opacity-90
                         sm:w-auto lg:mt-8"
            >
              Shop Now
            </button>
            {/* الإحصائيات كما هى… */}
          </div>

          {/* Right image */}
          <div className="relative mt-6 w-full md:mt-0 md:w-1/2">
            {/* صورة الموبايل: داخل الـ flow بدون absolute */}
            <img
              src="/images/Rectangle 2.svg"
              alt="Fashion Models"
              className="block md:hidden mx-auto h-[500px] w-auto max-w-none object-contain"
            />

            {/* صورة التابلت: كبيرة مع انزياح بسيط لليمين */}
            <img
              src="/images/Rectangle 2.svg"
              alt="Fashion Models"
              className="hidden md:block lg:hidden mx-auto h-[550px] w-auto max-w-none md:-ml-10 object-contain"
            />

            {/* صورة الديسكتوب: absolute لتخرج من حدود القسم */}
            <img
              src="/images/Rectangle 2.svg"
              alt="Fashion Models"
              className="hidden lg:block absolute bottom-[-75px] right-[-40px] h-[620px] w-auto max-w-none"
            />

            {/* النجوم تظل absolute كما هى */}
            <span className="absolute right-8 top-8 text-7xl text-black lg:right-8 lg:top-20 lg:text-8xl">
              ✦
            </span>
            <span className="absolute left-2 top-36 text-5xl text-black lg:left-0 lg:top-64">
              ✦
            </span>
          </div>
        </div>
      </section>
      <section id="brands" className="bg-black py-8 text-white">
        <div className="container-page flex flex-wrap items-center justify-between gap-8 text-3xl font-black tracking-wide md:text-4xl">
          <span>VERSACE</span>
          <span>ZARA</span>
          <span>GUCCI</span>
          <span>PRADA</span>
          <span>Calvin Klein</span>
        </div>
      </section>

      <section id="new-arrivals" className="container-page py-16">
        <h2 className="section-title">{home("preview")}</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 4).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              locale={locale}
              compact
            />
          ))}
        </div>
        <div className="mt-9 text-center">
          <Link className="btn-secondary min-w-52" href="/category/casual">
            {home("secondaryCta")}
          </Link>
        </div>
      </section>

      <section className="container-page border-t border-black/10 py-16">
        <h2 className="section-title">{home("topSelling")}</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(4, 8).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              locale={locale}
              compact
            />
          ))}
        </div>
        <div className="mt-9 text-center">
          <Link className="btn-secondary min-w-52" href="/category/casual">
            {home("secondaryCta")}
          </Link>
        </div>
      </section>

      <section
        id="categories"
        className="container-page rounded-[40px] bg-[var(--background-soft)] p-8 md:p-14"
      >
        <h2 className="section-title">{home("featuredCategories")}</h2>
        <div className="mt-10 grid auto-rows-[190px] gap-5 md:grid-cols-3">
          {categories.map((category, index) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className={`relative overflow-hidden rounded-[20px] bg-white p-8 text-3xl font-bold ${index === 1 || index === 2 ? "md:col-span-2" : ""}`}
            >
              {locale === "ar" ? category.name_ar : category.name_en}
              <Image
                src={products[index + 1]?.image ?? "/images/basic-tee.svg"}
                alt=""
                width={340}
                height={240}
                className="absolute bottom-0 end-0 h-full w-1/2 object-contain"
              />
            </Link>
          ))}
        </div>
      </section>

      <section className="container-page py-20">
        <h2 className="text-4xl font-black uppercase md:text-5xl">
          {home("customers")}
        </h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {["Sarah M.", "Alex K.", "James L."].map((name) => (
            <article key={name} className="card p-6">
              <p className="stars">★★★★★</p>
              <h3 className="mt-3 font-bold">
                {name} <span className="text-green-500">●</span>
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted">
                I'm blown away by the quality and style of the clothes I
                received from Shop.co. The range of options is impressive.
              </p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
