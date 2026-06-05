"use client";

import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";

export function CategorySort({ value }: { value: string }) {
  const t = useTranslations("category");
  const router = useRouter();
  const searchParams = useSearchParams();

  function update(nextValue: string) {
    const params = new URLSearchParams(searchParams);
    if (nextValue === "featured") params.delete("sort");
    else params.set("sort", nextValue);
    params.delete("page");
    router.replace(`?${params.toString()}`);
  }

  return (
    <label className="flex min-w-0 items-center gap-2 text-sm">
      <span className="text-black/60">{t("sort")}:</span>
      <select
        className="max-w-full rounded-full border border-black/10 bg-[#F2F0F1] px-4 py-2 text-sm font-medium text-black outline-none transition hover:bg-black/5 focus:border-black/30"
        value={value}
        onChange={(event) => update(event.target.value)}
      >
        <option value="featured">{t("featured")}</option>
        <option value="price-asc">{t("priceAsc")}</option>
        <option value="price-desc">{t("priceDesc")}</option>
        <option value="rating">{t("rating")}</option>
      </select>
    </label>
  );
}
