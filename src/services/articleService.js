// Import repository biar service bisa akses DB lewat repository
const articleRepository = require("../repositories/articleRepository");

// Ambil semua artikel yang udah published
const getPublishedArticles = () => {
  return articleRepository.findPublished();
};

// Bikin artikel baru, defaultnya belum published
const createArticle = (data) => {
  return articleRepository.create({
    ...data, // Spread data dari controller
    published: false // Artikel baru selalu belum published
  });
};

// Update artikel berdasarkan id
const updateArticle = (id, data) => {
  return articleRepository.update(id, data);
};

// Hapus artikel berdasarkan id
const deleteArticle = (id) => {
  return articleRepository.remove(id);
};

// Publish artikel (ubah published jadi true)
const publishArticle = (id) => {
  return articleRepository.publish(id);
};

// Cari artikel berdasarkan judul
const searchArticles = (title) => {
  return articleRepository.searchByTitle(title);
};

// Export semua function biar bisa dipake di controller
module.exports = {
  getPublishedArticles,
  createArticle,
  updateArticle,
  deleteArticle,
  publishArticle,
  searchArticles
};