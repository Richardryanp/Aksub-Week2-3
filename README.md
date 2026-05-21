# Evently API

REST API untuk platform manajemen event bernama **Evently**. Project ini dibuat dengan TypeScript, Express, Prisma, Zod, JWT, bcrypt, dan Jest.

## Tech Stack

- TypeScript
- Express.js
- Prisma ORM
- SQLite
- Zod
- JWT
- bcrypt
- Jest + Supertest
- dotenv
- nodemon

## Setup

```bash
npm install
```

Buat file `.env`:

```env
DATABASE_URL="file:./dev.db"
PORT=3000
JWT_SECRET="dev-secret-key"
```

Generate Prisma Client dan sinkronkan database:

```bash
npx prisma generate
npx prisma db push
```

Seed akun admin:

```bash
npm run seed
```

Akun admin:

```txt
Email: admin@evently.com
Password: Admin123
Role: admin
```

Jalankan development server:

```bash
npm run dev
```

Build dan test:

```bash
npm run build
npm test
```

## Endpoint

### Auth

```txt
POST /auth/register
POST /auth/login
```

Register otomatis membuat user dengan role `attendee`.

### Public Events

```txt
GET /events
GET /events/:id
```

`GET /events` hanya mengembalikan event dengan `isPublished = true`.

### Organizer Events

```txt
POST /events
PUT /events/:id
DELETE /events/:id
PATCH /events/:id/publish
```

Endpoint organizer membutuhkan header:

```txt
Authorization: Bearer <JWT_TOKEN>
```

Organizer hanya dapat mengedit, menghapus, dan publish event miliknya sendiri.

### Admin

```txt
GET /admin/events
PUT /admin/events/:id
DELETE /admin/events/:id
GET /admin/users
PATCH /admin/users/role
```

Admin dapat melihat semua event termasuk unpublished, mengelola event milik siapa pun, melihat semua user, dan mengubah role user menjadi `organizer` berdasarkan email.

Body untuk assign role:

```json
{
  "email": "user@example.com"
}
```

## Event Body

```json
{
  "title": "TypeScript Workshop",
  "description": "A practical workshop for building robust APIs.",
  "location": "Jakarta",
  "date": "2099-01-01",
  "price": 100000,
  "maxAttendees": 50,
  "category": "workshop"
}
```

Kategori yang valid:

```txt
conference, workshop, seminar, concert, sport, charity, curtural
```

## Struktur

```txt
prisma/
  schema.prisma
  seed.ts
src/
  app.ts
  server.ts
  config/
  controllers/
  middlewares/
  routes/
  schemas/
  services/
  types/
  utils/
tests/
  evently.test.ts
  setupEnv.ts
```
