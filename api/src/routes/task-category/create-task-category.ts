import { db } from "@/db";
import { taskCategory } from "@/db/schema";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const createTaskCategory: FastifyPluginAsyncZod = async (app) => {
  app.post("/api/task-category",
  {
    schema: {
      summary: "Create Task Category",
      tags: ["Task Category"],
      body: z.object({
        name: z.string().min(1)
      }),
      response: {
        201: z.object({
          id: z.uuidv7()
        })
      }
    }
  },
  async (request, reply) => {
    const response = await db
      .insert(taskCategory)
      .values(request.body)
      .returning({
        id: taskCategory.id
      })

    return await reply.status(201).send({
      id: response[0].id
    })
  })
}
