import { z } from "zod";

export const taskSummarySchema = z.object({
  totalTasks: z.coerce.string().default("0"),
  completedTasks: z.coerce.string().default("0"),
  pendingTasks: z.coerce.string().default("0"),
  adhrence: z.coerce.string().default("0%"),
})
