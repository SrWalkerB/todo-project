import { db } from "@/db";
import { tasks } from "@/db/schema";
import { eq } from "drizzle-orm";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod"

export const deleteTasks: FastifyPluginAsyncZod = async(app) => {
  app.delete(
    "/api/tasks/:id",
    {
      schema: {
        summary: "Delete TODOs",
        tags: ["Tasks"],
        params: z.object({
          id: z.uuidv7()
        }),
        response: {
          404: z.void(),
          200: z.void()
        }
      },
    },
    async (request, reply) => {
      const response = await db
        .update(tasks)
        .set({
          deletedAt: new Date(),
          isActive: false
        })
        .where(eq(tasks.id, request.params.id))
        .returning({
          id: tasks.id
        })

      if(!response.length){
        return reply.status(404).send()
      }

      return reply.send()
    }
  )
}
