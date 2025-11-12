import { db } from "@/db";
import { taskCategory, taskPriority, tasks } from "@/db/schema";
import { eq } from "drizzle-orm";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { de } from "zod/locales";
import is from "zod/v4/locales/is.js";

export const updateTasks: FastifyPluginAsyncZod = async (app) => {
  app.put(
    "/api/tasks/:id",
    {
      schema: {
        summary: "Update Tasks",
        tags: ["Tasks"],
        params: z.object({
          id: z.uuidv7()
        }),
        body: z.object({
          title: z.string().min(1),
          description: z.string().optional(),
          startDate: z.coerce.date().optional(),
          endDate: z.coerce.date().optional(),
          taskCategoryId: z.uuidv7().optional(),
          taskPriorityId: z.uuidv7().optional(),
        }),
        response: {
          200: z.object({
            id: z.uuidv7()
          }),
          404: z.object({
            message: z.string()
          })
        }
      }
    },
    async (request, reply) => {
      const { id } = request.params;

      if(request.body.taskCategoryId){
        const taskCategoryExists = await db
          .select({
            id: taskCategory.id
          })
          .from(taskCategory)
          .where(eq(taskCategory.id, request.body.taskCategoryId));

        if(!taskCategoryExists.length){
          return await reply.status(404).send({
            message: "Task Category not found"
          })
        }
      }

      if(request.body.taskPriorityId){
        const taskPriorityExists = await db
          .select({
            id: taskPriority.id
          })
          .from(taskPriority)
          .where(
            eq(taskPriority.id, request.body.taskPriorityId)
          );

        if (!taskPriorityExists.length) {
          return reply.status(404).send({
            message: "Task Priority not found"
          });
        }
      }

      const response = await db
        .update(tasks)
        .set({
          title: request.body.title,
          description: request.body.description,
          startDate: request.body.startDate,
          endDate: request.body.endDate,
          taskCategoryId: request.body.taskCategoryId,
          taskPriorityId: request.body.taskPriorityId,
        })
        .where(eq(tasks.id, id))
        .returning({
          id: tasks.id
        });

      if(!response.length){
        return reply.status(404).send({
          message: "Task not found"
        })
      }

      return await reply.send({
        id: response[0].id
      })
    }
  ),
  app.patch(
    "/api/tasks/status/:id",
    {
      schema: {
        summary: "Update Task Completion Status",
        tags: ["Tasks"],
        params: z.object({
          id: z.uuidv7()
        }),
        body: z.object({
          isCompleted: z.boolean()
        }),
        response: {
          200: z.object({
            isCompleted: z.boolean(),
            id: z.uuidv7()
          }),
          404: z.object({
            message: z.string().default("Task not found")
          })
        }
      }
    },
    async (request, reply) => {
      const { id } = request.params;
      const { isCompleted } = request.body;

      const response = await db
        .update(tasks)
        .set({
          isCompleted: isCompleted,
          completedAt: isCompleted ? new Date() : null
        })
        .where(eq(tasks.id, id))
        .returning({
          id: tasks.id
        });

      if(!response.length){
        return await reply.status(404).send({
          message: "Task not found"
        })
      };

      return await reply.send({
        isCompleted: isCompleted,
        id: response[0].id
      });
    }
  )
}
