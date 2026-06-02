import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";

export default async function NotFound() {
  const t = await getTranslations("pages");

  return (
    <section className="container-page py-20 text-center">
      <p className="text-muted">404</p>
      <h1 className="mt-3 text-4xl font-bold">{t("notFoundTitle")}</h1>
      <p className="mx-auto mt-4 max-w-xl text-muted">{t("notFoundCopy")}</p>
      <Link className="btn-primary mt-8" href="/">
        {t("goHome")}
      </Link>
    </section>
  );
}
