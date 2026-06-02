import { z } from "zod";

export type ValidationMessages = {
  required: string;
  emailInvalid: string;
  passwordMin: string;
  phoneInvalid: string;
};

export function shippingSchema(messages: ValidationMessages) {
  return z.object({
    name: z.string().min(2, messages.required),
    email: z.string().email(messages.emailInvalid),
    address: z.string().min(4, messages.required),
    city: z.string().min(2, messages.required),
    phone: z.string().regex(/^[0-9+\-\s()]{7,20}$/, messages.phoneInvalid),
  });
}

export function authSchema(messages: ValidationMessages, mode: "login" | "signup") {
  return z.object({
    name: mode === "signup" ? z.string().min(2, messages.required) : z.string().optional(),
    email: z.string().email(messages.emailInvalid),
    password: z.string().min(8, messages.passwordMin),
  });
}

export function contactSchema(messages: Pick<ValidationMessages, "required" | "emailInvalid">) {
  return z.object({
    name: z.string().min(2, messages.required),
    email: z.string().email(messages.emailInvalid),
    message: z.string().min(8, messages.required),
  });
}
