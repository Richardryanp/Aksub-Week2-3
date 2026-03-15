const express = require("express");
const articleRoutes = require("./routes/articleRoutes");

const app = express();

app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.use("/api", articleRoutes);

module.exports = app;