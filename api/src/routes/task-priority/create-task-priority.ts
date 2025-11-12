import { db } from "@/db";
import { taskPriority } from "@/db/schema";
import { name } from "drizzle-orm";
import { createSelectSchema } from "drizzle-zod";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const createTaskPriority: FastifyPluginAsyncZod = async (app) => {
  app.post(
    "/api/task-priority",
    {
      schema: {
        summary: "Create Task Priority",
        tags: ["Task Priority"],
        body: createSelectSchema(taskPriority).pick({
          name: true,
          order: true
        }),
        response: {
          201: z.object({
            id: z.uuidv7()
          })
        }
      }
    },
    async (request, reploy) => {
      const response = await db
        .insert(taskPriority)
        .values(request.body)
        .returning({
          id: taskPriority.id
        })

      return reploy.status(201).send({
        id: response[0].id
      });
    }
  )
}
