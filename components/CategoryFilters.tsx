"use client";

import { ChevronDown, ChevronRight, SlidersHorizontal, X } from "lucide-react";
import * as Slider from "@radix-ui/react-slider";
import { useEffect, useState, type ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Link } from "@/i18n/routing";

type CategoryFiltersProps = {
  colors: string[];
  sizes: string[];
  minPrice: number;
  maxPrice: number;
  locale: "en" | "ar";
  currentCategory: string;
  categories: { slug: string; name_en: string; name_ar: string }[];
  showMobileButton?: boolean;
  showDesktopSidebar?: boolean;
};

type FilterSection = "price" | "colors" | "size" | "dressStyle";

function getParamList(searchParams: Pick<URLSearchParams, "get">, key: string) {
  return searchParams.get(key)?.split(",").filter(Boolean) ?? [];
}

export function CategoryFilters({
  colors,
  sizes,
  minPrice,
  maxPrice,
  locale,
  currentCategory,
  categories,
  showMobileButton = true,
  showDesktopSidebar = true,
}: CategoryFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSections, setOpenSections] = useState<Record<FilterSection, boolean>>({
    price: true,
    colors: true,
    size: true,
    dressStyle: true,
  });
  const searchKey = searchParams.toString();
  const selectedColors = getParamList(searchParams, "color");
  const selectedSizes = getParamList(searchParams, "size");
  const currentMin = searchParams.get("min") ?? "";
  const currentMax = searchParams.get("max") ?? "";
  const [draftColors, setDraftColors] = useState<string[]>(selectedColors);
  const [draftSizes, setDraftSizes] = useState<string[]>(selectedSizes);
  const [draftMin, setDraftMin] = useState(currentMin);
  const [draftMax, setDraftMax] = useState(currentMax);
  const selectedMinPrice = draftMin ? Number(draftMin) : minPrice;
  const selectedMaxPrice = draftMax ? Number(draftMax) : maxPrice;
  const hasFilters = Boolean(draftColors.length || draftSizes.length || draftMin || draftMax);

  useEffect(() => {
    setDraftColors(selectedColors);
    setDraftSizes(selectedSizes);
    setDraftMin(currentMin);
    setDraftMax(currentMax);
  }, [searchKey]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  function updateParams(updater: (params: URLSearchParams) => void) {
    const params = new URLSearchParams(searchParams);
    updater(params);
    const next = params.toString();
    router.replace(next ? `?${next}` : "?");
  }

  function toggleListValue(key: "color" | "size", value: string) {
    const setDraft = key === "color" ? setDraftColors : setDraftSizes;
    setDraft((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    );
  }

  function updatePriceRange(nextValue: number[]) {
    const [nextMin, nextMax] = nextValue;
    setDraftMin(String(nextMin));
    setDraftMax(String(nextMax));
  }

  function applyFilters() {
    updateParams((params) => {
      params.delete("color");
      params.delete("size");
      params.delete("min");
      params.delete("max");
      params.delete("page");

      if (draftColors.length) params.set("color", draftColors.join(","));
      if (draftSizes.length) params.set("size", draftSizes.join(","));
      if (draftMin) params.set("min", draftMin);
      if (draftMax) params.set("max", draftMax);
    });
    setMobileOpen(false);
  }

  function clearFilters() {
    setDraftColors([]);
    setDraftSizes([]);
    setDraftMin("");
    setDraftMax("");
    updateParams((params) => {
      params.delete("color");
      params.delete("size");
      params.delete("min");
      params.delete("max");
      params.delete("page");
    });
  }

  function toggleSection(section: FilterSection) {
    setOpenSections((current) => ({ ...current, [section]: !current[section] }));
  }

  function FilterTab({
    id,
    title,
    children,
    isLast = false,
  }: {
    id: FilterSection;
    title: string;
    children: ReactNode;
    isLast?: boolean;
  }) {
    const isOpen = openSections[id];

    return (
      <div className={`${isLast ? "" : "border-b border-black/10"} py-5`}>
        <button
          type="button"
          className="flex w-full items-center justify-between gap-3 text-left"
          onClick={() => toggleSection(id)}
          aria-expanded={isOpen}
        >
          <h3 className="text-base font-bold">{title}</h3>
          <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        </button>

        <div
          className={`grid transition-all duration-300 ease-in-out ${
            isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="min-h-0 overflow-hidden">
            <div className="pt-5">{children}</div>
          </div>
        </div>
      </div>
    );
  }

  const content = (
    <>
      <div className="flex items-center justify-between gap-3 border-b border-black/10 pb-5">
        <h2 className="text-xl font-bold">Filters</h2>
        <SlidersHorizontal className="h-5 w-5 text-black/50" />
      </div>

      <FilterTab id="price" title="Price">
        <div className="px-1 pb-1">
          <Slider.Root
            className="relative flex h-8 w-full touch-none select-none items-center"
            min={minPrice}
            max={maxPrice}
            step={5}
            value={[selectedMinPrice, selectedMaxPrice]}
            minStepsBetweenThumbs={1}
            onValueChange={updatePriceRange}
          >
            <Slider.Track className="relative h-1.5 grow overflow-hidden rounded-full bg-black/5">
              <Slider.Range className="absolute h-full rounded-full bg-black" />
            </Slider.Track>
            <Slider.Thumb
              className="block h-7 w-7 rounded-full bg-black shadow-sm outline-none transition focus-visible:ring-4 focus-visible:ring-black/20"
              aria-label="Minimum price"
            />
            <Slider.Thumb
              className="block h-7 w-7 rounded-full bg-black shadow-sm outline-none transition focus-visible:ring-4 focus-visible:ring-black/20"
              aria-label="Maximum price"
            />
          </Slider.Root>
          <div className="mt-1 flex items-center justify-between text-base font-medium text-black">
            <span>
              ${selectedMinPrice}
            </span>
            <span>
              ${selectedMaxPrice}
            </span>
          </div>
        </div>
      </FilterTab>

      <FilterTab id="colors" title="Colors">
        <div className="flex max-w-full flex-wrap gap-2">
          {colors.map((color) => {
            const selected = draftColors.includes(color);
            return (
              <button
                key={color}
                type="button"
                className={`h-9 w-9 shrink-0 rounded-full border transition hover:scale-105 ${
                  selected ? "border-black ring-2 ring-black ring-offset-2" : "border-black/10"
                }`}
                style={{ backgroundColor: color }}
                onClick={() => toggleListValue("color", color)}
                aria-label={`Filter by color ${color}`}
                aria-pressed={selected}
              />
            );
          })}
        </div>
      </FilterTab>

      <FilterTab id="size" title="Size">
        <div className="flex max-w-full flex-wrap gap-2">
          {sizes.map((size) => {
            const selected = draftSizes.includes(size);
            return (
              <button
                key={size}
                type="button"
                className={`min-w-0 max-w-full rounded-full px-4 py-2 text-sm transition hover:bg-black/[0.03] ${
                  selected ? "bg-black text-white" : "bg-[var(--background-soft)] text-black/70"
                }`}
                onClick={() => toggleListValue("size", size)}
                aria-pressed={selected}
              >
                <span className="block min-w-0 truncate">{size}</span>
              </button>
            );
          })}
        </div>
      </FilterTab>

      <FilterTab id="dressStyle" title="Dress Style" isLast>
        <div className="grid gap-1 text-sm text-black/70">
          {categories.map((category) => {
            const active = category.slug === currentCategory;
            return (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className={`flex w-full items-center justify-between rounded-lg px-2 py-2 transition hover:bg-black/[0.03] ${
                  active ? "font-bold text-black" : ""
                }`}
              >
                <span className="min-w-0 flex-1 truncate">
                  {locale === "ar" ? category.name_ar : category.name_en}
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-black/60" />
              </Link>
            );
          })}
        </div>
      </FilterTab>

      <div className="grid gap-3 border-t border-black/10 pt-5">
        <button className="btn-primary w-full" type="button" onClick={applyFilters}>
          Apply Filter
        </button>
        {hasFilters ? (
          <button className="btn-secondary w-full" type="button" onClick={clearFilters}>
            Clear Filters
          </button>
        ) : null}
      </div>
    </>
  );

  return (
    <>
      {showMobileButton ? (
        <button
          type="button"
          className="btn-secondary flex items-center gap-2 lg:!hidden"
          onClick={() => setMobileOpen(true)}
        >
          <SlidersHorizontal size={18} /> Filters
        </button>
      ) : null}

      {showDesktopSidebar ? (
        <aside className="hidden w-[295px] shrink-0 lg:block">
          <div className="scrollbar-hidden sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto rounded-2xl border border-black/10 bg-white p-5">
            {content}
          </div>
        </aside>
      ) : null}

      {showMobileButton && mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-[998] bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close filters overlay"
        />
      ) : null}

      {showMobileButton ? (
        <div
          className={`scrollbar-hidden fixed bottom-0 left-0 right-0 z-[999] max-h-[88vh] overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
            mobileOpen ? "translate-y-0" : "translate-y-full"
          }`}
          role="dialog"
          aria-modal="true"
          aria-hidden={!mobileOpen}
        >
          <div className="mb-2 flex justify-end">
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full border border-black/10"
              onClick={() => setMobileOpen(false)}
              aria-label="Close filters"
            >
              <X size={18} />
            </button>
          </div>
          {content}
        </div>
      ) : null}
    </>
  );
}
