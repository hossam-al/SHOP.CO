import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AuthForm } from "@/components/forms/AuthForm";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const site = await getTranslations({ locale, namespace: "site" });
  return buildMetadata({ locale, path: "/signup", title: `${site("signup")} | ${site("name")}`, description: site("description") });
}

export default async function SignupPage() {
  const site = await getTranslations("site");
  return (
    <section className="container-page py-12">
      <h1 className="mb-8 text-center text-4xl font-black">{site("signup")}</h1>
      <AuthForm mode="signup" />
    </section>
  );
}
