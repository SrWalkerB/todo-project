import { boolean, text, timestamp, integer } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";

export const taskPriority = pgTable("tasks_priority", {
  id: text().primaryKey().$defaultFn(() => uuidv7()),
  name: text().notNull(),
  order: integer().default(0),
  isActive: boolean().default(true),
  createdAt: timestamp().notNull().defaultNow(),
  deletedAt: timestamp(),
})
