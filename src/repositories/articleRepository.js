// Import prisma biar bisa akses DB
const prisma = require("../config/prisma");

// Ambil semua artikel yang udah published
const findPublished = () => {
  return prisma.article.findMany({
    where: {
      published: true // Cuma ambil yang published
    }
  });
};

// Bikin artikel baru
const create = (data) => {
  return prisma.article.create({
    data // Data artikel baru
  });
};

// Update artikel berdasarkan id
const update = (id, data) => {
  return prisma.article.update({
    where: { id: Number(id) }, // Cari artikel berdasarkan id
    data // Data baru buat update
  });
};

// Hapus artikel berdasarkan id
const remove = (id) => {
  return prisma.article.delete({
    where: { id: Number(id) }
  });
};

// Publish artikel (ubah published jadi true)
const publish = (id) => {
  return prisma.article.update({
    where: { id: Number(id) },
    data: { published: true }
  });
};

// Cari artikel berdasarkan judul (yang mirip-mirip)
const searchByTitle = (title) => {
  return prisma.article.findMany({
    where: {
      title: {
        contains: title // Cari yang judulnya mengandung kata yang dicari
      }
    }
  });
};

// Export semua function biar bisa dipake di service
module.exports = {
  findPublished,
  create,
  update,
  remove,
  publish,
  searchByTitle
};