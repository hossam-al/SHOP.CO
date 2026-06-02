"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { products } from "@/lib/products";
import type { Locale } from "@/i18n/routing";
import { localizedName } from "@/types/product";
import { shippingSchema } from "@/schemas/validation";
import { Link } from "@/i18n/routing";
import { useShopStore } from "@/store/use-shop-store";

export function CheckoutClient() {
  const t = useTranslations("checkout");
  const f = useTranslations("forms");
  const cartText = useTranslations("cart");
  const locale = useLocale() as Locale;
  const [step, setStep] = useState<"shipping" | "review" | "success">("shipping");
  const cart = useShopStore((state) => state.cart);
  const clearCart = useShopStore((state) => state.clearCart);
  const schema = useMemo(
    () => shippingSchema({
      required: f("required"),
      emailInvalid: f("emailInvalid"),
      passwordMin: f("passwordMin"),
      phoneInvalid: f("phoneInvalid"),
    }),
    [f],
  );
  type Shipping = z.infer<typeof schema>;
  const form = useForm<Shipping>({ resolver: zodResolver(schema), mode: "onBlur" });
  const lines = cart
    .map((line) => ({ ...line, product: products.find((product) => product.id === line.productId) }))
    .filter((line) => line.product);
  const subtotal = lines.reduce((sum, line) => sum + (line.product?.price ?? 0) * line.quantity, 0);

  if (step === "success") {
    return (
      <section className="container-page py-16 text-center">
        <h1 className="text-4xl font-black">{t("success")}</h1>
        <p className="mt-4 text-muted">{t("successCopy")}</p>
        <Link className="btn-primary mt-8" href="/">
          {cartText("continue")}
        </Link>
      </section>
    );
  }

  return (
    <section className="container-page py-12">
      <h1 className="text-4xl font-black">{t("title")}</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        {step === "shipping" ? (
          <form className="card grid gap-4 p-5" onSubmit={form.handleSubmit(() => setStep("review"))}>
            {(["name", "email", "address", "city", "phone"] as const).map((field) => (
              <label key={field} className="grid gap-2 font-bold">
                {f(field)}
                <input className="field" {...form.register(field)} />
                <span className="min-h-5 text-sm text-red-600" aria-live="polite">
                  {form.formState.errors[field]?.message}
                </span>
              </label>
            ))}
            <button className="btn-primary w-fit" type="submit">
              {t("next")}
            </button>
          </form>
        ) : (
          <div className="card p-5">
            <h2 className="text-2xl font-black">{t("review")}</h2>
            <div className="mt-5 grid gap-3">
              {lines.map(({ product, quantity }) =>
                product ? (
                  <div key={product.id} className="flex justify-between gap-3 border-b border-[var(--border)] pb-3">
                    <span>{localizedName(product, locale)} x {quantity}</span>
                    <strong>${(product.price * quantity).toFixed(2)}</strong>
                  </div>
                ) : null,
              )}
            </div>
            <div className="mt-6 flex gap-3">
              <button className="btn-secondary" onClick={() => setStep("shipping")}>{t("back")}</button>
              <button
                className="btn-primary"
                onClick={() => {
                  clearCart();
                  setStep("success");
                }}
              >
                {t("place")}
              </button>
            </div>
          </div>
        )}
        <aside className="card h-fit p-5">
          <h2 className="text-xl font-bold">{t("review")}</h2>
          <div className="mt-4 flex items-center justify-between">
            <span>{cartText("subtotal")}</span>
            <strong>${subtotal.toFixed(2)}</strong>
          </div>
        </aside>
      </div>
    </section>
  );
}
