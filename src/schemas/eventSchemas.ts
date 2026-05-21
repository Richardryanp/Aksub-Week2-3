import { z } from "zod";
import { idParamSchema } from "./commonSchemas";
import { eventCategories } from "../types/domain";

const today = () => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
};

const eventBody = z.object({
  title: z.string().trim().min(5).max(150),
  description: z.string().trim().min(20),
  location: z.string().trim().min(1),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must use YYYY-MM-DD format")
    .refine((value) => !Number.isNaN(new Date(`${value}T00:00:00.000Z`).getTime()), {
      message: "Date must be valid",
    })
    .refine((value) => new Date(`${value}T00:00:00.000Z`) >= today(), {
      message: "Date cannot be in the past",
    }),
  price: z.coerce.number().min(0),
  maxAttendees: z.coerce.number().int().min(1),
  category: z.enum(eventCategories),
});

export const createEventSchema = z.object({
  body: eventBody,
});

export const updateEventSchema = z.object({
  ...idParamSchema.shape,
  body: eventBody.partial().refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  }),
});

export const eventIdParamSchema = idParamSchema;
