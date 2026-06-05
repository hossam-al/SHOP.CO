import { Mail } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link, type Locale } from "@/i18n/routing";

const socialIcons = [
  {
    label: "Twitter",
    path: "M13.9 10.5 19.6 4h-1.4l-4.9 5.6L9.4 4H4.8l6 8.7L4.5 20h1.4l5.5-6.3 4.4 6.3h4.6l-6.5-9.5Zm-1.9 2.2-.6-.9-4.9-7h2.2l3.8 5.5.6.9 5.1 7.3H16l-4-5.8Z",
  },
  {
    label: "Facebook",
    path: "M14.2 8.1V6.6c0-.7.5-.9.9-.9h2.3V2.2L14.2 2c-3.5 0-4.3 2.6-4.3 4.3v1.8H7.1V12h2.8v10h4.3V12h3.1l.5-3.9h-3.6Z",
  },
  {
    label: "Instagram",
    path: "M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm0 2A3.8 3.8 0 0 0 4 7.8v8.4A3.8 3.8 0 0 0 7.8 20h8.4a3.8 3.8 0 0 0 3.8-3.8V7.8A3.8 3.8 0 0 0 16.2 4H7.8Zm8.9 1.5a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6ZM12 7.2a4.8 4.8 0 1 1 0 9.6 4.8 4.8 0 0 1 0-9.6Zm0 2a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6Z",
  },
  {
    label: "GitHub",
    path: "M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.8c-2.9.6-3.5-1.2-3.5-1.2-.5-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1.1.6-1.3-2.3-.3-4.7-1.1-4.7-5A3.9 3.9 0 0 1 6.3 8c-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.4 9.4 0 0 1 5 0c1.9-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7a3.9 3.9 0 0 1 1 2.7c0 3.9-2.4 4.7-4.7 5 .4.3.7.9.7 1.8V21c0 .3.2.6.7.5A10 10 0 0 0 12 2Z",
  },
];

export async function Footer({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "site" });
  const home = await getTranslations({ locale, namespace: "home" });
  const forms = await getTranslations({ locale, namespace: "forms" });

  return (
    <footer className="mt-24 bg-[var(--background-soft)] pt-24 text-black">
      <div className="container-page -mt-44 mb-14 grid min-w-0 gap-6 rounded-[20px] bg-black p-7 text-white sm:p-8 md:grid-cols-[1fr_420px] md:p-12">
        <h2 className="max-w-2xl break-words text-[28px] font-black uppercase leading-tight sm:text-4xl md:text-5xl">
          {home("newsletter")}
        </h2>
        <form className="grid min-w-0 content-center gap-3">
          <label className="relative">
            <Mail className="absolute start-5 top-4 h-5 w-5 text-black/40" />
            <input
              className="field field-icon-lg !bg-white !text-black placeholder:text-black/45"
              placeholder={forms("email")}
            />
          </label>
          <button className="btn-secondary w-full !bg-white !px-5 !text-black hover:!bg-white/90" type="button">
            {home("newsletterCopy")}
          </button>
        </form>
      </div>
      <div className="container-page grid gap-8 pb-10 md:grid-cols-[1.6fr_1fr_1fr_1fr_1fr]">
        <div>
          <p className="text-4xl font-black tracking-tighter">{t("name")}</p>
          <p className="mt-5 max-w-xs text-black/60">{t("tagline")}</p>
          <div className="mt-6 flex gap-3">
            {socialIcons.map((icon) => (
              <span
                key={icon.label}
                className="grid h-8 w-8 place-items-center rounded-full border bg-white text-black transition hover:bg-black hover:text-white"
                aria-label={icon.label}
              >
                <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d={icon.path} />
                </svg>
              </span>
            ))}
          </div>
        </div>
        <nav className="grid gap-4 text-black/60" aria-label="Footer">
          <strong className="text-sm uppercase tracking-[0.25em] text-black">{t("footerCompany")}</strong>
          <Link href="/home">{t("about")}</Link>
          <span>{t("footerFeatures")}</span>
          <span>{t("footerWorks")}</span>
          <span>{t("footerCareer")}</span>
        </nav>
        <nav className="grid gap-4 text-black/60" aria-label="Help footer">
          <strong className="text-sm uppercase tracking-[0.25em] text-black">{t("footerHelp")}</strong>
          <span>{t("footerCustomerSupport")}</span>
          <span>{t("footerDeliveryDetails")}</span>
          <span>{t("footerTerms")}</span>
          <span>{t("footerPrivacy")}</span>
        </nav>
        <nav className="grid gap-4 text-black/60" aria-label="FAQ footer">
          <strong className="text-sm uppercase tracking-[0.25em] text-black">{t("footerFaq")}</strong>
          <span>{t("account")}</span>
          <span>{t("footerManageDeliveries")}</span>
          <span>{t("footerOrders")}</span>
          <span>{t("footerPayments")}</span>
        </nav>
        <nav className="grid gap-4 text-black/60" aria-label="Resources footer">
          <strong className="text-sm uppercase tracking-[0.25em] text-black">{t("footerResources")}</strong>
          <Link href="/PLP">{t("footerCasual")}</Link>
          <Link href="/PLP">{t("footerFormal")}</Link>
          <Link href="/PLP">{t("footerParty")}</Link>
          <Link href="/PLP">{t("footerGym")}</Link>
        </nav>
      </div>
      <div className="container-page flex flex-wrap justify-between gap-4 border-t border-black/10 py-6 text-sm text-black/60">
        <p>{t("footerCopyright")}</p>
        <p className="font-bold">VISA · Mastercard · PayPal · Apple Pay · G Pay</p>
      </div>
    </footer>
  );
}
