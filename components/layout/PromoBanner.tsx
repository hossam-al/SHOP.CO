"use client";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Link } from "@/i18n/routing";
import { useShopStore } from "@/store/use-shop-store";

export function PromoBanner() {
  const t = useTranslations("site");
  const [isDismissed, setIsDismissed] = useState(false);
  const user = useShopStore((state) => state.user);

  if (isDismissed) return null;

  const message = user ? t("memberBanner", { name: user.name }) : t("promoBanner");
  const cta = user ? t("shopNow") : t("promoCta");
  const href = user ? "/PLP" : "/SINUP";

  return (
    <div className="relative bg-black px-10 py-2 text-center text-xs text-white sm:text-sm">
      <span>{message} </span>
      <Link href={href} className="font-bold underline">
        {cta}
      </Link>
      <button
        type="button"
        className="absolute end-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-white/90 transition hover:bg-white/10 hover:text-white sm:end-5"
        onClick={() => setIsDismissed(true)}
        aria-label={t("hidePromo")}
      >
        <X size={18} />
      </button>
    </div>
  );
}
