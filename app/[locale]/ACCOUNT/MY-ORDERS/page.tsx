import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { MyOrdersClient } from "@/components/account/MyOrdersClient";
import type { Locale } from "@/i18n/routing";
import { buildMetadata } from "@/seo/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const account = await getTranslations({ locale, namespace: "accountPage" });
  const site = await getTranslations({ locale, namespace: "site" });

  return buildMetadata({
    locale,
    path: "/ACCOUNT/MY-ORDERS",
    title: `${account("myOrders")} | ${site("name")}`,
    description: account("ordersCopy"),
  });
}

export default function MyOrdersPage() {
  return <MyOrdersClient />;
}
