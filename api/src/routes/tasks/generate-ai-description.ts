import { FastifyPluginAsyncZod } from "@/fastify-type-provider-zod/dist/esm";
import { z } from "zod";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export const generateAiDescription: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/api/ai/description",
    {
      schema: {
        summary: "Generate AI Description for Task",
        tags: ["Tasks"],
        querystring: z.object({
          title: z.string().min(1)
        }),
        response: {
          200: z.object({
            aiDescription: z.string()
          })
        }
      }
    },
    async (request, reply) => {
      const { text } = await generateText({
        model: google("gemini-2.0-flash-lite"),
        prompt: `
          Generate a detailed task description based on the following title
          returning only the description without any additional text.
          Not description very long, returning in PT-BR language.
          Wihtout line breaks and "\n" characters. Max 300 characters.

          Title: ${request.query.title}
        `.trim(),
      })

      return await reply.send({
        aiDescription: text,
      })
    }
  )
}
