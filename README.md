# News Article Management API

A REST API built with **Express.js**, **Prisma ORM**, and **Multer** to manage news articles for an online media platform.
This project implements **Layered Architecture** (Routes → Controllers → Services → Repositories → Database).

The API allows companies to:

- Create news articles
- Upload thumbnail images
- Edit articles
- Publish articles
- Delete articles
- Search articles
- View published articles

---

# Tech Stack

- Node.js
- Express.js
- Prisma ORM
- SQLite Database
- Multer (file upload)
- bcrypt (hash password)
- JWT (login token)
- express-rate-limit (rate limiting)

---

# Project Setup

## 1. Clone Repository

```bash
git clone https://github.com/Richardryanp/Aksub-Week2-3.git
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Setup Environment Variables

Create `.env` file:

```env
DATABASE_URL="file:./dev.db"
PORT=3000
JWT_SECRET="dev-secret-key"
```

---

## 4. Initialize Database

Run Prisma migration to create the database:

```bash
npx prisma migrate dev --name init
```

---

## 5. Seed Initial Data

This will insert **5 sample articles** into the database.

```bash
node prisma/seed.js
```

---

## 6. Run the Server

```bash
node server.js
```

or if using nodemon:

```bash
npx nodemon server.js
```

Server will run at:

```
http://localhost:3000
```

---

# Folder Structure

```
news-api
│
├── prisma
│   ├── schema.prisma
│   └── seed.js
│
├── src
│   ├── config
│   ├── controllers
│   ├── services
│   ├── repositories
│   ├── routes
│   ├── middlewares
│   └── app.js
│
├── uploads
├── server.js
├── package.json
└── .env
```

---

# API Endpoints

All endpoints are prefixed with:

```
/api
```

---

# 1. Get Published Articles

Return all articles where `published = true`.

### Endpoint

```
GET /api/articles
```

### Example Request

```
GET http://localhost:3000/api/articles
```

### Response

```json
[
  {
    "id": 1,
    "title": "AI Revolution in 2026",
    "content": "Artificial intelligence continues to transform industries...",
    "author": "John Doe",
    "thumbnail": "/uploads/ai.jpg",
    "published": true
  }
]
```

---

# 2. Create Article

Create a new article.
Articles are **unpublished by default** (`published = false`).
Only authenticated users with role `writer` or `admin` can create articles.

### Endpoint

```
POST /api/articles
```

### Auth Header

```
Authorization: Bearer <JWT_TOKEN>
```

### Body (form-data)

| Field     | Type   |
| --------- | ------ |
| title     | string |
| content   | text   |
| author    | string |
| thumbnail | file   |

### Example

```
POST /api/articles
```

Body:

```json
{
  "title": "AI in Healthcare",
  "content": "Artificial intelligence is transforming healthcare...",
  "author": "Richard"
}
```

Upload thumbnail using **form-data**.
Send the image file in the `thumbnail` field.

---

# 3. Update Article

Update article information.

### Endpoint

```
PATCH /api/articles/:id
```

Example:

```
PATCH /api/articles/2
```

Only authenticated users with role `writer` or `admin` can update.
`thumbnail` is optional for update (if you don't send it, the old thumbnail is kept).

Body:

```json
{
  "title": "Updated News Title",
  "content": "Updated article content...",
  "author": "Editor"
}
```

If you want to replace the thumbnail, send `thumbnail` in **form-data**.

---

# 4. Delete Article

Remove an article from the database.
Only authenticated users with role `writer`, `editor`, or `admin` can delete.

### Endpoint

```
DELETE /api/articles/:id
```

Example:

```
DELETE /api/articles/3
```

Response:

```json
{
  "message": "Article deleted"
}
```

---

# 5. Publish Article

Change `published` status from **false → true**.
Only authenticated users with role `editor` can publish.
No request body is required.

### Endpoint

```
PATCH /api/articles/:id/publish
```

Example:

```
PATCH /api/articles/2/publish
```

Response:

```json
{
  "id": 2,
  "title": "Technology Trends",
  "published": true
}
```

---

# 6. Search Article

Search articles by title.
Search returns only articles with `published = true`.

### Endpoint

```
GET /api/articles/search?title=AI
```

Example:

```
GET /api/articles/search?title=technology
```

Response:

```json
[
  {
    "id": 1,
    "title": "AI Revolution in 2026",
    "author": "John Doe"
  }
]
```

---

# Auth & Authorization (Week 3)

# 7. Register (Reader)

Create a new user account. The created user will always have role `reader`.
Rate limit: **max 5 requests per minute per IP**.

### Endpoint

```
POST /api/auth/register
```

### Body (JSON)

```json
{
  "name": "User Reader",
  "email": "reader1@example.com",
  "password": "Password1",
  "dateOfBirth": "2001-05-10"
}
```

---

# 8. Login

Login using email + password. Returns a JWT token.
Rate limit: **max 5 requests per minute per IP**.

### Endpoint

```
POST /api/auth/login
```

### Body (JSON)

```json
{
  "email": "reader1@example.com",
  "password": "Password1"
}
```

### Response

```json
{
  "token": "<JWT_TOKEN>",
  "user": {
    "id": 1,
    "name": "User Reader",
    "email": "reader1@example.com",
    "role": "reader"
  }
}
```

---

# 9. Assign Role to User (Admin)

Admin can change a user role to `writer` or `editor` (based on email).

### Endpoint

```
POST /api/auth/assign-role
```

### Auth Header

```
Authorization: Bearer <JWT_TOKEN>
```

### Body (JSON)

```json
{
  "email": "reader1@example.com",
  "role": "writer"
}
```

---

# File Upload

Uploaded thumbnails are stored in:

```
uploads/
```

The local file path is saved in the database (`thumbnail`), and the files are served statically at:

```
/uploads/<filename>
```

Example:

```
/uploads/17012312312.jpg
```

---

# Seeder Data

The project includes **5 seeded articles** with different `published` values.
The seeder also creates an **admin** account directly in the database for Week 3 authentication.

Some are:

- Published articles
- Unpublished articles

---

# Running Prisma Studio (Optional)

To view the database:

```bash
npx prisma studio
```

Open:

```
http://localhost:5555
```

---
