import { Prisma } from "@prisma/client";
import prisma from "../config/prisma";
import { HttpError } from "../utils/httpError";
import { toEventResponse } from "../utils/serializers";
import { EventCategory } from "../types/domain";

type EventInput = {
  title: string;
  description: string;
  location: string;
  date: string;
  price: number;
  maxAttendees: number;
  category: EventCategory;
};

const toEventData = (input: Partial<EventInput>) => ({
  ...input,
  date: input.date ? new Date(`${input.date}T00:00:00.000Z`) : undefined,
});

export const getPublishedEvents = async () => {
  const events = await prisma.event.findMany({
    where: { isPublished: true },
    orderBy: { date: "asc" },
  });

  return events.map(toEventResponse);
};

export const getEventById = async (id: number) => {
  const event = await prisma.event.findUnique({ where: { id } });

  if (!event) {
    throw new HttpError(404, "Event not found");
  }

  return toEventResponse(event);
};

export const createEvent = async (organizerId: number, input: EventInput) => {
  const event = await prisma.event.create({
    data: {
      ...toEventData(input),
      isPublished: false,
      organizer: { connect: { id: organizerId } },
    } as Prisma.EventCreateInput,
  });

  return toEventResponse(event);
};

export const updateOwnedEvent = async (id: number, organizerId: number, input: Partial<EventInput>) => {
  const event = await prisma.event.findUnique({ where: { id } });

  if (!event) {
    throw new HttpError(404, "Event not found");
  }

  if (event.organizerId !== organizerId) {
    throw new HttpError(403, "You can only edit your own event");
  }

  const updated = await prisma.event.update({
    where: { id },
    data: toEventData(input),
  });

  return toEventResponse(updated);
};

export const deleteOwnedEvent = async (id: number, organizerId: number) => {
  const event = await prisma.event.findUnique({ where: { id } });

  if (!event) {
    throw new HttpError(404, "Event not found");
  }

  if (event.organizerId !== organizerId) {
    throw new HttpError(403, "You can only delete your own event");
  }

  await prisma.event.delete({ where: { id } });
  return { message: "Event deleted successfully" };
};

export const publishOwnedEvent = async (id: number, organizerId: number) => {
  const event = await prisma.event.findUnique({ where: { id } });

  if (!event) {
    throw new HttpError(404, "Event not found");
  }

  if (event.organizerId !== organizerId) {
    throw new HttpError(403, "You can only publish your own event");
  }

  const updated = await prisma.event.update({
    where: { id },
    data: { isPublished: true },
  });

  return toEventResponse(updated);
};
