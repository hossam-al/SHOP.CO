"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, CreditCard, Home, Mail, MapPin, Phone, Search, ShieldCheck, Truck, User } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Link, type Locale } from "@/i18n/routing";
import { products } from "@/lib/products";
import { shippingSchema } from "@/schemas/validation";
import { useShopStore } from "@/store/use-shop-store";
import { localizedName } from "@/types/product";

function createOrderId() {
  return `ORD-${Date.now().toString().slice(-6)}`;
}

function addDaysIso(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

const egyptGovernorates = [
  { en: "Cairo", ar: "القاهرة" },
  { en: "Giza", ar: "الجيزة" },
  { en: "Alexandria", ar: "الإسكندرية" },
  { en: "Dakahlia", ar: "الدقهلية" },
  { en: "Red Sea", ar: "البحر الأحمر" },
  { en: "Beheira", ar: "البحيرة" },
  { en: "Fayoum", ar: "الفيوم" },
  { en: "Gharbia", ar: "الغربية" },
  { en: "Ismailia", ar: "الإسماعيلية" },
  { en: "Menofia", ar: "المنوفية" },
  { en: "Minya", ar: "المنيا" },
  { en: "Qaliubiya", ar: "القليوبية" },
  { en: "New Valley", ar: "الوادي الجديد" },
  { en: "Suez", ar: "السويس" },
  { en: "Aswan", ar: "أسوان" },
  { en: "Assiut", ar: "أسيوط" },
  { en: "Beni Suef", ar: "بني سويف" },
  { en: "Port Said", ar: "بورسعيد" },
  { en: "Damietta", ar: "دمياط" },
  { en: "Sharqia", ar: "الشرقية" },
  { en: "South Sinai", ar: "جنوب سيناء" },
  { en: "Kafr El Sheikh", ar: "كفر الشيخ" },
  { en: "Matrouh", ar: "مطروح" },
  { en: "Luxor", ar: "الأقصر" },
  { en: "Qena", ar: "قنا" },
  { en: "North Sinai", ar: "شمال سيناء" },
  { en: "Sohag", ar: "سوهاج" },
];

function FieldShell({
  label,
  icon,
  error,
  children,
}: {
  label: string;
  icon: ReactNode;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-2">
      <span className="flex items-center gap-2 text-sm font-bold text-[var(--fg)]">
        {icon}
        {label}
      </span>
      {children}
      <span className="min-h-5 text-sm text-red-600" aria-live="polite">
        {error}
      </span>
    </label>
  );
}

export function CheckoutClient() {
  const t = useTranslations("checkout");
  const f = useTranslations("forms");
  const cartText = useTranslations("cart");
  const locale = useLocale() as Locale;
  const isAr = locale === "ar";
  const [step, setStep] = useState<"shipping" | "review" | "success">("shipping");
  const [governorateQuery, setGovernorateQuery] = useState("");
  const cart = useShopStore((state) => state.cart);
  const clearCart = useShopStore((state) => state.clearCart);
  const addOrder = useShopStore((state) => state.addOrder);
  const user = useShopStore((state) => state.user);
  const schema = useMemo(
    () =>
      shippingSchema(
        {
          required: f("required"),
          emailInvalid: f("emailInvalid"),
          passwordMin: f("passwordMin"),
          phoneInvalid: f("phoneInvalid"),
        },
        { emailOptional: Boolean(user) },
      ),
    [f, user],
  );
  type Shipping = z.infer<typeof schema>;
  const form = useForm<Shipping>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      governorate: "",
      city: "",
      address: "",
      phone: "",
    },
  });
  const selectedGovernorate = form.watch("governorate");
  const governorateOptions = useMemo(
    () =>
      egyptGovernorates.map((governorate) => ({
        value: isAr ? governorate.ar : governorate.en,
        search: `${governorate.en} ${governorate.ar}`.toLowerCase(),
      })),
    [isAr],
  );
  const filteredGovernorates = useMemo(() => {
    const query = governorateQuery.trim().toLowerCase();
    if (!query) return governorateOptions;
    return governorateOptions.filter((governorate) => governorate.search.includes(query));
  }, [governorateOptions, governorateQuery]);
  const lines = cart
    .map((line) => ({ ...line, product: products.find((product) => product.id === line.productId) }))
    .filter((line) => line.product);
  const subtotal = lines.reduce((sum, line) => sum + (line.product?.price ?? 0) * line.quantity, 0);
  const shippingFee = subtotal > 0 ? 12 : 0;
  const total = subtotal + shippingFee;
  const shippingValues = form.getValues();
  const inputClass = "field !rounded-[14px] !bg-[var(--soft)] focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10";

  useEffect(() => {
    if (!user) return;
    form.setValue("name", user.name, { shouldValidate: true });
    form.setValue("email", user.email, { shouldValidate: true });
  }, [form, user]);

  if (step === "success") {
    return (
      <section className="container-page py-16 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[var(--success)]/15 text-[var(--success)]">
          <CheckCircle2 size={34} />
        </div>
        <h1 className="mt-5 text-4xl font-black">{t("success")}</h1>
        <p className="mt-4 text-muted">{t("successCopy")}</p>
        <Link className="btn-primary mt-8" href="/home">
          {cartText("continue")}
        </Link>
      </section>
    );
  }

  return (
    <section className="container-page py-8 sm:py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-muted">{t("shipping")}</p>
          <h1 className="mt-2 text-3xl font-black sm:text-4xl">{t("title")}</h1>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-xs font-bold text-muted">
          <ShieldCheck size={16} />
          {t("secure")}
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        {step === "shipping" ? (
          <form className="grid gap-5" onSubmit={form.handleSubmit(() => setStep("review"))}>
            <div className="card p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] pb-4">
                <div>
                  <h2 className="text-xl font-black">{t("contactTitle")}</h2>
                  <p className="mt-1 text-sm text-muted">
                    {user ? t("signedInCopy", { email: user.email }) : t("guestCopy")}
                  </p>
                </div>
                <User className="mt-1 text-muted" size={22} />
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <FieldShell label={f("name")} icon={<User size={16} />} error={form.formState.errors.name?.message}>
                  <input className={inputClass} placeholder={isAr ? "مثال: حسام علي" : "Example: Hossam Ali"} {...form.register("name")} />
                </FieldShell>

                {user ? (
                  <div className="grid gap-2">
                    <span className="flex items-center gap-2 text-sm font-bold">
                      <Mail size={16} />
                      {f("email")}
                    </span>
                    <div className="flex min-h-[50px] items-center justify-between gap-3 rounded-[14px] border border-[var(--border)] bg-[var(--soft)] px-4 text-sm">
                      <span className="truncate font-bold">{user.email}</span>
                      <span className="shrink-0 rounded-full bg-[var(--success)]/15 px-3 py-1 text-xs font-bold text-[var(--success)]">
                        {t("accountEmail")}
                      </span>
                    </div>
                    <input type="hidden" {...form.register("email")} />
                    <span className="min-h-5 text-sm text-muted">{t("emailOptional")}</span>
                  </div>
                ) : (
                  <FieldShell label={f("email")} icon={<Mail size={16} />} error={form.formState.errors.email?.message}>
                    <input
                      className={inputClass}
                      type="email"
                      placeholder={isAr ? "example@email.com" : "name@example.com"}
                      {...form.register("email")}
                    />
                  </FieldShell>
                )}

                <FieldShell label={f("phone")} icon={<Phone size={16} />} error={form.formState.errors.phone?.message}>
                  <input className={inputClass} inputMode="tel" placeholder="+20 100 000 0000" {...form.register("phone")} />
                </FieldShell>
              </div>
            </div>

            <div className="card p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] pb-4">
                <div>
                  <h2 className="text-xl font-black">{t("addressTitle")}</h2>
                  <p className="mt-1 text-sm text-muted">{t("addressCopy")}</p>
                </div>
                <Truck className="mt-1 text-muted" size={22} />
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2 sm:col-span-2">
                  <span className="flex items-center gap-2 text-sm font-bold">
                    <MapPin size={16} />
                    {t("governorate")}
                  </span>
                  <div className="rounded-[18px] border border-[var(--border)] bg-[var(--soft)] p-3">
                    <div className="relative">
                      <Search className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                      <input
                        className="field field-icon !min-h-[48px] !rounded-[12px] !border-[var(--border)] !bg-[var(--card)]"
                        placeholder={t("governorateSearch")}
                        value={governorateQuery}
                        onChange={(event) => {
                          const nextQuery = event.target.value;
                          const exactMatch = governorateOptions.find(
                            (governorate) => governorate.value.toLowerCase() === nextQuery.trim().toLowerCase(),
                          );

                          setGovernorateQuery(nextQuery);
                          form.setValue("governorate", exactMatch?.value ?? "", {
                            shouldDirty: true,
                            shouldValidate: form.formState.isSubmitted,
                          });
                        }}
                      />
                    </div>
                    <div className="mt-3 grid max-h-44 gap-2 overflow-y-auto pe-1 sm:grid-cols-3">
                      {filteredGovernorates.map((governorate) => (
                        <button
                          key={governorate.value}
                          type="button"
                          className={`rounded-full border px-3 py-2 text-sm font-bold transition ${
                            selectedGovernorate === governorate.value
                              ? "border-black bg-black text-white"
                              : "border-[var(--border)] bg-[var(--card)] text-[var(--fg)] hover:border-black"
                          }`}
                          onClick={() => {
                            form.setValue("governorate", governorate.value, { shouldDirty: true, shouldValidate: true });
                            setGovernorateQuery(governorate.value);
                          }}
                        >
                          {governorate.value}
                        </button>
                      ))}
                    </div>
                  </div>
                  <span className="min-h-5 text-sm text-red-600" aria-live="polite">
                    {form.formState.errors.governorate?.message}
                  </span>
                </div>

                <FieldShell label={t("area")} icon={<MapPin size={16} />} error={form.formState.errors.city?.message}>
                  <input
                    className={inputClass}
                    placeholder={isAr ? "مثال: مصر الجديدة، الدقي" : "Example: Heliopolis, Dokki"}
                    {...form.register("city")}
                  />
                </FieldShell>

                <FieldShell label={f("address")} icon={<Home size={16} />} error={form.formState.errors.address?.message}>
                  <input
                    className={inputClass}
                    placeholder={isAr ? "عمارة 12، شارع الثورة، الدور 3" : "Building 12, El Thawra St, floor 3"}
                    {...form.register("address")}
                  />
                </FieldShell>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted">{t("deliveryNote")}</p>
              <button className="btn-primary min-w-44" type="submit" disabled={!lines.length}>
                {t("next")}
              </button>
            </div>
          </form>
        ) : (
          <div className="card p-5 sm:p-6">
            <h2 className="text-2xl font-black">{t("review")}</h2>
            <div className="mt-5 grid gap-3 rounded-[16px] bg-[var(--soft)] p-4 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-muted">{f("name")}</span>
                <strong>{shippingValues.name}</strong>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted">{f("email")}</span>
                <strong className="truncate">{shippingValues.email || user?.email}</strong>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted">{t("governorate")}</span>
                <strong>{shippingValues.governorate}</strong>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted">{t("area")}</span>
                <strong>{shippingValues.city}</strong>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted">{f("address")}</span>
                <strong>{shippingValues.address}</strong>
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              {lines.map(({ product, quantity }) =>
                product ? (
                  <div key={product.id} className="flex justify-between gap-3 border-b border-[var(--border)] pb-3">
                    <span>
                      {localizedName(product, locale)} x {quantity}
                    </span>
                    <strong>${(product.price * quantity).toFixed(2)}</strong>
                  </div>
                ) : null,
              )}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button className="btn-secondary" type="button" onClick={() => setStep("shipping")}>
                {t("back")}
              </button>
              <button
                className="btn-primary"
                type="button"
                disabled={!lines.length}
                onClick={() => {
                  const values = form.getValues();
                  addOrder({
                    id: createOrderId(),
                    date: new Date().toISOString(),
                    status: "processing",
                    trackingNumber: `SCO-${Math.floor(100000 + Math.random() * 900000)}`,
                    estimatedDelivery: addDaysIso(3),
                    subtotal,
                    shippingFee,
                    total,
                    lines: cart.map((line) => ({ ...line })),
                    address: {
                      name: values.name,
                      email: values.email || user?.email || "",
                      phone: values.phone,
                      governorate: values.governorate,
                      city: values.city,
                      address: values.address,
                    },
                  });
                  clearCart();
                  setStep("success");
                }}
              >
                {t("place")}
              </button>
            </div>
          </div>
        )}

        <aside className="card h-fit p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-black">{t("orderSummary")}</h2>
            <CreditCard size={20} className="text-muted" />
          </div>
          <div className="mt-5 grid gap-4">
            {lines.length ? (
              lines.map(({ product, quantity }) =>
                product ? (
                  <div key={product.id} className="flex items-start justify-between gap-3 text-sm">
                    <div>
                      <p className="font-bold">{localizedName(product, locale)}</p>
                      <p className="text-muted">
                        {cartText("quantity")}: {quantity}
                      </p>
                    </div>
                    <strong>${(product.price * quantity).toFixed(2)}</strong>
                  </div>
                ) : null,
              )
            ) : (
              <p className="rounded-[14px] bg-[var(--soft)] p-4 text-sm text-muted">{cartText("empty")}</p>
            )}
          </div>
          <div className="mt-5 grid gap-3 border-t border-[var(--border)] pt-5 text-sm">
            <div className="flex items-center justify-between">
              <span>{cartText("subtotal")}</span>
              <strong>${subtotal.toFixed(2)}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span>{t("shippingFee")}</span>
              <strong>${shippingFee.toFixed(2)}</strong>
            </div>
            <div className="flex items-center justify-between text-lg">
              <span className="font-black">{cartText("total")}</span>
              <strong>${total.toFixed(2)}</strong>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
