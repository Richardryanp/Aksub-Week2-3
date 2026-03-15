const express = require("express")
const router = express.Router()

const controller = require("../controllers/articleController")
const upload = require("../middleware/upload")

router.get("/articles",controller.getArticles)

router.get("/articles/search",controller.searchArticle)

router.post("/articles",upload.single("thumbnail"),controller.createArticle)

router.patch("/articles/:id",upload.single("thumbnail"),controller.updateArticle)

router.delete("/articles/:id",controller.deleteArticle)

router.patch("/articles/:id/publish",controller.publishArticle)

module.exports = router