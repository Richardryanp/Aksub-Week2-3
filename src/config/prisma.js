// Import PrismaClient dari package prisma
const { PrismaClient } = require("@prisma/client");

// Bikin instance Prisma biar bisa akses DB
const prisma = new PrismaClient();

// Export instance prisma biar bisa dipake di file lain
module.exports = prisma;