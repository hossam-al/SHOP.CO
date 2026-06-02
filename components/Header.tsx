"use client";

import { Menu, Moon, Search, ShoppingBag, Sun, User, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { categories, products } from "@/lib/products";
import { localizedName } from "@/lib/types";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import { useShopStore } from "@/store/use-shop-store";

export function Header({ locale }: { locale: Locale }) {
  const t = useTranslations("site");
  const pathname = usePathname();
  const router = useRouter();
  const activeLocale = useLocale() as Locale;
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const cartCount = useShopStore((state) => state.cart.reduce((sum, line) => sum + line.quantity, 0));
  const wishlistCount = useShopStore((state) => state.wishlist.length);
  const user = useShopStore((state) => state.user);
  const logout = useShopStore((state) => state.logout);
  const theme = useShopStore((state) => state.theme);
  const toggleTheme = useShopStore((state) => state.toggleTheme);

  const results = useMemo(() => {
    const clean = query.trim().toLowerCase();
    if (!clean) return [];
    return products.filter((product) =>
      `${product.name_en} ${product.name_ar}`.toLowerCase().includes(clean),
    );
  }, [query]);

  function switchLocale(nextLocale: Locale) {
    const nextPath = pathname.replace(/^\/(en|ar)/, `/${nextLocale}`);
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000`;
    router.push(nextPath);
  }

  return (
    <header className="sticky top-0 z-40 bg-[var(--bg)]">
      <div className="bg-black py-2 text-center text-sm text-white">
        <span>Sign up and get 20% off to your first order. </span>
        <Link href="/signup" className="font-bold underline">Sign Up Now</Link>
        <X className="absolute end-6 top-2 hidden h-5 w-5 md:block" />
      </div>
      <div className="container-page flex min-h-24 items-center justify-between gap-6 border-b border-[var(--border)]">
        <Link href="/" className="text-[32px] font-black tracking-tighter" aria-label={t("home")}>
          {t("name")}
        </Link>

        <nav className="hidden items-center gap-7 text-base md:flex" aria-label="Main">
          <Link href="/category/casual">{t("shop")}⌄</Link>
          <Link href="/category/party">{t("sale")}</Link>
          <Link href="/#new-arrivals">{t("newArrivals")}</Link>
          <Link href="/#brands">{t("brands")}</Link>
          <span className="hidden">
            <Link href="/">{t("home")}</Link>
          </span>
          <span className="hidden">
          {categories.map((category) => (
            <Link key={category.slug} href={`/category/${category.slug}`}>
              {locale === "ar" ? category.name_ar : category.name_en}
            </Link>
          ))}
          </span>
        </nav>

        <div className="relative hidden flex-1 lg:block">
          <label className="sr-only" htmlFor="site-search">
            {t("search")}
          </label>
          <Search className="pointer-events-none absolute start-3 top-3 h-5 w-5 text-muted" />
          <input
            id="site-search"
            className="field h-14 ps-12"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("search")}
          />
          {query ? (
            <div className="card absolute inset-x-0 top-14 max-h-80 overflow-auto p-2 shadow-xl">
              {results.length ? (
                results.map((product) => (
                  <Link
                    key={product.id}
                    className="block rounded-md px-3 py-2 hover:bg-black/5 dark:hover:bg-white/10"
                    href={`/product/${product.id}`}
                    onClick={() => setQuery("")}
                  >
                    {localizedName(product, activeLocale)}
                  </Link>
                ))
              ) : (
                <p className="px-3 py-2 text-sm text-muted">{t("emptySearch")}</p>
              )}
            </div>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <button className="hidden rounded-full p-2 sm:inline-flex" onClick={toggleTheme} aria-label={t("theme")}>
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            className="rounded-full px-2 py-2 font-bold"
            onClick={() => switchLocale(locale === "en" ? "ar" : "en")}
            aria-label={t("language")}
          >
            {locale === "en" ? "AR" : "EN"}
          </button>
          <Link className="flex items-center gap-1 rounded-full p-2" href="/cart" aria-label={t("cart")}>
            <ShoppingBag size={18} />
            <span>{cartCount}</span>
          </Link>
          <span className="sr-only">{wishlistCount}</span>
          {user ? (
            <details className="relative hidden sm:block">
              <summary className="btn-secondary cursor-pointer !px-3">
                <User size={18} /> {user.name}
              </summary>
              <button
                className="card absolute end-0 top-12 min-w-32 px-4 py-3 text-start shadow-xl"
                onClick={logout}
              >
                {t("logout")}
              </button>
            </details>
          ) : (
            <Link className="hidden rounded-full p-2 sm:inline-flex" href="/login" aria-label={t("login")}>
              <User size={20} />
            </Link>
          )}
          <button className="btn-secondary !px-3 md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            <Menu size={18} />
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav className="container-page grid gap-3 border-t border-[var(--border)] py-4 md:hidden">
          <Link href="/" onClick={() => setMenuOpen(false)}>
            {t("home")}
          </Link>
          {categories.map((category) => (
            <Link key={category.slug} href={`/category/${category.slug}`} onClick={() => setMenuOpen(false)}>
              {locale === "ar" ? category.name_ar : category.name_en}
            </Link>
          ))}
          <Link href="/login" onClick={() => setMenuOpen(false)}>
            {user ? t("account") : t("login")}
          </Link>
        </nav>
      ) : null}
    </header>
  );
}
