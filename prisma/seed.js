// Import PrismaClient dari package prisma
const { PrismaClient } = require("@prisma/client");
// Bikin instance Prisma biar bisa akses DB
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

// Fungsi utama buat seed data ke DB
async function main() {
  // createMany = masukin banyak data sekaligus ke tabel article
  await prisma.article.createMany({
    data: [
      {
        title: "AI Revolution in 2026", // Judul artikel
        content: "Artificial intelligence continues to transform industries...", // Isi artikel
        author: "John Doe", // Nama penulis
        thumbnail: "/uploads/ai.jpg", // Path thumbnail
        published: true // Udah dipublish
      },
      {
        title: "Global Economy Update",
        content: "Markets show mixed reactions after global policy changes.",
        author: "Jane Smith",
        thumbnail: "/uploads/economy.jpg",
        published: false // Belum dipublish
      },
      {
        title: "Technology Trends",
        content: "Developers are rapidly adopting AI tools.",
        author: "Michael Tan",
        thumbnail: "/uploads/tech.jpg",
        published: true
      },
      {
        title: "Space Exploration",
        content: "New missions to Mars are being planned.",
        author: "Sarah Lee",
        thumbnail: "/uploads/space.jpg",
        published: false
      },
      {
        title: "Health Innovations",
        content: "Medical technology advances rapidly.",
        author: "David Wong",
        thumbnail: "/uploads/health.jpg",
        published: true
      }
    ]
  });

  // Seed user admin
  const adminPasswordHash = await bcrypt.hash("adminsukasawit@123", 10); //passwordnya di hash

  await prisma.user.upsert({ // upsert, create jika gaada, update jika ada
    where: { email: "sawitwowo@gmail.com" }, // cari user berdasarkan email
    update: {}, // kalo ada, ini yg dijalanin, gaada perubahan
    create: { // kalo gaada create berdasarkan data dibawah
      name: "Admin",
      email: "sawitwowo@gmail.com", 
      password: adminPasswordHash,
      role: "admin",
      dateOfBirth: new Date("2000-01-10"),
    },
  });
}

// Langsung jalanin fungsi main biar data ke-seed ke DB
main();