"use client";

import {
  ChevronDown,
  Heart,
  Home,
  Menu,
  Package,
  Phone,
  Search,
  ShoppingBag,
  ShoppingCart,
  Shirt,
  Sparkles,
  User,
  Watch,
  X,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { categories, products } from "@/lib/products";
import { localizedName } from "@/types/product";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import { useShopStore } from "@/store/use-shop-store";

export function Header({ locale }: { locale: Locale }) {
  const t = useTranslations("site");
  const pathname = usePathname();
  const router = useRouter();
  const activeLocale = useLocale() as Locale;
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [query, setQuery] = useState("");
  const [animateCartCount, setAnimateCartCount] = useState(false);
  const previousCartCount = useRef(0);
  const cartCount = useShopStore((state) =>
    state.cart.reduce((sum, line) => sum + line.quantity, 0),
  );
  const wishlistCount = useShopStore((state) => state.wishlist.length);
  const user = useShopStore((state) => state.user);
  const logout = useShopStore((state) => state.logout);

  const results = useMemo(() => {
    const clean = query.trim().toLowerCase();
    if (!clean) return [];
    return products.filter((product) =>
      `${product.name_en} ${product.name_ar}`.toLowerCase().includes(clean),
    );
  }, [query]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (previousCartCount.current !== cartCount) {
      setAnimateCartCount(true);
      previousCartCount.current = cartCount;

      const timer = setTimeout(() => {
        setAnimateCartCount(false);
      }, 250);

      return () => clearTimeout(timer);
    }

    previousCartCount.current = cartCount;
    return undefined;
  }, [cartCount]);

  const openMenu = () => setIsMenuOpen(true);
  const closeMenu = () => setIsMenuOpen(false);
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  function switchLocale(nextLocale: Locale) {
    const nextPath = pathname.replace(/^\/(en|ar)/, `/${nextLocale}`);
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000`;
    router.push(nextPath);
  }

  return (
    <header className="sticky top-0 z-40 bg-[var(--bg)]">
      <div className="relative bg-black py-2 text-center text-sm text-white">
        <span>Sign up and get 20% off to your first order. </span>
        <Link href="/signup" className="font-bold underline">
          Sign Up Now
        </Link>
        <X className="absolute end-6 top-2 hidden h-5 w-5 md:block" />
      </div>

      <div className="container-page flex min-h-20 items-center justify-between gap-6 border-b border-[var(--border)]">
        <Link
          href="/"
          className="text-[32px] font-black tracking-tighter"
          aria-label={t("home")}
        >
          {t("name")}
        </Link>

        <nav
          className="hidden items-center gap-7 text-base lg:flex"
          aria-label="Main"
        >
          <div className="relative group">
            <Link
              href="/category/casual"
              className="inline-flex items-center gap-1 py-8"
              aria-haspopup="true"
            >
              {t("shop")}{" "}
              <ChevronDown
                className="transition-transform duration-300 group-hover:rotate-180"
                size={16}
              />
            </Link>

            <div className="invisible absolute left-0 top-full z-[999] w-[760px] max-w-[calc(100vw-32px)] translate-y-3 pt-4 opacity-0 pointer-events-none transition-all duration-300 ease-out group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-hover:pointer-events-auto xl:w-[900px]">
              <div className="rounded-2xl border border-black/10 bg-white p-6 text-black shadow-xl">
                <div className="grid gap-6 md:grid-cols-4">
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-black uppercase">
                      <Shirt size={18} /> Men
                    </h3>
                    <div className="grid gap-2 text-sm text-black/70">
                      <Link
                        className="rounded-md py-1.5 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-black"
                        href="/category/casual"
                      >
                        T-Shirts
                      </Link>
                      <Link
                        className="rounded-md py-1.5 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-black"
                        href="/category/formal"
                      >
                        Shirts
                      </Link>
                      <Link
                        className="rounded-md py-1.5 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-black"
                        href="/category/casual"
                      >
                        Jeans
                      </Link>
                      <Link
                        className="rounded-md py-1.5 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-black"
                        href="/category/casual"
                      >
                        Hoodies
                      </Link>
                      <Link
                        className="rounded-md py-1.5 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-black"
                        href="/category/party"
                      >
                        Jackets
                      </Link>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-black uppercase">
                      <ShoppingBag size={18} /> Women
                    </h3>
                    <div className="grid gap-2 text-sm text-black/70">
                      <Link
                        className="rounded-md py-1.5 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-black"
                        href="/category/formal"
                      >
                        Dresses
                      </Link>
                      <Link
                        className="rounded-md py-1.5 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-black"
                        href="/category/casual"
                      >
                        Tops
                      </Link>
                      <Link
                        className="rounded-md py-1.5 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-black"
                        href="/category/formal"
                      >
                        Skirts
                      </Link>
                      <Link
                        className="rounded-md py-1.5 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-black"
                        href="/category/casual"
                      >
                        Jeans
                      </Link>
                      <Link
                        className="rounded-md py-1.5 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-black"
                        href="/category/party"
                      >
                        Jackets
                      </Link>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-black uppercase">
                      <Watch size={18} /> Accessories
                    </h3>
                    <div className="grid gap-2 text-sm text-black/70">
                      <Link
                        className="rounded-md py-1.5 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-black"
                        href="/category/casual"
                      >
                        Bags
                      </Link>
                      <Link
                        className="rounded-md py-1.5 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-black"
                        href="/category/gym"
                      >
                        Shoes
                      </Link>
                      <Link
                        className="rounded-md py-1.5 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-black"
                        href="/category/formal"
                      >
                        Watches
                      </Link>
                      <Link
                        className="rounded-md py-1.5 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-black"
                        href="/category/casual"
                      >
                        Sunglasses
                      </Link>
                      <Link
                        className="rounded-md py-1.5 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-black"
                        href="/category/casual"
                      >
                        Caps
                      </Link>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-black uppercase">
                      <Sparkles size={18} /> Featured
                    </h3>
                    <div className="grid gap-2 text-sm text-black/70">
                      <Link
                        className="rounded-md py-1.5 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-black"
                        href="/#new-arrivals"
                      >
                        New Arrivals
                      </Link>
                      <Link
                        className="rounded-md py-1.5 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-black"
                        href="/category/casual"
                      >
                        Best Sellers
                      </Link>
                      <Link
                        className="rounded-md py-1.5 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-black"
                        href="/category/party"
                      >
                        Sale
                      </Link>
                      <Link
                        className="rounded-md py-1.5 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-black"
                        href="/#brands"
                      >
                        Collections
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
          <Search className="pointer-events-none absolute start-4 top-3.5 h-5 w-5 text-muted" />
          <input
            id="site-search"
            className="field field-icon h-12"
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
                <p className="px-3 py-2 text-sm text-muted">
                  {t("emptySearch")}
                </p>
              )}
            </div>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <button
            className="rounded-full px-2 py-2 font-bold"
            onClick={() => switchLocale(locale === "en" ? "ar" : "en")}
            aria-label={t("language")}
          >
            {locale === "en" ? "AR" : "EN"}
          </button>
          <Link
            className="relative flex items-center gap-1 rounded-full p-2"
            href="/cart"
            aria-label={t("cart")}
          >
            <ShoppingCart size={20} />
            {cartCount > 0 ? (
              <span
                className={`absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1 text-xs font-bold text-white transition-transform duration-200 ${
                  animateCartCount ? "scale-125" : "scale-100"
                }`}
              >
                {cartCount}
              </span>
            ) : null}
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
            <Link
              className="hidden rounded-full p-2 sm:inline-flex"
              href="/login"
              aria-label={t("login")}
            >
              <User size={20} />
            </Link>
          )}
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)] text-[var(--fg)] transition hover:bg-black/5 lg:!hidden"
            onClick={() => (isMenuOpen ? toggleMenu() : openMenu())}
            aria-label="Open menu"
            aria-expanded={isMenuOpen}
          >
            <Menu size={18} />
          </button>
        </div>
      </div>

      {isMenuOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-[998] bg-black/50 lg:hidden"
          onClick={closeMenu}
          aria-label="Close menu overlay"
        />
      ) : null}

      <aside
        className={`fixed right-0 top-0 z-[999] h-screen w-[280px] max-w-[85vw] bg-white text-black shadow-xl transition-transform duration-300 ease-in-out lg:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!isMenuOpen}
      >
        <div className="flex h-full flex-col">
          <div className="flex min-h-20 items-center justify-between border-b border-black/10 px-5">
            <span className="text-2xl font-black tracking-tighter">
              {t("name")}
            </span>
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full border border-black/10"
              onClick={closeMenu}
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="grid gap-1 px-4 py-5" aria-label="Mobile">
            <Link
              className="flex items-center gap-3 rounded-lg px-3 py-3 font-bold hover:bg-black/5"
              href="/"
              onClick={closeMenu}
            >
              <Home size={20} /> {t("home")}
            </Link>
            <Link
              className="flex items-center gap-3 rounded-lg px-3 py-3 font-bold hover:bg-black/5"
              href="/category/casual"
              onClick={closeMenu}
            >
              <ShoppingBag size={20} /> {t("shop")}
            </Link>
            <div className="grid gap-1 border-s border-black/10 ps-6">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  className="rounded-lg px-3 py-2 text-sm font-bold text-black/70 hover:bg-black/5 hover:text-black"
                  href={`/category/${category.slug}`}
                  onClick={closeMenu}
                >
                  {locale === "ar" ? category.name_ar : category.name_en}
                </Link>
              ))}
            </div>
            <Link
              className="flex items-center gap-3 rounded-lg px-3 py-3 font-bold hover:bg-black/5"
              href="/category/party"
              onClick={closeMenu}
            >
              <Package size={20} /> {t("sale")}
            </Link>
            <Link
              className="flex items-center gap-3 rounded-lg px-3 py-3 font-bold hover:bg-black/5"
              href="/#new-arrivals"
              onClick={closeMenu}
            >
              <Package size={20} /> {t("newArrivals")}
            </Link>
            <Link
              className="flex items-center gap-3 rounded-lg px-3 py-3 font-bold hover:bg-black/5"
              href="/#brands"
              onClick={closeMenu}
            >
              <Heart size={20} /> {t("brands")}
            </Link>
            <Link
              className="flex items-center gap-3 rounded-lg px-3 py-3 font-bold hover:bg-black/5"
              href="/cart"
              onClick={closeMenu}
            >
              <ShoppingCart size={20} /> {t("cart")}{" "}
              <span className="ms-auto text-sm text-black/50">{cartCount}</span>
            </Link>
            <Link
              className="flex items-center gap-3 rounded-lg px-3 py-3 font-bold hover:bg-black/5"
              href="/contact"
              onClick={closeMenu}
            >
              <Phone size={20} /> {t("contact")}
            </Link>
            <Link
              className="flex items-center gap-3 rounded-lg px-3 py-3 font-bold hover:bg-black/5"
              href="/login"
              onClick={closeMenu}
            >
              <User size={20} /> {user ? t("account") : t("login")}
            </Link>
          </nav>

          <div className="mt-auto border-t border-black/10 p-4">
            <p className="text-sm text-black/60">
              Sign up and get 20% off to your first order.
            </p>
            <Link
              className="mt-3 inline-flex font-bold underline"
              href="/signup"
              onClick={closeMenu}
            >
              Sign Up Now
            </Link>
          </div>
        </div>
      </aside>
    </header>
  );
}
