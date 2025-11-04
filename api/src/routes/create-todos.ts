import { db } from "@/db";
import { todos } from "@/db/schema";
import { createSelectSchema } from "drizzle-zod";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const createTodos: FastifyPluginAsyncZod = async (app) => {
  app.post(
    "/api/todo",
    {
      schema: {
        summary: "Create TODO",
        tags: ["CRUD"],
        body: z.object({
          title: z.string().min(1),
          description: z.string().optional(),
        }),
        response: {
          201: createSelectSchema(todos).pick({
            id: true,
          }),
        },
      },
    },
    async (request, reply) => {
      const response = await db.insert(todos).values(request.body).returning({
        id: todos.id,
      });

      return reply.status(201).send(response[0]);
    },
  );
};
