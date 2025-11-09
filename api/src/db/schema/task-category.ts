import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";

export const taskCategory = pgTable("task_categories", {
  id: text().primaryKey().$defaultFn(() => uuidv7()),
  name: text().notNull(),
  isActive: boolean().default(true),
  createdAt: timestamp().notNull().defaultNow(),
  deletedAt: timestamp(),
})
