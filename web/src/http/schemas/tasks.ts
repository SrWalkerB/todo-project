import { z } from "zod";

export const tasksListItemSchema = z.object({
  id: z.uuidv7(),
  title: z.string().min(1),
  description: z.string().optional(),
  isCompleted: z.boolean(),
  taskCategory: z.object({
    id: z.uuidv7(),
    name: z.string().min(1),
  }).nullable()
})

export const tasksListSchema = z.object({
  tasks: z.array(tasksListItemSchema)
})

export const taskStatusSchema = z.object({
  isCompleted: z.boolean(),
  id: z.uuidv7()
})
