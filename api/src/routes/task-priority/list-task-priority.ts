import { db } from "@/db";
import { taskPriority } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { createSelectSchema } from "drizzle-zod";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const listTaskPriority: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/api/task-priority",
    {
      schema: {
        summary: "List Task Priorities",
        tags: ["Task Priority"],
        querystring: z.object({
          limit: z.coerce.number().max(100).default(10)
        }),
        response: {
          200: z.object({
            taskPriorities: z.array(
              createSelectSchema(taskPriority).pick({
                id: true,
                name: true,
                order: true
              })
            )
          })
        }
      }
    },
    async (request, reply) => {
      const response = await db
        .select({
          id: taskPriority.id,
          name: taskPriority.name,
          order: taskPriority.order
        })
        .from(taskPriority)
        .where(
          eq(taskPriority.isActive, true)
        )
        .orderBy(asc(taskPriority.order))
        .limit(request.query.limit);

      return await reply.send({
        taskPriorities: response
      });
    }
  )
}
