import { env } from "@/env";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
    ssl: true,
  },
  out: "./src/db/migrations",
  schema: "./src/db/schema/index.ts",
  casing: "snake_case",
});
