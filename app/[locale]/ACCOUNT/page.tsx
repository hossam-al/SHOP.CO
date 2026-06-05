import type { Metadata } from "next";
import { AccountClient } from "@/components/account/AccountClient";
import type { Locale } from "@/i18n/routing";
import { buildMetadata } from "@/seo/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;

  return buildMetadata({
    locale,
    path: "/ACCOUNT",
    title: "Account | SHOP.CO",
    description: "Manage your SHOP.CO account.",
  });
}

export default function AccountPage() {
  return <AccountClient />;
}
