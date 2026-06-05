"use client";

import Image from "next/image";
import {
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  MapPin,
  Package,
  PackageOpen,
  ReceiptText,
  RotateCcw,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { Link, type Locale } from "@/i18n/routing";
import { products } from "@/lib/products";
import { useShopStore } from "@/store/use-shop-store";
import type { Order, OrderStatus } from "@/types/product";
import { localizedName } from "@/types/product";

const statusFilters: Array<OrderStatus | "all"> = ["all", "processing", "shipped", "delivered", "cancelled"];
const progressStatuses: OrderStatus[] = ["processing", "shipped", "delivered"];

function formatMoney(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function formatDate(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function statusTranslationKey(status: OrderStatus | "all") {
  const key = status.charAt(0).toUpperCase() + status.slice(1);
  return `orderStatus${key}`;
}

function getStatusClasses(status: OrderStatus) {
  if (status === "delivered") return "bg-[var(--success)]/15 text-[var(--success)]";
  if (status === "cancelled") return "bg-[var(--danger)]/15 text-[var(--danger)]";
  if (status === "shipped") return "bg-blue-500/15 text-blue-500";
  return "bg-[var(--warning)]/15 text-[var(--warning)]";
}

function OrderProgress({ status, locale, t }: { status: OrderStatus; locale: Locale; t: ReturnType<typeof useTranslations> }) {
  if (status === "cancelled") {
    return (
      <div className="rounded-[14px] bg-[var(--danger)]/10 p-4 text-sm font-bold text-[var(--danger)]">
        {t("orderCancelledCopy")}
      </div>
    );
  }

  const activeIndex = progressStatuses.indexOf(status);

  return (
    <div className="grid gap-3">
      <div className="grid grid-cols-3 gap-2 text-xs font-bold text-muted">
        {progressStatuses.map((stepStatus, index) => (
          <span key={stepStatus} className={index <= activeIndex ? "text-[var(--fg)]" : ""}>
            {t(statusTranslationKey(stepStatus))}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2" dir={locale === "ar" ? "rtl" : "ltr"}>
        {progressStatuses.map((stepStatus, index) => (
          <div
            key={stepStatus}
            className={`h-2 rounded-full ${index <= activeIndex ? "bg-black dark:bg-white" : "bg-[var(--border)]"}`}
          />
        ))}
      </div>
    </div>
  );
}

function OrderCard({
  order,
  locale,
  isExpanded,
  onToggle,
  onBuyAgain,
}: {
  order: Order;
  locale: Locale;
  isExpanded: boolean;
  onToggle: () => void;
  onBuyAgain: () => void;
}) {
  const t = useTranslations("accountPage");
  const cartText = useTranslations("cart");
  const isAr = locale === "ar";
  const orderProducts = order.lines
    .map((line) => ({ ...line, product: products.find((product) => product.id === line.productId) }))
    .filter((line) => line.product);
  const visibleProducts = isExpanded ? orderProducts : orderProducts.slice(0, 2);

  return (
    <article className="card overflow-hidden">
      <div className="grid gap-5 p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-black">{order.id}</h2>
              <span className={`rounded-full px-3 py-1 text-xs font-black ${getStatusClasses(order.status)}`}>
                {t(statusTranslationKey(order.status))}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted">
              <span className="inline-flex items-center gap-2">
                <CalendarDays size={16} />
                {formatDate(order.date, locale)}
              </span>
              <span className="inline-flex items-center gap-2">
                <Truck size={16} />
                {t("estimatedDelivery")}: {formatDate(order.estimatedDelivery, locale)}
              </span>
            </div>
          </div>

          <div className="text-start sm:text-end">
            <p className="text-sm text-muted">{t("orderTotal")}</p>
            <p className="text-2xl font-black">{formatMoney(order.total, locale)}</p>
          </div>
        </div>

        <OrderProgress status={order.status} locale={locale} t={t} />

        <div className="grid gap-3">
          {visibleProducts.map(({ product, quantity }) =>
            product ? (
              <div key={product.id} className="grid grid-cols-[72px_1fr_auto] items-center gap-3 rounded-[14px] bg-[var(--soft)] p-3">
                <Image
                  src={product.image}
                  width={72}
                  height={72}
                  alt={localizedName(product, locale)}
                  className="aspect-square rounded-[10px] bg-[var(--card)] object-cover"
                  unoptimized={product.image.includes(".svg")}
                />
                <div className="min-w-0">
                  <p className="truncate font-bold">{localizedName(product, locale)}</p>
                  <p className="text-sm text-muted">
                    {cartText("quantity")}: {quantity}
                  </p>
                </div>
                <strong className="text-sm">{formatMoney(product.price * quantity, locale)}</strong>
              </div>
            ) : null,
          )}
        </div>

        {isExpanded ? (
          <div className="grid gap-4 rounded-[16px] border border-[var(--border)] p-4 sm:grid-cols-2">
            <div>
              <p className="flex items-center gap-2 font-black">
                <MapPin size={18} />
                {t("deliveryAddress")}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted">
                {order.address.name}
                <br />
                {order.address.phone}
                <br />
                {order.address.address}, {order.address.city}, {order.address.governorate}
              </p>
            </div>
            <div>
              <p className="flex items-center gap-2 font-black">
                <ReceiptText size={18} />
                {t("tracking")}
              </p>
              <div className="mt-2 grid gap-2 text-sm">
                <div className="flex justify-between gap-3">
                  <span className="text-muted">{t("trackingNumber")}</span>
                  <strong>{order.trackingNumber}</strong>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-muted">{cartText("subtotal")}</span>
                  <strong>{formatMoney(order.subtotal, locale)}</strong>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-muted">{t("shippingFee")}</span>
                  <strong>{formatMoney(order.shippingFee, locale)}</strong>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] pt-4">
          <button className="btn-secondary inline-flex items-center gap-2" type="button" onClick={onToggle}>
            <ChevronDown className={isExpanded ? "rotate-180 transition" : "transition"} size={18} />
            {isExpanded ? t("hideDetails") : t("viewDetails")}
          </button>
          <div className="flex flex-wrap gap-2">
            <Link className="btn-secondary inline-flex items-center gap-2" href="/PLP">
              <ShoppingBag size={18} />
              {t("browseProducts")}
            </Link>
            <button className="btn-primary inline-flex items-center gap-2" type="button" onClick={onBuyAgain}>
              <RotateCcw size={18} />
              {t("buyAgain")}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export function MyOrdersClient() {
  const locale = useLocale() as Locale;
  const site = useTranslations("site");
  const t = useTranslations("accountPage");
  const cartText = useTranslations("cart");
  const user = useShopStore((state) => state.user);
  const orders = useShopStore((state) => state.orders);
  const addToCart = useShopStore((state) => state.addToCart);
  const [activeStatus, setActiveStatus] = useState<OrderStatus | "all">("all");
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const filteredOrders = useMemo(
    () => (activeStatus === "all" ? orders : orders.filter((order) => order.status === activeStatus)),
    [activeStatus, orders],
  );

  if (!user) {
    return (
      <section className="container-page py-16 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[var(--soft)]">
          <Package className="h-8 w-8" />
        </div>
        <h1 className="mt-5 text-4xl font-black">{t("myOrders")}</h1>
        <p className="mx-auto mt-3 max-w-md text-muted">{t("signInOrders")}</p>
        <Link className="btn-primary mt-8" href="/LOGIN">
          {site("login")}
        </Link>
      </section>
    );
  }

  return (
    <section className="container-page py-8 sm:py-12">
      <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted">
        <Link className="transition hover:text-[var(--fg)]" href="/home">
          {site("home")}
        </Link>
        <span aria-hidden="true">/</span>
        <Link className="transition hover:text-[var(--fg)]" href="/ACCOUNT">
          {site("account")}
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-[var(--fg)]">{t("myOrders")}</span>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-muted">{t("ordersCopy")}</p>
          <h1 className="shop-heading">{t("myOrders")}</h1>
        </div>
        <div className="grid min-w-32 place-items-center rounded-[18px] border border-[var(--border)] bg-[var(--card)] px-5 py-4">
          <span className="text-3xl font-black">{orders.length}</span>
          <span className="text-xs font-bold text-muted">{t("ordersCount")}</span>
        </div>
      </div>

      <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
        {statusFilters.map((status) => (
          <button
            key={status}
            type="button"
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition ${
              activeStatus === status
                ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                : "border-[var(--border)] bg-[var(--card)] text-[var(--fg)] hover:border-black"
            }`}
            onClick={() => setActiveStatus(status)}
          >
            {status === "all" ? t("allOrders") : t(statusTranslationKey(status))}
          </button>
        ))}
      </div>

      {filteredOrders.length ? (
        <div className="mt-6 grid gap-5">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              locale={locale}
              isExpanded={expandedOrderId === order.id}
              onToggle={() => setExpandedOrderId((current) => (current === order.id ? null : order.id))}
              onBuyAgain={() => {
                order.lines.forEach((line) => addToCart(line.productId, line.quantity));
              }}
            />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-[20px] border border-dashed border-[var(--border)] bg-[var(--card)] p-8 text-center">
          <PackageOpen className="mx-auto h-12 w-12 text-muted" />
          <h2 className="mt-4 text-2xl font-black">{orders.length ? t("noFilteredOrders") : t("noOrders")}</h2>
          <p className="mx-auto mt-2 max-w-md text-muted">
            {orders.length ? t("noFilteredOrdersCopy") : t("noOrdersCopy")}
          </p>
          <Link className="btn-primary mt-6 inline-flex items-center gap-2" href="/PLP">
            <ShoppingBag size={18} />
            {cartText("continue")}
          </Link>
        </div>
      )}

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {[
          [Clock3, t("ordersHelpFast")],
          [Truck, t("ordersHelpDelivery")],
          [CheckCircle2, t("ordersHelpReturns")],
        ].map(([Icon, copy]) => {
          const HelpIcon = Icon as typeof Clock3;
          return (
            <div key={copy as string} className="card flex items-center gap-3 p-4 text-sm font-bold">
              <HelpIcon size={20} className="text-muted" />
              <span>{copy as string}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
