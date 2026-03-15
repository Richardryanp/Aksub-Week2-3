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

---

# Project Setup

## 1. Clone Repository

```bash
git clone https://github.com/your-username/news-article-api.git
cd news-article-api
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
│   ├── controllers
│   ├── services
│   ├── repositories
│   ├── routes
│   ├── middleware
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
Articles are **unpublished by default**.

### Endpoint

```
POST /api/articles
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

---

# 3. Update Article

Update article information.

### Endpoint

```
PUT /api/articles/:id
```

Example:

```
PUT /api/articles/2
```

Body:

```json
{
  "title": "Updated News Title",
  "content": "Updated article content...",
  "author": "Editor"
}
```

Thumbnail can also be updated.

---

# 4. Delete Article

Remove an article from the database.

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

# File Upload

Uploaded thumbnails are stored in:

```
/uploads
```

The file path is saved in the database.

Example:

```
/uploads/17012312312.jpg
```

---

# Seeder Data

The project includes **5 seeded articles** with different `published` values.

Some are:

-  Published articles
- Unpublished articles

This allows testing of:

- Publish feature
- Article filtering

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
