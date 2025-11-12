import { z } from "zod";

export const taskPriorityItemSchema = z.object({
  id: z.uuidv7(),
  name: z.string(),
});

export const taskPriorityListSchema = z.object({
  taskPriorities: z.array(taskPriorityItemSchema)
})
