import { z } from "zod";

export const aiDescriptionSchema = z.object({
  aiDescription: z.string()
})
