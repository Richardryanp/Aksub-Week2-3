const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  await prisma.article.createMany({
    data: [
      {
        title: "AI Revolution in 2026",
        content: "Artificial intelligence continues to transform industries...",
        author: "John Doe",
        thumbnail: "/uploads/ai.jpg",
        published: true
      },
      {
        title: "Global Economy Update",
        content: "Markets show mixed reactions after global policy changes.",
        author: "Jane Smith",
        thumbnail: "/uploads/economy.jpg",
        published: false
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
}

main();