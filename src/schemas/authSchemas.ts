import { z } from "zod";

const strongPassword = z
  .string()
  .min(8)
  .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
  .regex(/[0-9]/, "Password must contain at least 1 number");

export const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(3).max(100),
    email: z.string().trim().email().toLowerCase(),
    password: strongPassword,
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email().toLowerCase(),
    password: z.string().min(1),
  }),
});
