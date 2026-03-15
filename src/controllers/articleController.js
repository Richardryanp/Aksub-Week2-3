const service = require("../services/articleService");

const getArticles = async (req, res) => {
  const data = await service.getPublishedArticles();
  res.json(data);
};

const createArticle = async (req, res) => {
  const { title, content, author } = req.body;

  const thumbnail = req.file ? req.file.path : null;

  const article = await service.createArticle({
    title,
    content,
    author,
    thumbnail
  });

  res.status(201).json(article);
};

const updateArticle = async (req, res) => {
  const id = parseInt(req.params.id);

  const { title, content, author } = req.body;

  const thumbnail = req.file ? req.file.path : undefined;

  const article = await service.updateArticle(id, {
    title,
    content,
    author,
    thumbnail
  });

  res.json(article);
};

const deleteArticle = async (req, res) => {
  const id = parseInt(req.params.id);

  await service.deleteArticle(id);

  res.json({ message: "Article deleted" });
};

const publishArticle = async (req, res) => {
  const id = parseInt(req.params.id);

  const article = await service.publishArticle(id);

  res.json(article);
};

const searchArticle = async (req, res) => {
  const { title } = req.query;

  const data = await service.searchArticles(title);

  res.json(data);
};

module.exports = {
  getArticles,
  createArticle,
  updateArticle,
  deleteArticle,
  publishArticle,
  searchArticle
};