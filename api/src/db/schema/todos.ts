import { timestamp } from "drizzle-orm/pg-core";
import { pgTable, varchar, text } from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";

export const todos = pgTable("todos", {
  id: text()
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  title: varchar().notNull(),
  description: text(),
  createdAt: timestamp().notNull().defaultNow(),
});
