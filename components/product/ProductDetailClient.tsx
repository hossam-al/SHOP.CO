"use client";

import Image from "next/image";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Palette,
  Ruler,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  Truck,
  X,
  ZoomIn,
} from "lucide-react";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import { Link, type Locale } from "@/i18n/routing";
import { useShopStore } from "@/store/use-shop-store";
import type { Product } from "@/types/product";
import { ProductQuickActions } from "./ProductQuickActions";

type ProductDetailClientProps = {
  product: Product;
  locale: Locale;
  name: string;
  description: string;
  categoryName: string;
};

type ReviewFilter = "latest" | "highest" | "lowest" | "five" | "four";

type Review = {
  id: string;
  reviewer: string;
  rating: number;
  postedAt: string;
  copy_en: string;
  copy_ar: string;
};

const reviewFilters: { value: ReviewFilter; label_en: string; label_ar: string }[] = [
  { value: "latest", label_en: "Latest", label_ar: "الأحدث" },
  { value: "highest", label_en: "Highest rated", label_ar: "الأعلى تقييما" },
  { value: "lowest", label_en: "Lowest rated", label_ar: "الأقل تقييما" },
  { value: "five", label_en: "5 stars", label_ar: "5 نجوم" },
  { value: "four", label_en: "4 stars", label_ar: "4 نجوم" },
];

const initialReviews: Review[] = [
  {
    id: "r1",
    reviewer: "Samantha D.",
    rating: 5,
    postedAt: "2023-08-14",
    copy_en: "I absolutely love this piece. The design is unique and the fabric feels so comfortable.",
    copy_ar: "أحببت القطعة جدا. التصميم مميز والخامة مريحة في اللبس.",
  },
  {
    id: "r2",
    reviewer: "Alex M.",
    rating: 4,
    postedAt: "2023-08-15",
    copy_en: "The colors are vibrant and the print quality is strong. I wish the fit was slightly roomier.",
    copy_ar: "الألوان واضحة وجودة الطباعة قوية. كنت أتمنى أن تكون القصة أوسع قليلا.",
  },
  {
    id: "r3",
    reviewer: "Ethan R.",
    rating: 5,
    postedAt: "2023-08-16",
    copy_en: "A must-have for anyone who likes clean casual styling. It pairs well with almost everything.",
    copy_ar: "اختيار ممتاز لمن يحب الستايل الكاجوال النظيف. سهل التنسيق مع أغلب القطع.",
  },
  {
    id: "r4",
    reviewer: "Olivia P.",
    rating: 4,
    postedAt: "2023-08-17",
    copy_en: "Good value for the price. The stitching feels neat and the product arrived quickly.",
    copy_ar: "قيمة جيدة مقابل السعر. الخياطة نظيفة والطلب وصل بسرعة.",
  },
  {
    id: "r5",
    reviewer: "Liam K.",
    rating: 3,
    postedAt: "2023-08-18",
    copy_en: "Nice product overall, but the color looked a little different from what I expected.",
    copy_ar: "منتج جيد بشكل عام، لكن اللون كان مختلفا قليلا عما توقعت.",
  },
  {
    id: "r6",
    reviewer: "Ava H.",
    rating: 5,
    postedAt: "2023-08-19",
    copy_en: "Soft, easy to wear, and still looks sharp after washing.",
    copy_ar: "ناعم وسهل اللبس وما زال شكله جيدا بعد الغسيل.",
  },
];

const productImagePool = [
  "/images/products/1.png",
  "/images/products/2.png",
  "/images/products/3.png",
  "/images/products/4.png",
  "/images/products/5.png",
  "/images/products/6.png",
  "/images/products/7.png",
  "/images/products/8.png",
];

const featureAccents = ["#111827", "#6b7f68", "#c75d2c", "#1d4ed8"];

function formatSize(size: string, locale: Locale) {
  if (locale !== "ar") return size;

  const labels: Record<string, string> = {
    Small: "صغير",
    Medium: "متوسط",
    Large: "كبير",
    "X-Large": "كبير جدا",
  };

  return labels[size] ?? size;
}

function getGalleryImages(product: Product) {
  const currentIndex = productImagePool.indexOf(product.image);

  if (currentIndex === -1) {
    return [product.image, ...productImagePool.slice(0, 2)];
  }

  return [
    product.image,
    productImagePool[(currentIndex + 1) % productImagePool.length],
    productImagePool[(currentIndex + 2) % productImagePool.length],
  ];
}

function colorToSlug(color: string) {
  return color.replace("#", "").toLowerCase();
}

function hasGeneratedColorVariants(product: Product) {
  return product.image.startsWith("/images/products/generated/") && product.image.endsWith(".svg");
}

function getColorGalleryImages(product: Product, color: string) {
  if (!hasGeneratedColorVariants(product)) {
    return getGalleryImages(product);
  }

  const colorImage = `/images/products/generated/colors/${product.id}-${colorToSlug(color)}.svg`;

  return [0, 1, 2].map((index) => `${colorImage}?view=${index}`);
}

function ProductImageWithColor({
  src,
  color,
  alt,
  width,
  height,
  className,
  priority = false,
}: {
  src: string;
  color: string;
  alt: string;
  width: number;
  height: number;
  className: string;
  priority?: boolean;
}) {
  const isSvg = src.includes(".svg");
  const needsTint = !isSvg;

  return (
    <span className="relative block h-full w-full overflow-hidden">
      <Image
        src={src}
        width={width}
        height={height}
        alt={alt}
        priority={priority}
        className={className}
        unoptimized={isSvg}
      />
      {needsTint ? (
        <span
          className="pointer-events-none absolute inset-0 mix-blend-multiply opacity-25"
          style={{ backgroundColor: color }}
          aria-hidden="true"
        />
      ) : null}
    </span>
  );
}

export function ProductDetailClient({
  product,
  locale,
  name,
  description,
  categoryName,
}: ProductDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[2] ?? product.sizes[0]);
  const [activeTab, setActiveTab] = useState<"details" | "reviews" | "faq">("reviews");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>("latest");
  const [visibleReviewCount, setVisibleReviewCount] = useState(3);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [draftRating, setDraftRating] = useState(5);
  const [draftCopy, setDraftCopy] = useState("");
  const user = useShopStore((state) => state.user);
  const isAr = locale === "ar";

  const gallery = useMemo(() => getColorGalleryImages(product, selectedColor), [product, selectedColor]);
  const featureCards = [
    {
      icon: Sparkles,
      image: gallery[0],
      title: isAr ? "خامة محسنة" : "Premium feel",
      copy: isAr
        ? "ملمس أنعم وثبات أفضل مع الاستخدام المتكرر."
        : "A smoother hand-feel with better shape retention through repeat wear.",
    },
    {
      icon: Palette,
      image: gallery[1],
      title: isAr ? "ألوان جديدة" : "Fresh colors",
      copy: isAr
        ? "درجات مختارة بعناية لتناسب الإطلالات اليومية والستايلات الأهدأ."
        : "Curated tones that work with everyday outfits and cleaner styling.",
    },
    {
      icon: Ruler,
      image: gallery[2],
      title: isAr ? "مقاسات مرنة" : "Flexible sizing",
      copy: isAr
        ? "اختيارات مقاس واضحة مع قصة مريحة وسهلة الحركة."
        : "Clear size options with a comfortable fit that moves naturally.",
    },
  ];
  const filteredReviews = useMemo(() => {
    const nextReviews = [...reviews];

    if (reviewFilter === "highest") {
      return nextReviews.sort((a, b) => b.rating - a.rating || b.postedAt.localeCompare(a.postedAt));
    }

    if (reviewFilter === "lowest") {
      return nextReviews.sort((a, b) => a.rating - b.rating || b.postedAt.localeCompare(a.postedAt));
    }

    if (reviewFilter === "five") {
      return nextReviews.filter((review) => review.rating === 5).sort((a, b) => b.postedAt.localeCompare(a.postedAt));
    }

    if (reviewFilter === "four") {
      return nextReviews.filter((review) => review.rating === 4).sort((a, b) => b.postedAt.localeCompare(a.postedAt));
    }

    return nextReviews.sort((a, b) => b.postedAt.localeCompare(a.postedAt));
  }, [reviewFilter, reviews]);

  const visibleReviews = filteredReviews.slice(0, visibleReviewCount);
  const activeReviewFilter = reviewFilters.find((filter) => filter.value === reviewFilter) ?? reviewFilters[0];

  useEffect(() => {
    if (!isPreviewOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsPreviewOpen(false);
      }

      if (event.key === "ArrowRight") {
        setSelectedImage((current) => (current + 1) % gallery.length);
      }

      if (event.key === "ArrowLeft") {
        setSelectedImage((current) => (current - 1 + gallery.length) % gallery.length);
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [gallery.length, isPreviewOpen]);

  useEffect(() => {
    setVisibleReviewCount(3);
  }, [reviewFilter]);

  function showPreviousImage() {
    setSelectedImage((current) => (current - 1 + gallery.length) % gallery.length);
  }

  function showNextImage() {
    setSelectedImage((current) => (current + 1) % gallery.length);
  }

  function handleReviewSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanCopy = draftCopy.trim();
    if (!user) {
      setIsReviewFormOpen(false);
      setShowLoginPrompt(true);
      return;
    }

    if (!cleanCopy) return;

    const review: Review = {
      id: `local-${Date.now()}`,
      reviewer: user.name,
      rating: draftRating,
      postedAt: new Date().toISOString().slice(0, 10),
      copy_en: cleanCopy,
      copy_ar: cleanCopy,
    };

    setReviews((current) => [review, ...current]);
    setReviewFilter("latest");
    setVisibleReviewCount(3);
    setDraftRating(5);
    setDraftCopy("");
    setIsReviewFormOpen(false);
    setShowLoginPrompt(false);
  }

  function handleWriteReviewClick() {
    if (!user) {
      setIsReviewFormOpen(false);
      setShowLoginPrompt(true);
      return;
    }

    setShowLoginPrompt(false);
    setIsReviewFormOpen((current) => !current);
  }

  return (
    <>
      <nav className="mb-4 flex flex-wrap items-center gap-2 text-xs text-black/60 sm:mb-8 sm:text-sm" aria-label="Breadcrumb">
        <Link className="transition hover:text-black" href="/">
          {isAr ? "الرئيسية" : "Home"}
        </Link>
        <span aria-hidden="true">{isAr ? "‹" : "›"}</span>
        <Link className="transition hover:text-black" href="/PLP">
          {categoryName}
        </Link>
        <span aria-hidden="true">{isAr ? "‹" : "›"}</span>
        <span className="text-black">{name}</span>
      </nav>

      <div className="grid gap-5 sm:gap-10 lg:grid-cols-[minmax(0,610px)_1fr]">
        <div className="grid gap-4 md:grid-cols-[152px_1fr]">
          <div className="order-2 grid grid-cols-3 gap-3 md:order-1 md:grid-cols-1">
            {gallery.map((image, index) => (
              <button
                key={image}
                type="button"
                className={`overflow-hidden rounded-[12px] bg-[var(--background-soft)] transition md:rounded-[16px] ${
                  selectedImage === index ? "ring-2 ring-black" : "hover:ring-2 hover:ring-black/20"
                }`}
                onClick={() => setSelectedImage(index)}
                aria-label={`${isAr ? "عرض صورة المنتج" : "View product image"} ${index + 1}`}
              >
                <ProductImageWithColor
                  src={image}
                  color={selectedColor}
                  width={152}
                  height={167}
                  alt=""
                  className="aspect-square w-full object-cover md:aspect-[152/167]"
                />
              </button>
            ))}
          </div>

          <button
            type="button"
            className="group relative order-1 overflow-hidden rounded-[16px] bg-[var(--background-soft)] text-start md:order-2 md:rounded-[20px]"
            onClick={() => setIsPreviewOpen(true)}
            aria-label={isAr ? "فتح معاينة الصورة" : "Open image preview"}
          >
            <ProductImageWithColor
              src={gallery[selectedImage]}
              color={selectedColor}
              width={900}
              height={900}
              alt={name}
              priority
              className="aspect-square w-full object-cover"
            />
            <span className="absolute bottom-3 end-3 inline-flex h-10 items-center gap-2 rounded-full bg-white/95 px-3 text-xs font-bold text-black shadow-sm transition group-hover:bg-black group-hover:text-white sm:bottom-4 sm:end-4 sm:h-11 sm:px-4 sm:text-sm">
              <ZoomIn size={18} />
              {isAr ? "معاينة" : "Preview"}
            </span>
          </button>
        </div>

        <div className="flex flex-col justify-center">
          <div className="mb-3 hidden w-fit items-center gap-2 rounded-full bg-[var(--background-soft)] px-4 py-2 text-sm font-bold sm:inline-flex">
            <span className={product.inStock ? "text-[var(--success)]" : "text-[var(--danger)]"}>
              {product.inStock ? (isAr ? "متوفر" : "In stock") : isAr ? "غير متوفر" : "Out of stock"}
            </span>
            <span className="text-black/30">•</span>
            <span>{categoryName}</span>
          </div>

          <h1 className="shop-heading text-[26px] leading-[1.05] sm:text-[clamp(32px,5vw,44px)]">{name}</h1>

          <div className="mt-2 flex items-center gap-3 sm:mt-3">
            <span className="stars text-sm sm:text-base" aria-hidden="true">
              {"★★★★★"}
            </span>
            <span className="text-xs text-black/70 sm:text-sm">{product.rating}/5</span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 sm:mt-4 sm:gap-3">
            <strong className="text-2xl sm:text-3xl">${product.price}</strong>
            {product.oldPrice ? <span className="text-2xl font-bold text-black/30 line-through sm:text-3xl">${product.oldPrice}</span> : null}
            {product.discount ? <span className="discount-pill">-{product.discount}%</span> : null}
          </div>

          <p className="mt-3 border-b border-black/10 pb-4 text-xs leading-5 text-muted sm:mt-5 sm:pb-6 sm:text-base sm:leading-7">{description}</p>

          <fieldset className="border-b border-black/10 py-4 sm:py-6">
            <legend className="mb-3 text-xs text-black/60 sm:mb-4 sm:text-base">{isAr ? "اختر اللون" : "Select Colors"}</legend>
            <div className="flex gap-3">
              {product.colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className="grid h-9 w-9 place-items-center rounded-full border border-black/10 text-white shadow-sm transition hover:scale-105 sm:h-10 sm:w-10"
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    setSelectedColor(color);
                    setSelectedImage(0);
                  }}
                  aria-pressed={selectedColor === color}
                  aria-label={`${isAr ? "لون" : "Color"} ${color}`}
                >
                  {selectedColor === color ? <Check size={18} strokeWidth={3} /> : null}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="border-b border-black/10 py-4 sm:py-6">
            <legend className="mb-3 text-xs text-black/60 sm:mb-4 sm:text-base">{isAr ? "اختر المقاس" : "Choose Size"}</legend>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  className={`rounded-full px-4 py-2 text-xs transition sm:px-6 sm:py-3 sm:text-base ${
                    selectedSize === size ? "bg-black text-white" : "bg-[var(--background-soft)] text-black/60 hover:text-black"
                  }`}
                  onClick={() => setSelectedSize(size)}
                  aria-pressed={selectedSize === size}
                >
                  {formatSize(size, locale)}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="mt-4 max-w-xl sm:mt-6">
            <ProductQuickActions productId={product.id} inStock={product.inStock} />
          </div>

          <div className="mt-6 hidden gap-3 text-sm text-black/70 sm:grid sm:grid-cols-3">
            <div className="flex items-center gap-2">
              <Truck size={18} />
              <span>{isAr ? "شحن سريع" : "Fast delivery"}</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} />
              <span>{isAr ? "دفع آمن" : "Secure checkout"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles size={18} />
              <span>{isAr ? "تجربة محسنة" : "New details"}</span>
            </div>
          </div>
        </div>
      </div>

      {isPreviewOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={isAr ? "معاينة صورة المنتج" : "Product image preview"}
        >
          <button
            type="button"
            className="absolute inset-0"
            onClick={() => setIsPreviewOpen(false)}
            aria-label={isAr ? "إغلاق المعاينة" : "Close preview"}
          />

          <div className="relative z-10 grid w-full max-w-5xl gap-4">
            <div className="flex items-center justify-between gap-3 text-white">
              <div>
                <p className="text-sm text-white/70">{categoryName}</p>
                <h2 className="text-xl font-bold">{name}</h2>
              </div>
              <button
                type="button"
                className="grid h-11 w-11 place-items-center rounded-full bg-white text-black transition hover:bg-black hover:text-white"
                onClick={() => setIsPreviewOpen(false)}
                aria-label={isAr ? "إغلاق" : "Close"}
              >
                <X size={22} />
              </button>
            </div>

            <div className="relative overflow-hidden rounded-[16px] bg-white">
              <ProductImageWithColor
                src={gallery[selectedImage]}
                color={selectedColor}
                width={1200}
                height={900}
                alt={name}
                className="max-h-[72vh] w-full object-contain"
              />

              <button
                type="button"
                className="absolute start-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white text-black shadow-sm transition hover:bg-black hover:text-white"
                onClick={showPreviousImage}
                aria-label={isAr ? "الصورة السابقة" : "Previous image"}
              >
                {isAr ? <ChevronRight size={22} /> : <ChevronLeft size={22} />}
              </button>
              <button
                type="button"
                className="absolute end-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white text-black shadow-sm transition hover:bg-black hover:text-white"
                onClick={showNextImage}
                aria-label={isAr ? "الصورة التالية" : "Next image"}
              >
                {isAr ? <ChevronLeft size={22} /> : <ChevronRight size={22} />}
              </button>
            </div>

            <div className="mx-auto flex max-w-full gap-3 overflow-x-auto rounded-full bg-white/10 p-2">
              {gallery.map((image, index) => (
                <button
                  key={`preview-${image}`}
                  type="button"
                  className={`h-16 w-16 shrink-0 overflow-hidden rounded-full bg-white transition ${
                    selectedImage === index ? "ring-2 ring-white" : "opacity-70 hover:opacity-100"
                  }`}
                  onClick={() => setSelectedImage(index)}
                  aria-label={`${isAr ? "عرض صورة" : "Show image"} ${index + 1}`}
                >
                  <ProductImageWithColor
                    src={image}
                    color={selectedColor}
                    width={96}
                    height={96}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <div className="mt-8 grid grid-cols-3 border-b border-black/10 text-center text-xs sm:mt-16 sm:text-base">
        {[
          ["details", isAr ? "تفاصيل المنتج" : "Product Details"],
          ["reviews", isAr ? "التقييمات" : "Rating & Reviews"],
          ["faq", isAr ? "الأسئلة" : "FAQs"],
        ].map(([key, label]) => (
          <button
            key={key}
            type="button"
            className={`pb-4 transition sm:pb-5 ${
              activeTab === key ? "border-b-2 border-black font-medium text-black" : "text-black/60 hover:text-black"
            }`}
            onClick={() => setActiveTab(key as "details" | "reviews" | "faq")}
          >
            {label}
          </button>
        ))}
      </div>

      {activeTab === "details" ? (
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {featureCards.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <article key={feature.title} className="overflow-hidden rounded-[12px] border border-black/10 bg-white">
                <div className="relative aspect-[4/3] bg-[var(--background-soft)]">
                  <Image src={feature.image} width={520} height={390} alt="" className="h-full w-full object-cover" />
                  <span
                    className="absolute start-4 top-4 grid h-10 w-10 place-items-center rounded-full text-white shadow-sm"
                    style={{ backgroundColor: featureAccents[index] }}
                  >
                    <Icon size={20} />
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold">{feature.title}</h3>
                  <p className="mt-2 min-h-[84px] leading-7 text-muted">{feature.copy}</p>
                  <div className="mt-4 flex items-center gap-2">
                    {[...product.colors, ...featureAccents].slice(index, index + 4).map((color) => (
                      <span
                        key={`${feature.title}-${color}`}
                        className="h-6 w-6 rounded-full border border-black/10"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : null}

      {activeTab === "reviews" ? (
        <>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 sm:mt-8 sm:gap-4">
            <h2 className="text-lg font-bold sm:text-2xl">
              {isAr ? "كل التقييمات" : "All Reviews"}{" "}
              <span className="text-xs text-black/40 sm:text-base">({filteredReviews.length})</span>
            </h2>
            <div className="flex gap-2 sm:gap-3">
              <label className="btn-secondary relative !min-h-10 !px-3 sm:!px-5">
                <SlidersHorizontal size={18} />
                <span className="hidden sm:inline">{isAr ? activeReviewFilter.label_ar : activeReviewFilter.label_en}</span>
                <ChevronDown className="hidden sm:block" size={16} />
                <select
                  className="absolute inset-0 cursor-pointer opacity-0"
                  value={reviewFilter}
                  onChange={(event) => setReviewFilter(event.target.value as ReviewFilter)}
                  aria-label={isAr ? "فلترة التقييمات" : "Filter reviews"}
                >
                  {reviewFilters.map((filter) => (
                    <option key={filter.value} value={filter.value}>
                      {isAr ? filter.label_ar : filter.label_en}
                    </option>
                  ))}
                </select>
              </label>
              <button
                className="btn-primary !min-h-10 !px-4 text-xs sm:!px-7 sm:text-base"
                type="button"
                onClick={handleWriteReviewClick}
                aria-expanded={isReviewFormOpen}
              >
                {isAr ? "اكتب تقييما" : "Write a Review"}
              </button>
            </div>
          </div>

          {showLoginPrompt ? (
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-[16px] border border-black/10 bg-[var(--background-soft)] p-5">
              <p className="text-sm font-bold">
                {isAr ? "لازم تسجل دخول الأول عشان تكتب تقييم." : "Please sign in before writing a review."}
              </p>
              <Link className="btn-primary !min-h-10 !px-5 text-sm" href="/LOGIN">
                {isAr ? "تسجيل الدخول" : "Login"}
              </Link>
            </div>
          ) : null}

          {isReviewFormOpen ? (
            <form className="mt-5 grid gap-3 rounded-[16px] border border-black/10 p-5" onSubmit={handleReviewSubmit}>
              <div className="grid gap-3 sm:grid-cols-[1fr_160px]">
                <div className="grid gap-2 text-sm font-bold">
                  <span>{isAr ? "الاسم" : "Name"}</span>
                  <div className="flex min-h-12 items-center rounded-[12px] bg-[var(--background-soft)] px-4 font-bold text-black">
                    {user?.name}
                  </div>
                </div>
                <label className="grid gap-2 text-sm font-bold">
                  {isAr ? "التقييم" : "Rating"}
                  <select
                    className="field !rounded-[12px]"
                    value={draftRating}
                    onChange={(event) => setDraftRating(Number(event.target.value))}
                  >
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <option key={rating} value={rating}>
                        {rating} {isAr ? "نجوم" : "stars"}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="grid gap-2 text-sm font-bold">
                {isAr ? "مراجعتك" : "Your review"}
                <textarea
                  className="field min-h-28 !rounded-[12px]"
                  value={draftCopy}
                  onChange={(event) => setDraftCopy(event.target.value)}
                  placeholder={isAr ? "اكتب رأيك في المنتج" : "Tell us what you think about the product"}
                  required
                />
              </label>
              <div className="flex justify-end gap-2">
                <button className="btn-secondary" type="button" onClick={() => setIsReviewFormOpen(false)}>
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                <button className="btn-primary" type="submit">
                  {isAr ? "نشر التقييم" : "Post Review"}
                </button>
              </div>
            </form>
          ) : null}

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {visibleReviews.map((review) => (
              <article key={review.id} className="card rounded-[16px] p-5 sm:p-7">
                <p className="flex gap-1 text-[var(--warning)]" aria-label={`${review.rating} stars`}>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} size={16} fill={index < review.rating ? "currentColor" : "none"} />
                  ))}
                </p>
                <h3 className="mt-3 text-sm font-bold sm:text-base">
                  {review.reviewer} <span className="text-[var(--success)]">✓</span>
                </h3>
                <p className="mt-3 text-xs leading-5 text-muted sm:text-base sm:leading-7">
                  {isAr ? review.copy_ar : review.copy_en}
                </p>
                <p className="mt-5 text-xs text-black/60 sm:text-sm">
                  {isAr ? "نشر في" : "Posted on"} {review.postedAt}
                </p>
              </article>
            ))}
          </div>

          {visibleReviewCount < filteredReviews.length ? (
            <div className="mt-8 text-center">
              <button className="btn-secondary" type="button" onClick={() => setVisibleReviewCount((current) => current + 3)}>
              {isAr ? "عرض المزيد من التقييمات" : "Load More Reviews"}
              </button>
            </div>
          ) : null}
        </>
      ) : null}

      {activeTab === "faq" ? (
        <div className="mt-6 grid gap-3 sm:mt-8 sm:gap-4">
          {[
            [isAr ? "هل المقاس حقيقي؟" : "Is the fit true to size?", isAr ? "نعم، المقاسات مصممة لتكون قريبة من المقاس المعتاد." : "Yes, the listed sizes are designed to match a standard fit."],
            [isAr ? "ما مدة التوصيل؟" : "How long does delivery take?", isAr ? "عادة يصل الطلب خلال 2 إلى 5 أيام عمل." : "Orders usually arrive within 2 to 5 business days."],
            [isAr ? "هل يمكن الاستبدال أو الإرجاع؟" : "Can I return or exchange it?", isAr ? "نعم، يمكن طلب الاستبدال أو الإرجاع خلال 14 يوما إذا كانت القطعة بحالتها الأصلية." : "Yes, returns and exchanges are available within 14 days when the item is in its original condition."],
            [isAr ? "هل الألوان في الصور دقيقة؟" : "Are the colors accurate?", isAr ? "نحاول عرض الألوان بدقة، لكن قد تختلف قليلا حسب إضاءة الشاشة." : "We try to show colors accurately, but they can vary slightly depending on your screen."],
            [isAr ? "كيف أختار المقاس المناسب؟" : "How do I choose the right size?", isAr ? "اختر مقاسك المعتاد، وإذا كنت بين مقاسين فاختر الأكبر لراحة أكثر." : "Choose your usual size. If you are between sizes, pick the larger one for a more relaxed fit."],
            [isAr ? "هل المنتج مناسب للاستخدام اليومي؟" : "Is it good for everyday wear?", isAr ? "نعم، التصميم والخامة مناسبين للاستخدام اليومي والتنسيق السريع." : "Yes, the fabric and styling are designed for frequent everyday wear."],
          ].map(([question, answer]) => (
            <details key={question} className="group rounded-[12px] border border-black/10 p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold">
                <span>{question}</span>
                <ChevronDown className="shrink-0 transition group-open:rotate-180" size={18} />
              </summary>
              <p className="mt-3 text-sm leading-6 text-muted sm:text-base sm:leading-7">{answer}</p>
            </details>
          ))}
        </div>
      ) : null}
    </>
  );
}
