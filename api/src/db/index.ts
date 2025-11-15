import { env } from "@/env";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  // ssl: true
})

export const db = drizzle(pool, {
  casing: "snake_case",
  schema,
});
