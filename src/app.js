// Import express biar bisa bikin web server
const express = require("express");
// Import route artikel
const articleRoutes = require("./routes/articleRoutes");
// Import route auth (register, login, assign role)
const authRoutes = require("./routes/authRoutes");

// Bikin instance express (app utama)
const app = express();

// Middleware biar request body bisa langsung dibaca dalam bentuk JSON
app.use(express.json());

// Biar file di folder uploads bisa diakses langsung lewat URL
app.use("/uploads", express.static("uploads"));

// Route auth (register, login, assign role)
app.use("/api/auth", authRoutes);

// Semua route yang berhubungan sama artikel, prefix-nya /api
app.use("/api", articleRoutes);

// Export app biar bisa dipake di file lain (kayak server.js)
module.exports = app;