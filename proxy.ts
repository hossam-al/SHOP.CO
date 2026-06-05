import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing, type Locale } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

function redirectTo(request: NextRequest, pathname: string) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = "";
  return NextResponse.redirect(url);
}

function getLocale(pathname: string): Locale | null {
  const match = pathname.match(/^\/(en|ar)(?:\/|$)/i);
  return match ? (match[1].toLowerCase() as Locale) : null;
}

export default function proxy(request: NextRequest) {
  const pathname = decodeURIComponent(request.nextUrl.pathname);
  const normalizedPath = pathname.replace(/\/+$/, "") || "/";
  const locale = getLocale(normalizedPath);

  if (!locale) {
    if (normalizedPath === "/") {
      return redirectTo(request, "/en/home");
    }

    if (normalizedPath === "/home") return redirectTo(request, "/en/home");
    if (normalizedPath === "/PLP") return redirectTo(request, "/en/PLP");

    const pdpMatch = normalizedPath.match(/^\/PDP\/([^/]+)$/i);
    if (pdpMatch) return redirectTo(request, `/en/PDP/${pdpMatch[1]}`);

    if (normalizedPath === "/CHEKOUT" || normalizedPath === "/CHECKOUT") {
      return redirectTo(request, "/en/CHEKOUT");
    }

    if (normalizedPath === "/CART") return redirectTo(request, "/en/CART");
    if (normalizedPath === "/WISHLIST") return redirectTo(request, "/en/WISHLIST");
    if (normalizedPath === "/LOGIN") return redirectTo(request, "/en/LOGIN");
    if (normalizedPath === "/SINUP" || normalizedPath === "/SIGNUP") {
      return redirectTo(request, "/en/SINUP");
    }
    if (normalizedPath === "/ACCOUNT") return redirectTo(request, "/en/ACCOUNT");
    if (normalizedPath === "/ACCOUNT/ MY ORDERS" || normalizedPath === "/ACCOUNT/MY-ORDERS") {
      return redirectTo(request, "/en/ACCOUNT/MY-ORDERS");
    }

    return intlMiddleware(request);
  }

  const route = normalizedPath.replace(new RegExp(`^/${locale}`, "i"), "") || "/";

  if (route === "/") return redirectTo(request, `/${locale}/home`);

  if (route === "/CHECKOUT") return redirectTo(request, `/${locale}/CHEKOUT`);
  if (route === "/SIGNUP") return redirectTo(request, `/${locale}/SINUP`);
  if (route === "/ACCOUNT/ MY ORDERS") return redirectTo(request, `/${locale}/ACCOUNT/MY-ORDERS`);

  if (/^\/category\/[^/]+$/i.test(route)) return redirectTo(request, `/${locale}/PLP`);

  const legacyProduct = route.match(/^\/product\/([^/]+)$/i);
  if (legacyProduct) return redirectTo(request, `/${locale}/PDP/${legacyProduct[1]}`);

  if (route === "/checkout") return redirectTo(request, `/${locale}/CHEKOUT`);
  if (route === "/cart") return redirectTo(request, `/${locale}/CART`);
  if (route === "/wishlist") return redirectTo(request, `/${locale}/WISHLIST`);
  if (route === "/login") return redirectTo(request, `/${locale}/LOGIN`);
  if (route === "/plp") return redirectTo(request, `/${locale}/PLP`);
  if (route === "/signup") return redirectTo(request, `/${locale}/SINUP`);
  if (route === "/account") return redirectTo(request, `/${locale}/ACCOUNT`);
  if (route === "/account/my-orders") return redirectTo(request, `/${locale}/ACCOUNT/MY-ORDERS`);

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
