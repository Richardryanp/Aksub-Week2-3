import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("Admin123", 10);

  await prisma.user.upsert({
    where: { email: "admin@evently.com" },
    update: {
      name: "Admin",
      password: adminPassword,
      role: "admin",
    },
    create: {
      name: "Admin",
      email: "admin@evently.com",
      password: adminPassword,
      role: "admin",
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
