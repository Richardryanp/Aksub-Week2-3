import { z } from "zod";

export const assignRoleSchema = z.object({
  body: z.object({
    email: z.string().trim().email().toLowerCase(),
    role: z.literal("organizer").optional().default("organizer"),
  }),
});
