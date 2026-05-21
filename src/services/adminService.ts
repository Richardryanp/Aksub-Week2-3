import prisma from "../config/prisma";
import { HttpError } from "../utils/httpError";
import { toEventResponse, toUserResponse } from "../utils/serializers";
import { EventCategory } from "../types/domain";

type AdminEventInput = {
  title?: string;
  description?: string;
  location?: string;
  date?: string;
  price?: number;
  maxAttendees?: number;
  category?: EventCategory;
};

const toEventData = (input: AdminEventInput) => ({
  ...input,
  date: input.date ? new Date(`${input.date}T00:00:00.000Z`) : undefined,
});

export const getAllEvents = async () => {
  const events = await prisma.event.findMany({ orderBy: { createdAt: "desc" } });
  return events.map(toEventResponse);
};

export const updateAnyEvent = async (id: number, input: AdminEventInput) => {
  const event = await prisma.event.findUnique({ where: { id } });

  if (!event) {
    throw new HttpError(404, "Event not found");
  }

  const updated = await prisma.event.update({
    where: { id },
    data: toEventData(input),
  });

  return toEventResponse(updated);
};

export const deleteAnyEvent = async (id: number) => {
  const event = await prisma.event.findUnique({ where: { id } });

  if (!event) {
    throw new HttpError(404, "Event not found");
  }

  await prisma.event.delete({ where: { id } });
  return { message: "Event deleted successfully" };
};

export const getAllUsers = async () => {
  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });
  return users.map(toUserResponse);
};

export const assignOrganizerRole = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new HttpError(404, "User not found");
  }

  const updated = await prisma.user.update({
    where: { email },
    data: { role: "organizer" },
  });

  return toUserResponse(updated);
};
