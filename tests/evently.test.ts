import { execSync } from "child_process";
import { closeSync, existsSync, openSync, unlinkSync } from "fs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import request from "supertest";
import app from "../src/app";
import prisma from "../src/config/prisma";
import { User } from "@prisma/client";
import { EventCategory, Role } from "../src/types/domain";

const futureDate = "2099-01-01";

const validEvent = {
  title: "TypeScript Workshop",
  description: "A practical workshop for building robust APIs.",
  location: "Jakarta",
  date: futureDate,
  price: 100000,
  maxAttendees: 50,
  category: "workshop" as EventCategory,
};

const tokenFor = (user: Pick<User, "id" | "email" | "role">) =>
  jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET || "test-secret-key",
  );

const createUser = async (role: Role, email = `${role}-${Date.now()}@example.com`) => {
  const password = await bcrypt.hash("Password1", 10);

  return prisma.user.create({
    data: {
      name: `${role} user`,
      email,
      password,
      role,
    },
  });
};

const createEvent = async (organizerId: number, overrides = {}) =>
  prisma.event.create({
    data: {
      ...validEvent,
      date: new Date(`${futureDate}T00:00:00.000Z`),
      organizerId,
      ...overrides,
    },
  });

beforeAll(async () => {
  closeSync(openSync("prisma/test.db", "a"));
  execSync("npx prisma db push --force-reset --skip-generate", {
    stdio: "ignore",
    env: { ...process.env, DATABASE_URL: "file:./test.db" },
  });
});

beforeEach(async () => {
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
  if (existsSync("prisma/test.db")) {
    unlinkSync("prisma/test.db");
  }
});

describe("Auth endpoints", () => {
  it("POST /auth/register returns 201 for valid data", async () => {
    const response = await request(app).post("/auth/register").send({
      name: "Aldi Nugraha",
      email: "aldi@example.com",
      password: "Password1",
    });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      name: "Aldi Nugraha",
      email: "aldi@example.com",
      role: "attendee",
    });
    expect(response.body.password).toBeUndefined();
  });

  it("POST /auth/register returns 409 when email already exists", async () => {
    await createUser("attendee", "taken@example.com");

    const response = await request(app).post("/auth/register").send({
      name: "Taken User",
      email: "taken@example.com",
      password: "Password1",
    });

    expect(response.status).toBe(409);
  });

  it("POST /auth/register returns 400 for weak password", async () => {
    const response = await request(app).post("/auth/register").send({
      name: "Weak User",
      email: "weak@example.com",
      password: "password",
    });

    expect(response.status).toBe(400);
  });

  it("POST /auth/login returns 200 and token for valid credentials", async () => {
    await createUser("attendee", "login@example.com");

    const response = await request(app).post("/auth/login").send({
      email: "login@example.com",
      password: "Password1",
    });

    expect(response.status).toBe(200);
    expect(response.body.token).toEqual(expect.any(String));
  });

  it("POST /auth/login returns 401 for wrong password", async () => {
    await createUser("attendee", "wrong-pass@example.com");

    const response = await request(app).post("/auth/login").send({
      email: "wrong-pass@example.com",
      password: "WrongPassword1",
    });

    expect(response.status).toBe(401);
  });

  it("POST /auth/login returns 401 for unknown email", async () => {
    const response = await request(app).post("/auth/login").send({
      email: "missing@example.com",
      password: "Password1",
    });

    expect(response.status).toBe(401);
  });
});

describe("Event endpoints", () => {
  it("GET /events returns published events only", async () => {
    const organizer = await createUser("organizer");
    await createEvent(organizer.id, { title: "Published Event", isPublished: true });
    await createEvent(organizer.id, { title: "Hidden Event", isPublished: false });

    const response = await request(app).get("/events");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].title).toBe("Published Event");
  });

  it("GET /events/:id returns event detail", async () => {
    const organizer = await createUser("organizer");
    const event = await createEvent(organizer.id, { isPublished: true });

    const response = await request(app).get(`/events/${event.id}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(event.id);
  });

  it("GET /events/:id returns 404 when event does not exist", async () => {
    const response = await request(app).get("/events/999");

    expect(response.status).toBe(404);
  });

  it("POST /events allows organizer to create event", async () => {
    const organizer = await createUser("organizer");

    const response = await request(app)
      .post("/events")
      .set("Authorization", `Bearer ${tokenFor(organizer)}`)
      .send(validEvent);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({ title: validEvent.title, isPublished: false });
  });

  it("POST /events returns 401 without JWT token", async () => {
    const response = await request(app).post("/events").send(validEvent);

    expect(response.status).toBe(401);
  });

  it("POST /events returns 403 when role is not organizer", async () => {
    const attendee = await createUser("attendee");

    const response = await request(app)
      .post("/events")
      .set("Authorization", `Bearer ${tokenFor(attendee)}`)
      .send(validEvent);

    expect(response.status).toBe(403);
  });

  it("POST /events returns 400 for past date", async () => {
    const organizer = await createUser("organizer");

    const response = await request(app)
      .post("/events")
      .set("Authorization", `Bearer ${tokenFor(organizer)}`)
      .send({ ...validEvent, date: "2000-01-01" });

    expect(response.status).toBe(400);
  });

  it("PUT /events/:id allows organizer to edit own event", async () => {
    const organizer = await createUser("organizer");
    const event = await createEvent(organizer.id);

    const response = await request(app)
      .put(`/events/${event.id}`)
      .set("Authorization", `Bearer ${tokenFor(organizer)}`)
      .send({ title: "Updated Workshop" });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe("Updated Workshop");
  });

  it("PUT /events/:id returns 403 for another organizer's event", async () => {
    const owner = await createUser("organizer", "owner@example.com");
    const other = await createUser("organizer", "other@example.com");
    const event = await createEvent(owner.id);

    const response = await request(app)
      .put(`/events/${event.id}`)
      .set("Authorization", `Bearer ${tokenFor(other)}`)
      .send({ title: "Unauthorized Update" });

    expect(response.status).toBe(403);
  });

  it("DELETE /events/:id allows organizer to delete own event", async () => {
    const organizer = await createUser("organizer");
    const event = await createEvent(organizer.id);

    const response = await request(app)
      .delete(`/events/${event.id}`)
      .set("Authorization", `Bearer ${tokenFor(organizer)}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toContain("deleted");
  });

  it("DELETE /events/:id returns 404 when event does not exist", async () => {
    const organizer = await createUser("organizer");

    const response = await request(app)
      .delete("/events/999")
      .set("Authorization", `Bearer ${tokenFor(organizer)}`);

    expect(response.status).toBe(404);
  });

  it("PATCH /events/:id/publish publishes organizer's event", async () => {
    const organizer = await createUser("organizer");
    const event = await createEvent(organizer.id, { isPublished: false });

    const response = await request(app)
      .patch(`/events/${event.id}/publish`)
      .set("Authorization", `Bearer ${tokenFor(organizer)}`);

    expect(response.status).toBe(200);
    expect(response.body.isPublished).toBe(true);
  });

  it("PATCH /events/:id/publish returns 401 without JWT token", async () => {
    const response = await request(app).patch("/events/1/publish");

    expect(response.status).toBe(401);
  });
});

describe("Admin endpoints", () => {
  it("GET /admin/events allows admin to see all events", async () => {
    const admin = await createUser("admin");
    const organizer = await createUser("organizer");
    await createEvent(organizer.id, { isPublished: true });
    await createEvent(organizer.id, { isPublished: false });

    const response = await request(app)
      .get("/admin/events")
      .set("Authorization", `Bearer ${tokenFor(admin)}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
  });

  it("GET /admin/events returns 403 for non-admin", async () => {
    const attendee = await createUser("attendee");

    const response = await request(app)
      .get("/admin/events")
      .set("Authorization", `Bearer ${tokenFor(attendee)}`);

    expect(response.status).toBe(403);
  });

  it("PUT /admin/events/:id allows admin to edit any event", async () => {
    const admin = await createUser("admin");
    const organizer = await createUser("organizer");
    const event = await createEvent(organizer.id);

    const response = await request(app)
      .put(`/admin/events/${event.id}`)
      .set("Authorization", `Bearer ${tokenFor(admin)}`)
      .send({ location: "Bandung" });

    expect(response.status).toBe(200);
    expect(response.body.location).toBe("Bandung");
  });

  it("DELETE /admin/events/:id allows admin to delete any event", async () => {
    const admin = await createUser("admin");
    const organizer = await createUser("organizer");
    const event = await createEvent(organizer.id);

    const response = await request(app)
      .delete(`/admin/events/${event.id}`)
      .set("Authorization", `Bearer ${tokenFor(admin)}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toContain("deleted");
  });

  it("DELETE /admin/events/:id returns 403 for non-admin", async () => {
    const attendee = await createUser("attendee");

    const response = await request(app)
      .delete("/admin/events/1")
      .set("Authorization", `Bearer ${tokenFor(attendee)}`);

    expect(response.status).toBe(403);
  });

  it("GET /admin/users allows admin to see all users", async () => {
    const admin = await createUser("admin");
    await createUser("attendee");

    const response = await request(app)
      .get("/admin/users")
      .set("Authorization", `Bearer ${tokenFor(admin)}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0].password).toBeUndefined();
  });

  it("GET /admin/users returns 403 for non-admin", async () => {
    const attendee = await createUser("attendee");

    const response = await request(app)
      .get("/admin/users")
      .set("Authorization", `Bearer ${tokenFor(attendee)}`);

    expect(response.status).toBe(403);
  });

  it("PATCH /admin/users/role changes a user role to organizer", async () => {
    const admin = await createUser("admin", "admin@example.com");
    await createUser("attendee", "future-organizer@example.com");

    const response = await request(app)
      .patch("/admin/users/role")
      .set("Authorization", `Bearer ${tokenFor(admin)}`)
      .send({ email: "future-organizer@example.com" });

    expect(response.status).toBe(200);
    expect(response.body.role).toBe("organizer");
  });

  it("PATCH /admin/users/role returns 404 when email is missing", async () => {
    const admin = await createUser("admin");

    const response = await request(app)
      .patch("/admin/users/role")
      .set("Authorization", `Bearer ${tokenFor(admin)}`)
      .send({ email: "missing@example.com" });

    expect(response.status).toBe(404);
  });
});
