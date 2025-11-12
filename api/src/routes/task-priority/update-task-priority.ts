import { db } from "@/db";
import { taskPriority } from "@/db/schema";
import { eq } from "drizzle-orm";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const updateTaskPriority: FastifyPluginAsyncZod = async (app) => {
  app.put(
    "/api/task-priority/:id",
    {
      schema: {
        summary: "Update Task Priority",
        tags: ["Task Priority"],
        params: z.object({
          id: z.uuidv7()
        }),
        body: z.object({
          name: z.string(),
          order: z.number().default(0)
        }),
        response: {
          200: z.object({
            id: z.uuidv7()
          }),
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
          name: request.body.name,
          order: request.body.order
        })
        .where(
          eq(taskPriority.id, request.params.id)
        )
        .returning({
          id: taskPriority.id
        });

      if(!response.length){
        return reply.status(404).send({
          message: "Task Priority not found"
        });
      }

      return await reply.send({
        id: response[0].id
      })
    }
  )
}
