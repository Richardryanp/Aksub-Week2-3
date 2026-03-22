// Import service biar controller bisa manggil logic bisnis
const service = require("../services/articleService");

// Controller buat ambil semua artikel yang udah publish
const getArticles = async (req, res) => {
  const data = await service.getPublishedArticles(); // Ambil data artikel yang published
  res.json(data); // Kirim data ke client dalam bentuk JSON
};

// Controller buat bikin artikel baru
const createArticle = async (req, res) => {
  const { title, content, author } = req.body; // Ambil data dari body request

  // Kalo ada file thumbnail yang diupload, ambil path-nya, kalo nggak null
  const thumbnail = req.file ? req.file.path : null;

  // Panggil service buat bikin artikel baru
  const article = await service.createArticle({
    title,
    content,
    author,
    thumbnail
  });

  // Balikin response status 201 (created) sama data artikelnya
  res.status(201).json(article);
};

// Controller buat update artikel
const updateArticle = async (req, res) => {
  const id = parseInt(req.params.id); // Ambil id dari URL

  const { title, content, author } = req.body; // Ambil data baru dari body

  // Kalo ada file baru, pake path file, kalo nggak biarin undefined (biar nggak keubah)
  const thumbnail = req.file ? req.file.path : undefined;

  // Update artikel lewat service
  const article = await service.updateArticle(id, {
    title,
    content,
    author,
    thumbnail
  });

  res.json(article); // Balikin data artikel yang udah diupdate
};

// Controller buat hapus artikel
const deleteArticle = async (req, res) => {
  const id = parseInt(req.params.id); // Ambil id dari URL

  await service.deleteArticle(id); // Hapus artikel lewat service

  res.json({ message: "Article deleted" }); // Balikin pesan sukses
};

// Controller buat publish artikel
const publishArticle = async (req, res) => {
  const id = parseInt(req.params.id); // Ambil id dari URL

  const article = await service.publishArticle(id); // Publish artikel lewat service

  res.json(article); // Balikin data artikel yang udah dipublish
};

// Controller buat cari artikel berdasarkan judul
const searchArticle = async (req, res) => {
  const { title } = req.query; // Ambil query title dari URL

  const data = await service.searchArticles(title); // Cari artikel lewat service

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