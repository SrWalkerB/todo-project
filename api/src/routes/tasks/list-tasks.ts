import { db } from "@/db";
import { taskCategory, taskPriority, tasks } from "@/db/schema";
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
                endDate: z.date().nullable(),
                taskCategory: z.object({
                  id: z.uuidv7(),
                  name: z.string().min(1),
                }).nullable(),
                taskPriority: z.object({
                  id: z.uuidv7(),
                  name: z.string().min(1)
                }).nullable()
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
            endDate: tasks.endDate,
            taskCategory: {
              id: taskCategory.id,
              name: taskCategory.name,
            },
            taskPriority: {
              id: taskPriority.id,
              name: taskPriority.name
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
          .leftJoin(
            taskPriority,
            eq(tasks.taskPriorityId, taskPriority.id)
          )
          .orderBy(desc(tasks.completedAt))
          .limit(limit)

        return await reply.send({
          tasks: response,
        });
      } catch(error){
        console.error(error)
      }
    },
  );
};
