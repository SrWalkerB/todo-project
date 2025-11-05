import { env } from "@/env"
import pg from "pg"
import { drizzle } from "drizzle-orm/node-postgres"
import { migrate } from "drizzle-orm/node-postgres/migrator"
import { beforeAll } from "vitest"

beforeAll(async() => {
  const client = new pg.Client({
    connectionString: env.DATABASE_URL
  })

  await client.connect()

  console.info("Rodando Migrate...")
  const db = drizzle(client)

  await migrate(db, {migrationsFolder: "./src/db/migrations"})

  console.info("Finish Migrate...")
})
