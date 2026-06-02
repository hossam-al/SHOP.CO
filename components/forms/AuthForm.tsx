"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Link, useRouter } from "@/i18n/routing";
import { authSchema } from "@/schemas/validation";
import { useShopStore } from "@/store/use-shop-store";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const f = useTranslations("forms");
  const site = useTranslations("site");
  const router = useRouter();
  const login = useShopStore((state) => state.login);
  const [message, setMessage] = useState("");
  const schema = useMemo(
    () => authSchema({
      required: f("required"),
      emailInvalid: f("emailInvalid"),
      passwordMin: f("passwordMin"),
      phoneInvalid: f("phoneInvalid"),
    }, mode),
    [f, mode],
  );
  type AuthValues = z.infer<typeof schema>;
  const form = useForm<AuthValues>({ resolver: zodResolver(schema), mode: "onBlur" });

  function submit(values: AuthValues) {
    login({ name: values.name || values.email.split("@")[0], email: values.email });
    setMessage(mode === "signup" ? f("signupSuccess") : f("loginSuccess"));
    setTimeout(() => router.push("/"), 500);
  }

  return (
    <form className="card mx-auto grid max-w-lg gap-4 p-6" onSubmit={form.handleSubmit(submit)}>
      {mode === "signup" ? (
        <label className="grid gap-2 font-bold">
          {f("name")}
          <input className="field" {...form.register("name")} />
          <span className="min-h-5 text-sm text-red-600">{form.formState.errors.name?.message}</span>
        </label>
      ) : null}
      <label className="grid gap-2 font-bold">
        {f("email")}
        <input className="field" type="email" {...form.register("email")} />
        <span className="min-h-5 text-sm text-red-600">{form.formState.errors.email?.message}</span>
      </label>
      <label className="grid gap-2 font-bold">
        {f("password")}
        <input className="field" type="password" {...form.register("password")} />
        <span className="min-h-5 text-sm text-red-600">{form.formState.errors.password?.message}</span>
      </label>
      <button className="btn-primary" type="submit">
        {mode === "signup" ? site("signup") : site("login")}
      </button>
      <p aria-live="polite" className="text-center text-green-700">{message}</p>
      <Link className="text-center font-bold text-[var(--accent)]" href={mode === "signup" ? "/login" : "/signup"}>
        {mode === "signup" ? site("login") : site("signup")}
      </Link>
    </form>
  );
}
