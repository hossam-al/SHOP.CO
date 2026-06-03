import Image from "next/image";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import { localizedDescription, localizedName, type Product } from "@/types/product";
import { ProductQuickActions } from "./ProductQuickActions";

export function ProductCard({ product, locale, compact = false }: { product: Product; locale: Locale; compact?: boolean }) {
  return (
    <article className="group flex h-full flex-col">
      <Link
        href={`/product/${product.id}`}
        className="relative block overflow-hidden rounded-[12px] bg-[var(--background-soft)]"
      >
        <Image
          src={product.image}
          width={640}
          height={640}
          alt={localizedName(product, locale)}
          className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105"
        />
        {product.discount ? (
          <span className="absolute end-3 top-3 rounded-full bg-black px-3 py-1 text-xs font-bold text-white">
            -{product.discount}%
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col gap-2 pt-3 sm:pt-4">
        <div className="min-h-[48px]">
          <h2 className="line-clamp-2 text-sm font-bold leading-5 sm:text-lg">{localizedName(product, locale)}</h2>
          {!compact ? <p className="mt-2 line-clamp-2 text-sm text-muted">{localizedDescription(product, locale)}</p> : null}
        </div>

        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <span className="stars">{"\u2605\u2605\u2605\u2605\u2605"}</span>
          <span className="text-black/60">{product.rating}/5</span>
        </div>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <strong className="text-xl sm:text-2xl">${product.price}</strong>
          {product.oldPrice ? (
            <span className="text-lg font-bold text-black/40 line-through sm:text-2xl">${product.oldPrice}</span>
          ) : null}
          {product.discount ? <span className="discount-pill hidden sm:inline-flex">-{product.discount}%</span> : null}
        </div>

        <div className="mt-auto pt-2 opacity-100 transition duration-300 md:translate-y-1 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
          <ProductQuickActions productId={product.id} inStock={product.inStock} compact={compact} />
        </div>
      </div>
    </article>
  );
}
