import Image from "next/image";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import { localizedName, localizedDescription, type Product } from "@/lib/types";
import { ProductQuickActions } from "./ProductQuickActions";

export async function ProductCard({ product, locale }: { product: Product; locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "product" });

  return (
    <article className="card overflow-hidden">
      <Link href={`/product/${product.id}`} className="block bg-[#f1ede4]">
        <Image
          src={product.image}
          width={640}
          height={640}
          alt={localizedName(product, locale)}
          className="aspect-square w-full object-cover"
        />
      </Link>
      <div className="grid gap-3 p-4">
        <div>
          <p className="text-sm capitalize text-muted">{product.category}</p>
          <h2 className="mt-1 text-lg font-bold">{localizedName(product, locale)}</h2>
          <p className="mt-2 line-clamp-2 text-sm text-muted">{localizedDescription(product, locale)}</p>
        </div>
        <div className="flex items-center justify-between gap-3">
          <strong>${product.price.toFixed(2)}</strong>
          <span className={product.inStock ? "text-sm text-green-700" : "text-sm text-red-600"}>
            {product.inStock ? t("inStock") : t("outStock")}
          </span>
        </div>
        <ProductQuickActions productId={product.id} inStock={product.inStock} />
      </div>
    </article>
  );
}
