import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { categories, products } from "@/lib/products";
import { buildMetadata } from "@/seo/metadata";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import { CustomerReviewsSlider } from "@/components/CustomerReviewsSlider";
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
  const styleImages: Record<string, string> = {
    casual: "image 11.png",
    formal: "image 13.png",
    party: "image 12.png",
    gym: "image 14.png",
  };
  const styleCards: Record<string, { card: string; image: string }> = {
    casual: {
      card: "md:col-span-1",
      image: "right-0 w-[78%] object-right-bottom",
    },
    formal: {
      card: "md:col-span-2",
      image: "right-10 w-[76%] object-left-bottom",
    },
    party: {
      card: "md:col-span-2",
      image: "right-[18%] w-[70%] object-left-bottom",
    },
    gym: {
      card: "md:col-span-1",
      image: "right-0 w-[82%] object-right-bottom",
    },
  };

  return (
    <>
      <section className="overflow-hidden bg-[#F2F0F1]">
        <div className="mx-auto flex max-w-[1240px] flex-col px-4 md:min-h-[540px] md:flex-row md:items-stretch md:justify-between md:px-6 lg:px-8">
          <div className="relative z-10 flex w-full flex-col justify-center py-10 md:w-[46%] md:pb-12 md:pt-14">
            <h1 className="shop-heading max-w-[585px] text-[36px] leading-[36px] sm:text-[44px] sm:leading-[44px] lg:text-[64px] lg:leading-[64px]">
              {home("title")}
            </h1>

            <p className="mt-5 max-w-[545px] text-sm leading-5 text-[#666666] sm:text-base lg:mt-6">
              {home("subtitle")}
            </p>

            <Link
              className="btn-primary mt-6 w-full sm:w-[210px] lg:mt-8"
              href="/category/casual"
            >
              {home("cta")}
            </Link>

            <div className="mt-10 grid w-full grid-cols-2 gap-y-6 text-center lg:mt-12 lg:flex lg:items-center lg:gap-7 lg:text-left">
              <div>
                <h3 className="text-[30px] font-bold leading-none lg:text-[40px]">
                  200+
                </h3>
                <p className="mt-1 text-xs text-[#666666] lg:text-sm">
                  International Brands
                </p>
              </div>

              <div className="hidden h-14 w-px bg-black/10 lg:block" />

              <div className="border-l border-black/10 lg:border-l-0">
                <h3 className="text-[30px] font-bold leading-none lg:text-[40px]">
                  2,000+
                </h3>
                <p className="mt-1 text-xs text-[#666666] lg:text-sm">
                  High-Quality Products
                </p>
              </div>

              <div className="hidden h-14 w-px bg-black/10 lg:block" />

              <div className="col-span-2 lg:col-span-1">
                <h3 className="text-[30px] font-bold leading-none lg:text-[40px]">
                  30,000+
                </h3>
                <p className="mt-1 text-xs text-[#666666] lg:text-sm">
                  Happy Customers
                </p>
              </div>
            </div>
          </div>

          <div className="relative flex h-[420px] w-full items-end justify-center overflow-hidden md:h-auto md:w-[54%] md:justify-end">
            <img
              src="/images/Rectangle 2.jpg"
              alt="Fashion Models"
              className="h-[112%] w-auto max-w-none translate-y-8 object-cover md:h-[610px] md:translate-y-12 lg:h-[635px] lg:translate-y-14 xl:h-[650px]"
            />

            <span
              aria-hidden
              className="sparkle sparkle-large absolute right-8 top-8 h-16 w-16 md:right-8 md:top-20 lg:h-20 lg:w-20"
            />
            <span
              aria-hidden
              className="sparkle sparkle-small absolute left-4 top-36 h-10 w-10 md:left-0 md:top-64"
            />
          </div>
        </div>
      </section>

      <section id="brands" className="bg-black py-7 text-white">
        <div className="container-page flex flex-wrap items-center justify-center gap-x-12 gap-y-5 text-center text-3xl font-black md:justify-between md:text-4xl">
          <span className="font-serif font-normal tracking-tight">VERSACE</span>
          <span className="font-serif tracking-tight">ZARA</span>
          <span className="font-serif font-normal tracking-[0.16em]">
            GUCCI
          </span>
          <span className="font-serif tracking-tight">PRADA</span>
          <span className="font-sans font-normal tracking-tight">
            Calvin Klein
          </span>
        </div>
      </section>

      <section id="new-arrivals" className="container-page py-16">
        <h2 className="section-title">{home("preview")}</h2>
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 md:gap-5 lg:grid-cols-4">
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
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 md:gap-5 lg:grid-cols-4">
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
        className="container-page rounded-[40px] bg-[var(--background-soft)] px-6 py-10 md:px-14 md:py-16"
      >
        <h2 className="section-title">{home("featuredCategories")}</h2>
        <div className="mt-10 grid auto-rows-[190px] gap-5 md:grid-cols-3">
          {categories.map((category, index) => {
            const layout = styleCards[category.slug] ?? styleCards.casual;

            return (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className={`group relative overflow-hidden rounded-[8px] bg-white p-6 text-2xl font-bold text-black transition duration-300 hover:-translate-y-1 hover:shadow-xl ${layout.card}`}
              >
                <span className="relative z-10 block">
                  {locale === "ar" ? category.name_ar : category.name_en}
                </span>
                <img
                  src={encodeURI(
                    `/images/STYLE_Section/${styleImages[category.slug] ?? `image ${11 + index}.png`}`,
                  )}
                  alt={category.name_en}
                  className={`absolute bottom-0 h-full max-w-none object-contain transition duration-300 group-hover:scale-105 ${layout.image}`}
                />
              </Link>
            );
          })}
        </div>
      </section>

      <section className="w-full overflow-hidden py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-black uppercase md:text-5xl">
            {home("customers")}
          </h2>
          <CustomerReviewsSlider />
        </div>
      </section>
    </>
  );
}
