import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    // seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Resolved lazily on purpose: `prisma generate` does not need a database
    // URL, but `env()` throws eagerly when called at the module top level.
    // This broke `docker build` (no .env file and no DATABASE_URL at build
    // time). With a getter, only commands that actually need the URL resolve
    // it, and they still fail fast with PrismaConfigEnvError if it is missing.
    get url(): string {
      return env("DATABASE_URL");
    },
  },
});
