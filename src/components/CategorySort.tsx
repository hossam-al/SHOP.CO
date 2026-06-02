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
    <label className="grid gap-2 text-sm font-bold">
      {t("sort")}
      <select className="field min-w-56" value={value} onChange={(event) => update(event.target.value)}>
        <option value="featured">{t("featured")}</option>
        <option value="price-asc">{t("priceAsc")}</option>
        <option value="price-desc">{t("priceDesc")}</option>
      </select>
    </label>
  );
}
