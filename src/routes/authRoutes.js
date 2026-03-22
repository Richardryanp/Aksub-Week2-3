const express = require("express");
const router = express.Router(); 
const authController = require("../controllers/authController");
const { authLimiter } = require("../middlewares/rateLimitMiddleware");
const { authRequired, authorizeRoles } = require("../middlewares/authMiddleware");

router.post("/register", authLimiter, authController.register); // Route buat register user baru, rate limit 5 request per 15 menit per IP
router.post("/login", authLimiter, authController.login); // Route buat login, rate limit 5 request per 15 menit per IP

router.post(
  "/assign-role",
  authRequired, // Harus login dulu buat assign role
  authorizeRoles("admin"), // Cuma admin yang bisa assign role
  authController.assignRole, // ke controller
);

module.exports = router;

