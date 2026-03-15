const articleRepository = require("../repositories/articleRepository");

const getPublishedArticles = () => {
  return articleRepository.findPublished();
};

const createArticle = (data) => {
  return articleRepository.create({
    ...data,
    published: false
  });
};

const updateArticle = (id, data) => {
  return articleRepository.update(id, data);
};

const deleteArticle = (id) => {
  return articleRepository.remove(id);
};

const publishArticle = (id) => {
  return articleRepository.publish(id);
};

const searchArticles = (title) => {
  return articleRepository.searchByTitle(title);
};

module.exports = {
  getPublishedArticles,
  createArticle,
  updateArticle,
  deleteArticle,
  publishArticle,
  searchArticles
};