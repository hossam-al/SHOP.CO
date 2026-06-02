import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildMetadata } from "@/seo/metadata";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const pages = await getTranslations({ locale, namespace: "pages" });
  const site = await getTranslations({ locale, namespace: "site" });
  return buildMetadata({ locale, path: "/about", title: `${pages("aboutTitle")} | ${site("name")}`, description: pages("aboutCopy") });
}

export default async function AboutPage() {
  const pages = await getTranslations("pages");
  return (
    <section className="container-page py-16">
      <h1 className="max-w-3xl text-5xl font-black">{pages("aboutTitle")}</h1>
      <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">{pages("aboutCopy")}</p>
    </section>
  );
}
