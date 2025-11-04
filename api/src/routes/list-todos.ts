import { db } from "@/db";
import { todos } from "@/db/schema";
import { createSelectSchema } from "drizzle-zod";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const listTodos: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/api/todos",
    {
      schema: {
        summary: "List TODOs",
        tags: ["CRUD"],
        querystring: z.object({
          limit: z.coerce.number().max(100).default(10),
        }),
        response: {
          200: z.object({
            todos: z.array(
              createSelectSchema(todos).pick({
                id: true,
                title: true,
                description: true,
              }),
            ),
          }),
        },
      },
    },
    async (request, reply) => {
      const { limit } = request.query;
      const response = await db.select().from(todos).limit(limit);

      return reply.send({
        todos: response,
      });
    },
  );
};
