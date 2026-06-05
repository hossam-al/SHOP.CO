import { z } from "zod";

export type ValidationMessages = {
  required: string;
  emailInvalid: string;
  passwordMin: string;
  phoneInvalid: string;
};

export function shippingSchema(messages: ValidationMessages, options?: { emailOptional?: boolean }) {
  const email = options?.emailOptional
    ? z.union([z.string().email(messages.emailInvalid), z.literal("")]).optional()
    : z.string().email(messages.emailInvalid);

  return z.object({
    name: z.string().min(2, messages.required),
    email,
    governorate: z.string().min(2, messages.required),
    city: z.string().min(2, messages.required),
    address: z.string().min(4, messages.required),
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
