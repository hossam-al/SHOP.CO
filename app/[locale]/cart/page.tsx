import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CartClient } from "@/components/commerce/CartClient";
import type { Locale } from "@/i18n/routing";
import { buildMetadata } from "@/seo/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "cart" });
  const site = await getTranslations({ locale, namespace: "site" });
  return buildMetadata({ locale, path: "/CART", title: `${t("title")} | ${site("name")}`, description: site("description") });
}

export default function CartPage() {
  return <CartClient />;
}
