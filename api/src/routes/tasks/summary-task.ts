import { db } from "@/db";
import { tasks } from "@/db/schema";
import { count, isNull, sum, sql } from "drizzle-orm";
import { FastifyPluginAsyncZod } from "@/fastify-type-provider-zod";
import { z } from "zod";

export const summaryTask: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/api/tasks/summary",
    {
      schema: {
        summary: "Summary Task",
        tags: ["Tasks"],
        response: {
          200: z.object({
            totalTasks: z.number(),
            completedTasks: z.number(),
            pendingTasks: z.number(),
            adhrence: z.number()
          })
        }
      }
    },
    async (request, reply) => {
      try {
        const tasksTotal = await db
          .select({
            isCompleted: tasks.isCompleted,
            count: count()
          })
          .from(tasks)
          .groupBy(tasks.isCompleted)
          .where(isNull(tasks.deletedAt));

        const completed = tasksTotal.find(element => element.isCompleted)?.count || 0;
        const pending = tasksTotal.find(element => !element.isCompleted)?.count || 0;
        const total = completed + pending;

        return reply.send({
          completedTasks: Number(completed),
          pendingTasks:pending,
          totalTasks: total,
          adhrence: total === 0 ? 0 : Number(((completed / total) * 100).toFixed(2))
        })
      } catch(err){
        console.log(err)
      }
    }
  )
}
