"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { contactSchema } from "@/lib/validation";

export function ContactForm() {
  const f = useTranslations("forms");
  const [sent, setSent] = useState(false);
  const schema = useMemo(
    () => contactSchema({ required: f("required"), emailInvalid: f("emailInvalid") }),
    [f],
  );
  type ContactValues = z.infer<typeof schema>;
  const form = useForm<ContactValues>({ resolver: zodResolver(schema), mode: "onBlur" });

  return (
    <form
      className="card mx-auto grid max-w-2xl gap-4 p-6"
      onSubmit={form.handleSubmit(() => {
        setSent(true);
        form.reset();
      })}
    >
      {(["name", "email", "message"] as const).map((field) => (
        <label key={field} className="grid gap-2 font-bold">
          {f(field)}
          {field === "message" ? (
            <textarea className="field min-h-36" {...form.register(field)} />
          ) : (
            <input className="field" type={field === "email" ? "email" : "text"} {...form.register(field)} />
          )}
          <span className="min-h-5 text-sm text-red-600">{form.formState.errors[field]?.message}</span>
        </label>
      ))}
      <button className="btn-primary w-fit" type="submit">{f("send")}</button>
      <p aria-live="polite" className="text-green-700">{sent ? f("sent") : ""}</p>
    </form>
  );
}
