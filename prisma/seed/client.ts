import "dotenv/config";
import { PrismaClient } from "../../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const url = process.env.DB_URL;
if (!url) {
  throw new Error("DB_URL is not set. Add it to .env at the project root.");
}

export const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: url }),
});

export async function disconnect() {
  await prisma.$disconnect();
}
