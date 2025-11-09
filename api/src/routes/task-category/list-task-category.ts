import { z } from "zod";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { createSelectSchema } from "drizzle-zod";
import { taskCategory } from "@/db/schema";
import { db } from "@/db";
import { eq } from "drizzle-orm";

export const listTaskCategory: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/api/task-category",
    {
      schema: {
        summary: "List Task Categories",
        tags: ["Task Category"],
        querystring: z.object({
          limit: z.coerce.number().max(100).default(10)
        }),
        response: {
          200: z.object({
            taskCategories: z.array(
              createSelectSchema(taskCategory).pick({
                id: true,
                name: true
              })
            )
          })
        }
      }
    },
    async (request, reply) => {
      const { limit } = request.query;

      const response = await db
        .select({
          id: taskCategory.id,
          name: taskCategory.name,
        })
        .from(taskCategory)
        .where(
          eq(taskCategory.isActive, true)
        )
        .limit(limit)

      return await reply.send({
        taskCategories: response
      })
    }
  )
}
