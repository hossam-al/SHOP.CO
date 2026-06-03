import { Mail } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/routing";

export async function Footer({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "site" });

  return (
    <footer className="mt-24 bg-[var(--background-soft)] pt-24 text-black">
      <div className="container-page -mt-44 mb-14 grid gap-6 rounded-[20px] bg-black p-8 text-white md:grid-cols-[1fr_420px] md:p-12">
        <h2 className="max-w-2xl text-4xl font-black uppercase leading-tight md:text-5xl">
          STAY UPTO DATE ABOUT OUR LATEST OFFERS
        </h2>
        <form className="grid content-center gap-3">
          <label className="relative">
            <Mail className="absolute start-5 top-4 h-5 w-5 text-black/40" />
            <input className="field field-icon-lg bg-white text-black" placeholder="Enter your email address" />
          </label>
          <button className="btn-secondary bg-white text-black" type="button">Subscribe to Newsletter</button>
        </form>
      </div>
      <div className="container-page grid gap-8 pb-10 md:grid-cols-[1.6fr_1fr_1fr_1fr_1fr]">
        <div>
          <p className="text-4xl font-black tracking-tighter">{t("name")}</p>
          <p className="mt-5 max-w-xs text-black/60">{t("tagline")}</p>
          <div className="mt-6 flex gap-3">
            {["t", "f", "i", "g"].map((icon) => (
              <span key={icon} className="grid h-8 w-8 place-items-center rounded-full border bg-white text-xs font-bold">
                {icon}
              </span>
            ))}
          </div>
        </div>
        <nav className="grid gap-4 text-black/60" aria-label="Footer">
          <strong className="text-sm uppercase tracking-[0.25em] text-black">Company</strong>
          <Link href="/about">About</Link>
          <span>Features</span>
          <span>Works</span>
          <span>Career</span>
        </nav>
        <nav className="grid gap-4 text-black/60" aria-label="Help footer">
          <strong className="text-sm uppercase tracking-[0.25em] text-black">Help</strong>
          <span>Customer Support</span>
          <span>Delivery Details</span>
          <span>Terms & Conditions</span>
          <span>Privacy Policy</span>
        </nav>
        <nav className="grid gap-4 text-black/60" aria-label="FAQ footer">
          <strong className="text-sm uppercase tracking-[0.25em] text-black">FAQ</strong>
          <span>Account</span>
          <span>Manage Deliveries</span>
          <span>Orders</span>
          <span>Payments</span>
        </nav>
        <nav className="grid gap-4 text-black/60" aria-label="Resources footer">
          <strong className="text-sm uppercase tracking-[0.25em] text-black">Resources</strong>
          <Link href="/category/casual">Casual</Link>
          <Link href="/category/formal">Formal</Link>
          <Link href="/category/party">Party</Link>
          <Link href="/category/gym">Gym</Link>
        </nav>
      </div>
      <div className="container-page flex flex-wrap justify-between gap-4 border-t border-black/10 py-6 text-sm text-black/60">
        <p>Shop.co © 2000-2023, All Rights Reserved</p>
        <p className="font-bold">VISA · Mastercard · PayPal · Apple Pay · G Pay</p>
      </div>
    </footer>
  );
}
