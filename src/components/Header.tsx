"use client";

import { Heart, Menu, Moon, Search, ShoppingBag, Sun, User } from "lucide-react";
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
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--bg)]/95 backdrop-blur">
      <div className="container-page flex min-h-20 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 font-bold" aria-label={t("home")}>
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-[var(--accent)] text-white">
            NC
          </span>
          <span className="hidden text-lg sm:inline">{t("name")}</span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-semibold md:flex" aria-label="Main">
          <Link href="/">{t("home")}</Link>
          {categories.map((category) => (
            <Link key={category.slug} href={`/category/${category.slug}`}>
              {locale === "ar" ? category.name_ar : category.name_en}
            </Link>
          ))}
          <Link href="/about">{t("about")}</Link>
          <Link href="/contact">{t("contact")}</Link>
        </nav>

        <div className="relative hidden min-w-64 lg:block">
          <label className="sr-only" htmlFor="site-search">
            {t("search")}
          </label>
          <Search className="pointer-events-none absolute start-3 top-3 h-5 w-5 text-muted" />
          <input
            id="site-search"
            className="field ps-10"
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
          <button className="btn-secondary !px-3" onClick={toggleTheme} aria-label={t("theme")}>
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            className="btn-secondary !px-3"
            onClick={() => switchLocale(locale === "en" ? "ar" : "en")}
            aria-label={t("language")}
          >
            {locale === "en" ? "AR" : "EN"}
          </button>
          <Link className="btn-secondary !px-3" href="/cart" aria-label={t("cart")}>
            <ShoppingBag size={18} />
            <span>{cartCount}</span>
          </Link>
          <span className="hidden items-center gap-1 text-sm font-bold sm:flex" aria-label={t("wishlist")}>
            <Heart size={18} /> {wishlistCount}
          </span>
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
            <Link className="hidden font-bold sm:inline" href="/login">
              {t("login")}
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
