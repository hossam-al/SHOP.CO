import Image from "next/image";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import { localizedName, localizedDescription, type Product } from "@/types/product";
import { ProductQuickActions } from "./ProductQuickActions";

export function ProductCard({ product, locale, compact = false }: { product: Product; locale: Locale; compact?: boolean }) {
  return (
    <article className="group">
      <Link href={`/product/${product.id}`} className="block overflow-hidden rounded-[20px] bg-[var(--background-soft)]">
        <Image
          src={product.image}
          width={640}
          height={640}
          alt={localizedName(product, locale)}
          className="aspect-square w-full object-cover"
        />
      </Link>
      <div className="grid gap-2 pt-4">
        <div>
          <h2 className="text-lg font-bold">{localizedName(product, locale)}</h2>
          {!compact ? <p className="mt-2 line-clamp-2 text-sm text-muted">{localizedDescription(product, locale)}</p> : null}
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="stars">★★★★★</span>
          <span className="text-black/60">{product.rating}/5</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <strong className="text-2xl">${product.price}</strong>
          {product.oldPrice ? <span className="text-2xl font-bold text-black/40 line-through">${product.oldPrice}</span> : null}
          {product.discount ? <span className="discount-pill">-{product.discount}%</span> : null}
        </div>
        {!compact ? <ProductQuickActions productId={product.id} inStock={product.inStock} /> : null}
      </div>
    </article>
  );
}
