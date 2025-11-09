import { boolean, text, timestamp } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";

export const taskPriority = pgTable("tasks_priority", {
  id: text().primaryKey().$defaultFn(() => uuidv7()),
  name: text().notNull(),
  isActive: boolean().default(true),
  createdAt: timestamp().notNull().defaultNow(),
  deletedAt: timestamp(),
})
