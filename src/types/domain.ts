export const roles = ["organizer", "attendee", "admin"] as const;
export type Role = (typeof roles)[number];

export const eventCategories = [
  "conference",
  "workshop",
  "seminar",
  "concert",
  "sport",
  "charity",
  "curtural",
] as const;
export type EventCategory = (typeof eventCategories)[number];
