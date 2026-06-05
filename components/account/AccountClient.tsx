"use client";

import {
  Heart,
  KeyRound,
  Mail,
  Package,
  Save,
  Settings,
  ShieldCheck,
  ShoppingCart,
  User,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { FormEvent, useEffect, useState } from "react";
import { Link } from "@/i18n/routing";
import { useShopStore } from "@/store/use-shop-store";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function AccountClient() {
  const t = useTranslations("accountPage");
  const site = useTranslations("site");
  const forms = useTranslations("forms");
  const user = useShopStore((state) => state.user);
  const updateUser = useShopStore((state) => state.updateUser);
  const logout = useShopStore((state) => state.logout);
  const theme = useShopStore((state) => state.theme);
  const toggleTheme = useShopStore((state) => state.toggleTheme);
  const cartCount = useShopStore((state) =>
    state.cart.reduce((total, line) => total + line.quantity, 0),
  );
  const wishlistCount = useShopStore((state) => state.wishlist.length);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailOffers, setEmailOffers] = useState(true);

  useEffect(() => {
    if (!user) return;
    setName(user.name);
    setEmail(user.email);
  }, [user]);

  if (!user) {
    return (
      <section className="container-page py-16 text-center">
        <User className="mx-auto h-12 w-12" />
        <h1 className="mt-4 text-4xl font-black">{t("title")}</h1>
        <p className="mt-3 text-muted">{t("signedOutCopy")}</p>
        <Link className="btn-primary mt-8" href="/LOGIN">
          {site("login")}
        </Link>
      </section>
    );
  }

  function submitProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextName = name.trim();
    const nextEmail = email.trim();

    if (nextName.length < 2 || !isValidEmail(nextEmail)) {
      setProfileMessage(t("profileInvalid"));
      return;
    }

    updateUser({ name: nextName, email: nextEmail });
    setProfileMessage(t("profileSaved"));
  }

  function submitPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!currentPassword || newPassword.length < 8 || confirmPassword.length < 8) {
      setPasswordMessage(t("passwordInvalid"));
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage(t("passwordMismatch"));
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordMessage(t("passwordUpdated"));
  }

  return (
    <section className="container-page py-8">
      <div className="mb-8 text-black/60">
        {site("home")} <span aria-hidden="true">/</span>{" "}
        <span className="text-black">{site("account")}</span>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="shop-heading">{t("title")}</h1>
          <p className="mt-3 text-muted">{t("welcome", { name: user.name })}</p>
        </div>
        <button className="btn-secondary" type="button" onClick={logout}>
          {site("logout")}
        </button>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <article className="rounded-[12px] border border-black/10 p-5">
          <User size={24} />
          <h2 className="mt-4 text-xl font-bold">{user.name}</h2>
          <p className="mt-2 flex items-center gap-2 text-muted">
            <Mail size={16} /> {user.email}
          </p>
        </article>
        <Link
          className="rounded-[12px] border border-black/10 p-5 transition hover:border-black"
          href="/ACCOUNT/MY-ORDERS"
        >
          <Package size={24} />
          <h2 className="mt-4 text-xl font-bold">{t("myOrders")}</h2>
          <p className="mt-2 text-muted">{t("ordersCopy")}</p>
        </Link>
        <Link
          className="rounded-[12px] border border-black/10 p-5 transition hover:border-black"
          href="/WISHLIST"
        >
          <ShoppingCart size={24} />
          <h2 className="mt-4 text-xl font-bold">{t("savedItems")}</h2>
          <p className="mt-2 text-muted">
            {t("savedCopy", { wishlistCount, cartCount })}
          </p>
        </Link>
      </div>

      <div id="settings" className="mt-12 scroll-mt-28">
        <div className="flex items-center gap-3">
          <Settings size={24} />
          <div>
            <h2 className="text-3xl font-black">{t("settings")}</h2>
            <p className="mt-1 text-muted">{t("settingsCopy")}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_1fr]">
          <form
            className="rounded-[12px] border border-black/10 bg-white p-5"
            onSubmit={submitProfile}
          >
            <div className="flex items-start gap-3">
              <User size={22} />
              <div>
                <h3 className="text-xl font-bold">{t("profile")}</h3>
                <p className="mt-1 text-sm text-muted">{t("profileCopy")}</p>
              </div>
            </div>

            <div className="mt-5 grid gap-4">
              <label className="grid gap-2 font-bold">
                {forms("name")}
                <input
                  className="field"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </label>
              <label className="grid gap-2 font-bold">
                {forms("email")}
                <input
                  className="field"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </label>
            </div>

            <button className="btn-primary mt-5" type="submit">
              <Save size={18} /> {t("saveProfile")}
            </button>
            <p className="mt-3 min-h-5 text-sm text-muted" aria-live="polite">
              {profileMessage}
            </p>
          </form>

          <form
            className="rounded-[12px] border border-black/10 bg-white p-5"
            onSubmit={submitPassword}
          >
            <div className="flex items-start gap-3">
              <ShieldCheck size={22} />
              <div>
                <h3 className="text-xl font-bold">{t("security")}</h3>
                <p className="mt-1 text-sm text-muted">{t("securityCopy")}</p>
              </div>
            </div>

            <div className="mt-5 grid gap-4">
              <label className="grid gap-2 font-bold">
                {t("currentPassword")}
                <input
                  className="field"
                  type="password"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                />
              </label>
              <label className="grid gap-2 font-bold">
                {t("newPassword")}
                <input
                  className="field"
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                />
              </label>
              <label className="grid gap-2 font-bold">
                {t("confirmPassword")}
                <input
                  className="field"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
              </label>
            </div>

            <button className="btn-primary mt-5" type="submit">
              <KeyRound size={18} /> {t("updatePassword")}
            </button>
            <p className="mt-3 min-h-5 text-sm text-muted" aria-live="polite">
              {passwordMessage}
            </p>
          </form>
        </div>

        <div className="mt-5 rounded-[12px] border border-black/10 bg-white p-5">
          <div className="flex items-start gap-3">
            <Heart size={22} />
            <div>
              <h3 className="text-xl font-bold">{t("preferences")}</h3>
              <p className="mt-1 text-sm text-muted">{t("emailOffersCopy")}</p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <label className="flex items-center justify-between gap-4 rounded-lg bg-black/[0.03] px-4 py-3">
              <span>
                <span className="block font-bold">{t("emailOffers")}</span>
                <span className="text-sm text-muted">{t("emailOffersCopy")}</span>
              </span>
              <input
                className="h-5 w-5 accent-black"
                type="checkbox"
                checked={emailOffers}
                onChange={(event) => setEmailOffers(event.target.checked)}
              />
            </label>
            <label className="flex items-center justify-between gap-4 rounded-lg bg-black/[0.03] px-4 py-3">
              <span>
                <span className="block font-bold">{t("darkMode")}</span>
                <span className="text-sm text-muted">{t("darkModeCopy")}</span>
              </span>
              <input
                className="h-5 w-5 accent-black"
                type="checkbox"
                checked={theme === "dark"}
                onChange={toggleTheme}
              />
            </label>
          </div>
        </div>
      </div>
    </section>
  );
}
