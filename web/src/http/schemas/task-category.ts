import { z } from "zod";

export const taskCategoryItemSchema = z.object({
  id: z.uuidv7(),
  name: z.string(),
})

export const taskCategoryListSchema = z.object({
  taskCategories: z.array(taskCategoryItemSchema)
});
