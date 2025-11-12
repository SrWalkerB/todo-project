import { db } from "@/db";
import { taskPriority } from "@/db/schema";
import { eq } from "drizzle-orm";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { id } from "zod/locales";

export const deleteTaskPriority: FastifyPluginAsyncZod = async (app) => {
  app.delete(
    "/api/task-priority/:id",
    {
      schema: {
        summary: "Delete Task Priority",
        tags: ["Task Priority"],
        params: z.object({
          id: z.uuidv7()
        }),
        response: {
          200: z.void(),
          404: z.object({
            message: z.string().default("Task Priority not found")
          })
        }
      }
    },
    async (request, reply) => {
      const response = await db
        .update(taskPriority)
        .set({
          isActive: false
        })
        .where(eq(taskPriority.id, request.params.id))
        .returning({
          id: taskPriority.id
        });

      console.log("data", response)

      if(!response.length){
        return reply.status(404).send({
          message: "Task Priority not found"
        })
      }

      return await reply.send();
    }
  )
}
