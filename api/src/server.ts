import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";
import { fastifySwagger } from "@fastify/swagger";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
  jsonSchemaTransform,
} from "fastify-type-provider-zod";
import ScalarApiReference from "@scalar/fastify-api-reference";
import { hasZodFastifySchemaValidationErrors } from "fastify-type-provider-zod";
import { isResponseSerializationError } from "fastify-type-provider-zod";
import { env } from "./env";
import { listTasks } from "./routes/tasks/list-tasks";
import { createTasks } from "./routes/tasks/create-tasks";
import { deleteTasks } from "./routes/tasks/delete-tasks";
import { listTaskCategory } from "./routes/task-category/list-task-category";
import { createTaskCategory } from "./routes/task-category/create-task-category";
import { deleteTaskCategory } from "./routes/task-category/delete-task-category";
import { updateTasks } from "./routes/tasks/update-tasks";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, {
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  origin: true,
});

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "TODO App",
      version: "0.0.1",
    },
  },
  transform: jsonSchemaTransform,
});

app.setErrorHandler((err, req, reply) => {
  if (hasZodFastifySchemaValidationErrors(err)) {
    return reply.code(400).send({
      error: "Response validation error",
      statusCode: 400,
      details: {
        issue: err.validation,
        method: req.method,
        url: req.url,
      },
    });
  }

  if (isResponseSerializationError(err)) {
    return reply.code(500).send({
      error: "Internal server error",
      statusCode: 500,
      details: {
        issues: err.cause.issues,
        method: err.method,
        url: err.url,
      },
    });
  }
});

app.register(ScalarApiReference, {
  routePrefix: "/docs",
});

app.register(listTasks);
app.register(createTasks);
app.register(updateTasks);
app.register(deleteTasks);
app.register(listTaskCategory);
app.register(createTaskCategory)
app.register(deleteTaskCategory)

app.listen({ port: env.PORT, host: "0.0.0.0" }).then(() => {
  console.log(`HTTP server Running: http://localhost:3000`);
  console.log(`Docs Running: http://localhost:3000/docs`);
});

export default app
