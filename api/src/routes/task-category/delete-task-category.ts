import { db } from "@/db";
import { taskCategory } from "@/db/schema";
import { eq } from "drizzle-orm";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const deleteTaskCategory: FastifyPluginAsyncZod = async (app) => {
  app.delete(
    "/api/task-category/:id",
    {
      schema: {
        summary: "Delete Task Category",
        tags: ["Task Category"],
        params: z.object({
          id: z.uuidv7()
        }),
        response: {
          200: z.void(),
          404: z.object({
            message: z.string()
          })
        }
      }
    },
    async (request, reply) => {
      const { id } = request.params;

      const response = await db
        .update(taskCategory)
        .set({
          deletedAt: new Date(),
          isActive: false
        })
        .where(eq(taskCategory.id, id))
        .returning({
          id: taskCategory.id
        })

      if (!response.length) {
        return reply.status(404).send({ message: "Task Category not found" });
      }

      return await reply.send()
    }
  )
}
