import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/routing";

export async function Footer({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "site" });

  return (
    <footer className="mt-20 border-t border-[var(--border)]">
      <div className="container-page grid gap-8 py-10 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <p className="text-xl font-bold">{t("name")}</p>
          <p className="mt-3 max-w-md text-muted">{t("tagline")}</p>
        </div>
        <nav className="grid gap-2" aria-label="Footer">
          <Link href="/">{t("home")}</Link>
          <Link href="/about">{t("about")}</Link>
          <Link href="/contact">{t("contact")}</Link>
        </nav>
        <nav className="grid gap-2" aria-label="Shop footer">
          <Link href="/category/apparel">Apparel</Link>
          <Link href="/category/bags">Bags</Link>
          <Link href="/category/home">Home</Link>
        </nav>
      </div>
    </footer>
  );
}
