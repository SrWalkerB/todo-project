import { db } from "@/db";
import { taskCategory, tasks } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createSelectSchema } from "drizzle-zod";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const createTasks: FastifyPluginAsyncZod = async (app) => {
  app.post(
    "/api/tasks",
    {
      schema: {
        summary: "Create Tasks",
        tags: ["Tasks"],
        body: z.object({
          title: z.string().min(1),
          description: z.string().optional(),
          startDate: z.coerce.date().optional(),
          endDate: z.coerce.date().optional(),
          taskCategoryId: z.uuidv7().optional()
        }),
        response: {
          201: createSelectSchema(tasks).pick({
            id: true,
          }),
          404: z.object({
            message: z.string()
          })
        },
      },
    },
    async (request, reply) => {
      if(request.body.taskCategoryId){
        const taskCategoryExists = await db
          .select({
            id: taskCategory.id
          })
          .from(taskCategory)
          .where(eq(taskCategory.id, request.body.taskCategoryId));

        if(!taskCategoryExists){
          return reply.status(404).send({
            message: "Task Category not found"
          })
        }
      }

      const response = await db
        .insert(tasks)
        .values(request.body)
        .returning({
          id: tasks.id,
        });

      return reply.status(201).send(response[0]);
    },
  );
};
