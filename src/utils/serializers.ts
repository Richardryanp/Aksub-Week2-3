import { Event, User } from "@prisma/client";

export const toUserResponse = (user: User) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const toEventResponse = (event: Event) => ({
  ...event,
  date: event.date.toISOString().slice(0, 10),
});
