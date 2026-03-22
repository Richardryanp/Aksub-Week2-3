// Import express biar bisa bikin router
const express = require("express")
const router = express.Router()

// Import controller buat handle logic tiap route
const controller = require("../controllers/articleController")
// Import middleware upload buat handle upload file
const upload = require("../middlewares/upload")
// Import middleware auth dan role-based authorization
const { authRequired, authorizeRoles } = require("../middlewares/authMiddleware")

// Route buat ambil semua artikel yang published
router.get("/articles",controller.getArticles)

// Route buat cari artikel berdasarkan judul
router.get("/articles/search",controller.searchArticle)

// Route buat bikin artikel baru, bisa upload thumbnail (Writer, Admin)
router.post(
  "/articles",
  authRequired, // wajib autentikasi dulu
  authorizeRoles("writer", "admin"), // cuman writer admin yg bole
  upload.single("thumbnail"),
  controller.createArticle
)

// Route buat update artikel, bisa upload thumbnail baru (Writer, Admin)
router.patch(
  "/articles/:id",
  authRequired,
  authorizeRoles("writer", "admin"),
  upload.single("thumbnail"),
  controller.updateArticle
)

// Route buat hapus artikel (Writer, Editor, Admin)
router.delete(
  "/articles/:id",
  authRequired,
  authorizeRoles("writer", "editor", "admin"),
  controller.deleteArticle
)

// Route buat publish artikel (Editor)
router.patch(
  "/articles/:id/publish",
  authRequired,
  authorizeRoles("editor"),
  controller.publishArticle
)

// Export router biar bisa dipake di app.js
module.exports = router