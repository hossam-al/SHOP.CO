import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import "../globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ThemeSync } from "@/components/ThemeSync";
import { routing, type Locale } from "@/i18n/routing";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();
  const typedLocale = locale as Locale;

  return (
    <html lang={typedLocale} dir={typedLocale === "ar" ? "rtl" : "ltr"}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <ThemeSync />
          <a className="skip-link" href="#main-content">
            Skip to content
          </a>
          <Header locale={typedLocale} />
          <main id="main-content">{children}</main>
          <Footer locale={typedLocale} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
