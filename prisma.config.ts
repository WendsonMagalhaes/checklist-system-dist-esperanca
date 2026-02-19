// prisma.config.ts
import "dotenv/config";
import { defineConfig } from "prisma/config";

// Checa se a variável de ambiente está definida
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL não está definida! Configure nas Environment Variables.");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL, // agora o TypeScript sabe que nunca é undefined
  },
});
