import type { Metadata } from "next";
import { WishlistClient } from "@/components/account/WishlistClient";
import type { Locale } from "@/i18n/routing";
import { buildMetadata } from "@/seo/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;

  return buildMetadata({
    locale,
    path: "/WISHLIST",
    title: "Wishlist | SHOP.CO",
    description: "View saved SHOP.CO products.",
  });
}

export default function WishlistPage() {
  return <WishlistClient />;
}
