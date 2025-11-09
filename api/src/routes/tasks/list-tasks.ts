import { db } from "@/db";
import { taskCategory, tasks } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const listTasks: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/api/tasks",
    {
      schema: {
        summary: "List Tasks",
        tags: ["Tasks"],
        querystring: z.object({
          limit: z.coerce.number().max(100).default(10),
        }),
        response: {
          200: z.object({
            tasks: z.array(
              z.object({
                id: z.uuidv7(),
                title: z.string().min(1),
                description: z.string().nullable(),
                isCompleted: z.boolean(),
                taskCategory: z.object({
                  id: z.uuidv7(),
                  name: z.string().min(1),
                }).nullable(),
              })
            ),
          }),
          500: z.object({
            message: z.string(),
          })
        },
      },
    },
    async (request, reply) => {
      try {
        const { limit } = request.query;

        const response = await db
          .select({
            id: tasks.id,
            title: tasks.title,
            description: tasks.description,
            isCompleted: tasks.isCompleted,
            taskCategory: {
              id: taskCategory.id,
              name: taskCategory.name,
            }
          })
          .from(tasks)
          .where(
            eq(tasks.isActive, true)
          )
          .leftJoin(
            taskCategory,
            eq(tasks.taskCategoryId, taskCategory.id)
          )
          .orderBy(desc(tasks.createdAt))
          .limit(limit)

        return await reply.send({
          tasks: response,
        });
      } catch (error) {
        console.error("Error listing tasks:", error);
        return reply.status(500).send({ message: "Internal Server Error" });
      }
    },
  );
};
