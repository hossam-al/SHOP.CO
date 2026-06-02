import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ContactForm } from "@/components/forms/ContactForm";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const pages = await getTranslations({ locale, namespace: "pages" });
  const site = await getTranslations({ locale, namespace: "site" });
  return buildMetadata({ locale, path: "/contact", title: `${pages("contactTitle")} | ${site("name")}`, description: site("description") });
}

export default async function ContactPage() {
  const pages = await getTranslations("pages");
  return (
    <section className="container-page py-12">
      <h1 className="mb-8 text-center text-4xl font-black">{pages("contactTitle")}</h1>
      <ContactForm />
    </section>
  );
}
