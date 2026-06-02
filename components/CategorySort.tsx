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
    router.replace(`?${params.toString()}`);
  }

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-black/60">{t("sort")}:</span>
      <select className="bg-transparent font-bold text-black outline-none" value={value} onChange={(event) => update(event.target.value)}>
        <option value="featured">{t("featured")}</option>
        <option value="price-asc">{t("priceAsc")}</option>
        <option value="price-desc">{t("priceDesc")}</option>
      </select>
    </label>
  );
}
