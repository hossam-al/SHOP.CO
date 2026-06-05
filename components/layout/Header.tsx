"use client";

import {
  ChevronDown,
  ClipboardList,
  Heart,
  Home,
  LogOut,
  Menu,
  Package,
  Search,
  ShoppingBag,
  ShoppingCart,
  Shirt,
  Sparkles,
  Settings,
  User,
  Watch,
  X,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { categories, products } from "@/lib/products";
import { localizedName } from "@/types/product";
import { Link, type Locale } from "@/i18n/routing";
import { useShopStore } from "@/store/use-shop-store";

export function Header({ locale }: { locale: Locale }) {
  const t = useTranslations("site");
  const pathname = usePathname();
  const router = useRouter();
  const activeLocale = useLocale() as Locale;
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState<boolean>(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState<boolean>(false);
  const [query, setQuery] = useState("");
  const [animateCartCount, setAnimateCartCount] = useState(false);
  const previousCartCount = useRef(0);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const cartCount = useShopStore((state) =>
    state.cart.reduce((sum, line) => sum + line.quantity, 0),
  );
  const wishlistCount = useShopStore((state) => state.wishlist.length);
  const user = useShopStore((state) => state.user);
  const logout = useShopStore((state) => state.logout);
  const isRtl = locale === "ar";
  const userInitials = useMemo(() => {
    if (!user) return "";
    return user.name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  }, [user]);

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

  useEffect(() => {
    if (!isAccountMenuOpen) return undefined;

    function handleClickOutside(event: MouseEvent) {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target as Node)
      ) {
        setIsAccountMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isAccountMenuOpen]);

  useEffect(() => {
    if (!user) setIsAccountMenuOpen(false);
  }, [user]);

  const openMenu = () => {
    setIsMobileSearchOpen(false);
    setIsAccountMenuOpen(false);
    setIsMenuOpen(true);
  };
  const closeMenu = () => setIsMenuOpen(false);
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeSearch = () => {
    setQuery("");
    setIsMobileSearchOpen(false);
  };
  const handleLogout = () => {
    setIsAccountMenuOpen(false);
    setIsMenuOpen(false);
    setIsMobileSearchOpen(false);
    logout();
  };

  function switchLocale(nextLocale: Locale) {
    const nextPath = pathname.replace(/^\/(en|ar)/, `/${nextLocale}`);
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000`;
    router.push(nextPath);
  }

  return (
    <header className="sticky top-0 z-40 bg-[var(--bg)]">
      <div className="container-page flex min-h-14 items-center justify-between gap-3 border-b border-[var(--border)] sm:min-h-20 sm:gap-6">
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--fg)] transition hover:bg-black/5 lg:!hidden"
          onClick={() => (isMenuOpen ? toggleMenu() : openMenu())}
          aria-label="Open menu"
          aria-expanded={isMenuOpen}
        >
          <Menu size={20} />
        </button>

        <Link
          href="/home"
          className="text-2xl font-black tracking-tighter sm:text-[32px]"
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
              href="/PLP"
              className="inline-flex items-center gap-1 py-8"
              aria-haspopup="true"
            >
              {t("shop")}{" "}
              <ChevronDown
                className="transition-transform duration-300 group-hover:rotate-180"
                size={16}
              />
            </Link>

            <div
              className={`invisible absolute top-full z-[999] w-[min(760px,calc(100vw-32px))] translate-y-3 pt-4 opacity-0 pointer-events-none transition-all duration-300 ease-out group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-hover:pointer-events-auto xl:w-[min(900px,calc(100vw-32px))] ${
                isRtl ? "right-0" : "left-0"
              }`}
            >
              <div className="rounded-2xl border border-black/10 bg-white p-6 text-black shadow-xl">
                <div className="grid gap-6 md:grid-cols-4">
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-black uppercase">
                      <Shirt size={18} /> {t("megaMen")}
                    </h3>
                    <div className="grid gap-2 text-sm text-black/70">
                      <Link
                        className="rounded-md py-1.5 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-black"
                        href="/PLP"
                      >
                        {t("megaTshirts")}
                      </Link>
                      <Link
                        className="rounded-md py-1.5 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-black"
                        href="/PLP"
                      >
                        {t("megaShirts")}
                      </Link>
                      <Link
                        className="rounded-md py-1.5 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-black"
                        href="/PLP"
                      >
                        {t("megaJeans")}
                      </Link>
                      <Link
                        className="rounded-md py-1.5 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-black"
                        href="/PLP"
                      >
                        {t("megaHoodies")}
                      </Link>
                      <Link
                        className="rounded-md py-1.5 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-black"
                        href="/PLP"
                      >
                        {t("megaJackets")}
                      </Link>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-black uppercase">
                      <ShoppingBag size={18} /> {t("megaWomen")}
                    </h3>
                    <div className="grid gap-2 text-sm text-black/70">
                      <Link
                        className="rounded-md py-1.5 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-black"
                        href="/PLP"
                      >
                        {t("megaDresses")}
                      </Link>
                      <Link
                        className="rounded-md py-1.5 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-black"
                        href="/PLP"
                      >
                        {t("megaTops")}
                      </Link>
                      <Link
                        className="rounded-md py-1.5 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-black"
                        href="/PLP"
                      >
                        {t("megaSkirts")}
                      </Link>
                      <Link
                        className="rounded-md py-1.5 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-black"
                        href="/PLP"
                      >
                        {t("megaJeans")}
                      </Link>
                      <Link
                        className="rounded-md py-1.5 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-black"
                        href="/PLP"
                      >
                        {t("megaJackets")}
                      </Link>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-black uppercase">
                      <Watch size={18} /> {t("megaAccessories")}
                    </h3>
                    <div className="grid gap-2 text-sm text-black/70">
                      <Link
                        className="rounded-md py-1.5 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-black"
                        href="/PLP"
                      >
                        {t("megaBags")}
                      </Link>
                      <Link
                        className="rounded-md py-1.5 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-black"
                        href="/PLP"
                      >
                        {t("megaShoes")}
                      </Link>
                      <Link
                        className="rounded-md py-1.5 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-black"
                        href="/PLP"
                      >
                        {t("megaWatches")}
                      </Link>
                      <Link
                        className="rounded-md py-1.5 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-black"
                        href="/PLP"
                      >
                        {t("megaSunglasses")}
                      </Link>
                      <Link
                        className="rounded-md py-1.5 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-black"
                        href="/PLP"
                      >
                        {t("megaCaps")}
                      </Link>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-black uppercase">
                      <Sparkles size={18} /> {t("megaFeatured")}
                    </h3>
                    <div className="grid gap-2 text-sm text-black/70">
                      <Link
                        className="rounded-md py-1.5 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-black"
                        href="/home#new-arrivals"
                      >
                        {t("newArrivals")}
                      </Link>
                      <Link
                        className="rounded-md py-1.5 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-black"
                        href="/PLP"
                      >
                        {t("megaBestSellers")}
                      </Link>
                      <Link
                        className="rounded-md py-1.5 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-black"
                        href="/PLP"
                      >
                        {t("sale")}
                      </Link>
                      <Link
                        className="rounded-md py-1.5 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-black"
                        href="/home#brands"
                      >
                        {t("megaCollections")}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Link href="/PLP">{t("sale")}</Link>
          <Link href="/home#new-arrivals">{t("newArrivals")}</Link>
          <Link href="/home#brands">{t("brands")}</Link>
          <span className="hidden">
            <Link href="/home">{t("home")}</Link>
          </span>
          <span className="hidden">
            {categories.map((category) => (
              <Link key={category.slug} href="/PLP">
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
                    href={`/PDP/${product.id}`}
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

        <div className="ms-auto flex items-center gap-1 sm:gap-2 lg:ms-0">
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full transition hover:bg-black/5 lg:hidden"
            onClick={() => {
              setIsMenuOpen(false);
              setIsAccountMenuOpen(false);
              setIsMobileSearchOpen((prev) => !prev);
            }}
            aria-label={t("search")}
            aria-expanded={isMobileSearchOpen}
          >
            <Search size={20} />
          </button>
          <button
            type="button"
            className="inline-flex h-10 min-w-10 items-center justify-center rounded-full px-2 text-sm font-bold transition hover:bg-black/5 sm:px-3"
            onClick={() => {
              setIsMenuOpen(false);
              setIsMobileSearchOpen(false);
              setIsAccountMenuOpen(false);
              switchLocale(locale === "en" ? "ar" : "en");
            }}
            aria-label={t("language")}
          >
            {locale === "en" ? "AR" : "EN"}
          </button>
          <Link
            className="relative flex items-center gap-1 rounded-full p-2"
            href="/CART"
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
            <div className="relative" ref={accountMenuRef}>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center gap-2 rounded-full border border-black/10 bg-white p-1 text-black shadow-sm transition hover:border-black/30 hover:bg-black/5 min-[420px]:w-auto min-[420px]:max-w-[112px] min-[420px]:justify-start min-[420px]:pe-2 sm:max-w-[190px] sm:pe-3"
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsMobileSearchOpen(false);
                  setIsAccountMenuOpen((prev) => !prev);
                }}
                aria-label={t("account")}
                aria-expanded={isAccountMenuOpen}
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-black text-xs font-black text-white">
                  {userInitials}
                </span>
                <span className="hidden min-w-0 max-w-[48px] truncate text-xs font-bold min-[420px]:block sm:max-w-[120px] sm:text-sm">
                  {user.name}
                </span>
                <ChevronDown
                  size={14}
                  className={`hidden shrink-0 transition-transform min-[420px]:block ${
                    isAccountMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isAccountMenuOpen ? (
                <div className="absolute end-0 top-12 z-[80] w-64 overflow-hidden rounded-xl border border-black/10 bg-white text-black shadow-2xl">
                  <div className="flex items-center gap-3 border-b border-black/10 p-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-black text-sm font-black text-white">
                      {userInitials}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-black">{user.name}</p>
                      <p className="truncate text-xs text-black/55">{user.email}</p>
                    </div>
                  </div>

                  <div className="grid p-2 text-sm font-bold">
                    <Link
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition hover:bg-black/5"
                      href="/ACCOUNT#settings"
                      onClick={() => setIsAccountMenuOpen(false)}
                    >
                      <User size={18} /> {t("myAccount")}
                    </Link>
                    <Link
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition hover:bg-black/5"
                      href="/ACCOUNT/MY-ORDERS"
                      onClick={() => setIsAccountMenuOpen(false)}
                    >
                      <ClipboardList size={18} /> {t("myOrders")}
                    </Link>
                    <Link
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition hover:bg-black/5"
                      href="/WISHLIST"
                      onClick={() => setIsAccountMenuOpen(false)}
                    >
                      <Heart size={18} /> {t("wishlist")}
                    </Link>
                    <Link
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition hover:bg-black/5"
                      href="/ACCOUNT"
                      onClick={() => setIsAccountMenuOpen(false)}
                    >
                      <Settings size={18} /> {t("settings")}
                    </Link>
                  </div>

                  <button
                    type="button"
                    className="flex w-full items-center gap-3 border-t border-black/10 px-5 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50"
                    onClick={handleLogout}
                  >
                    <LogOut size={18} /> {t("logout")}
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <Link
              className="grid h-10 w-10 place-items-center rounded-full transition hover:bg-black/5"
              href="/LOGIN"
              aria-label={t("login")}
            >
              <User size={20} />
            </Link>
          )}
        </div>
      </div>

      {isMobileSearchOpen ? (
        <div className="border-b border-[var(--border)] bg-[var(--bg)] px-4 py-3 lg:hidden">
          <div className="relative mx-auto max-w-xl">
            <label className="sr-only" htmlFor="mobile-site-search">
              {t("search")}
            </label>
            <Search className="pointer-events-none absolute start-4 top-3.5 h-5 w-5 text-muted" />
            <input
              id="mobile-site-search"
              className="field field-icon h-12 pe-12"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("search")}
              autoFocus
            />
            <button
              type="button"
              className="absolute end-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full transition hover:bg-black/5"
              onClick={closeSearch}
              aria-label="Close search"
            >
              <X size={18} />
            </button>

            {query ? (
              <div className="card absolute inset-x-0 top-14 z-[60] max-h-72 overflow-auto p-2 shadow-xl">
                {results.length ? (
                  results.map((product) => (
                    <Link
                      key={product.id}
                      className="block rounded-md px-3 py-2 hover:bg-black/5 dark:hover:bg-white/10"
                      href={`/PDP/${product.id}`}
                      onClick={closeSearch}
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
        </div>
      ) : null}

      {isMenuOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-[998] bg-black/50 lg:hidden"
          onClick={closeMenu}
          aria-label="Close menu overlay"
        />
      ) : null}

      <aside
        className={`fixed top-0 z-[999] h-screen w-[280px] max-w-[85vw] overflow-y-auto bg-white text-black shadow-xl transition-transform duration-300 ease-in-out lg:hidden ${
          isRtl ? "right-0" : "left-0"
        } ${
          isMenuOpen ? "translate-x-0" : isRtl ? "translate-x-full" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!isMenuOpen}
      >
        <div className="flex h-full flex-col ">
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
              href="/home"
              onClick={closeMenu}
            >
              <Home size={20} /> {t("home")}
            </Link>
            <Link
              className="flex items-center gap-3 rounded-lg px-3 py-3 font-bold hover:bg-black/5"
              href="/PLP"
              onClick={closeMenu}
            >
              <ShoppingBag size={20} /> {t("shop")}
            </Link>
            <div className="grid gap-1 border-s border-black/10 ps-6">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  className="rounded-lg px-3 py-2 text-sm font-bold text-black/70 hover:bg-black/5 hover:text-black"
                  href="/PLP"
                  onClick={closeMenu}
                >
                  {locale === "ar" ? category.name_ar : category.name_en}
                </Link>
              ))}
            </div>
            <Link
              className="flex items-center gap-3 rounded-lg px-3 py-3 font-bold hover:bg-black/5"
              href="/PLP"
              onClick={closeMenu}
            >
              <Package size={20} /> {t("sale")}
            </Link>
            <Link
              className="flex items-center gap-3 rounded-lg px-3 py-3 font-bold hover:bg-black/5"
              href="/home#new-arrivals"
              onClick={closeMenu}
            >
              <Package size={20} /> {t("newArrivals")}
            </Link>
            <Link
              className="flex items-center gap-3 rounded-lg px-3 py-3 font-bold hover:bg-black/5"
              href="/home#brands"
              onClick={closeMenu}
            >
              <Heart size={20} /> {t("brands")}
            </Link>
            <Link
              className="flex items-center gap-3 rounded-lg px-3 py-3 font-bold hover:bg-black/5"
              href="/CART"
              onClick={closeMenu}
            >
              <ShoppingCart size={20} /> {t("cart")}{" "}
              <span className="ms-auto text-sm text-black/50">{cartCount}</span>
            </Link>
            <Link
              className="flex items-center gap-3 rounded-lg px-3 py-3 font-bold hover:bg-black/5"
              href={user ? "/ACCOUNT" : "/LOGIN"}
              onClick={closeMenu}
            >
              <User size={20} /> {user ? t("account") : t("login")}
            </Link>
          </nav>

          <div className=" mt-auto border-t border-black/10 p-4 pb-6">
            <p className="text-sm text-black/60">
              {t("promoBanner")}
            </p>
            <Link
              className="mt-3 inline-flex font-bold underline"
              href="/SINUP"
              onClick={closeMenu}
            >
              {t("promoCta")}
            </Link>
          </div>
        </div>
      </aside>
    </header>
  );
}
