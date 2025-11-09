import { timestamp, date, boolean } from "drizzle-orm/pg-core";
import { pgTable, varchar, text } from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";
import { taskCategory } from "./task-category";
import { taskPriority } from "./task-priority";

export const tasks = pgTable("tasks", {
  id: text()
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  taskCategoryId: text().references(() => taskCategory.id),
  taskPriorityId: text().references(() => taskPriority.id),
  title: varchar().notNull(),
  description: text(),
  startDate: timestamp(),
  endDate : timestamp(),
  isCompleted: boolean().notNull().default(false),
  completedAt: timestamp(),
  createdAt: timestamp().notNull().defaultNow(),
  isActive: boolean().default(true),
  deletedAt: timestamp(),
});
