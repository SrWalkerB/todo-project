import { db } from "@/db"
import app from "../src/server"
import { expect, describe, beforeAll, it, afterAll } from "vitest"
import { taskCategory, tasks } from "@/db/schema"
import { id } from "zod/locales"

beforeAll(async() => {
  await db.delete(taskCategory);
  await db.delete(tasks);
  await app.ready();
})

describe("Tasks api routes", async () => {
  it("[GET] test returns 200 /api/tasks", async() => {
    const response = await app.inject({
      method: "GET",
      url: "/api/tasks"
    })

    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.payload)).toStrictEqual({
      tasks: []
    })
  })

  it("[POST] test return 201 with 1 data /api/tasks", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/tasks",
      body: {
        "title": "task test 1"
      }
    })

    expect(response.statusCode).toBe(201)
  })

  it("[POST] test return 400 with error validatiom /api/tasks", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/tasks",
      body: {}
    })

    expect(response.statusCode).toBe(400)
    expect(JSON.parse(response.payload)).toStrictEqual({
      "error": "Response validation error",
      "statusCode": 400,
      "details": {
        "issue": [
          {
            "keyword": "invalid_type",
            "instancePath": "/title",
            "schemaPath": "#/title/invalid_type",
            "message": "Invalid input: expected string, received undefined",
            "params": {
              "expected": "string"
            }
          }
        ],
        "method": "POST",
        "url": "/api/tasks"
      }
    })
  })

  it("[DELETE] test return 200 remove task /api/tasks", async () => {
    const createTodo = await app.inject({
      method: "POST",
      url: "/api/tasks",
      body: {
        title: "task delete"
      }
    })

    const payload = JSON.parse(createTodo.payload) as { id: string };

    const deleteTodo = await app.inject({
      method: "DELETE",
      url: `/api/tasks/${payload.id}`
    });

    expect(deleteTodo.statusCode).toBe(200)
  })

  it("[DELETE] test return 404 remove task /api/tasks", async () => {
    const deleteTodo = await app.inject({
      method: "DELETE",
      url: `/api/tasks/019a4c98-ecc3-70ed-9012-db664a95341d`
    });

    expect(deleteTodo.statusCode).toBe(404)
  })

  it("[PUT] test returning 404 if taskCategoryId not exists /api/tasks", async () => {
    const createTask = await app.inject({
      method: "POST",
      url: "/api/tasks",
      body: {
        title: "Task with invalid category",
      }
    });

    const createTaskPayload = JSON.parse(createTask.payload) as { id: string };

    const response = await app.inject({
      method: "PUT",
      url: `/api/tasks/${createTaskPayload.id}`,
      body: {
        taskCategoryId: "019a4c98-ecc3-70ed-9012-db664a95341d",
        title: "Updated Task"
      }
    });

    expect(response.statusCode).toBe(404);
    expect(JSON.parse(response.payload)).toStrictEqual({
      message: "Task Category not found"
    })
  })

  it("[PUT] test returning 404 if taskPriorityId not exists /api/tasks", async () => {
    const createTask = await app.inject({
      method: "POST",
      url: "/api/tasks",
      body: {
        title: "Task with invalid priority",
      }
    });

    const createTaskPayload = JSON.parse(createTask.payload) as { id: string };

    const response = await app.inject({
      method: "PUT",
      url: `/api/tasks/${createTaskPayload.id}`,
      body: {
        taskPriorityId: "019a4c98-ecc3-70ed-9012-db664a95341d",
        title: "Updated Task"
      }
    });

    expect(response.statusCode).toBe(404);
    expect(JSON.parse(response.payload)).toStrictEqual({
      message: "Task Priority not found"
    })
  });

  it("[PUT] test returning 404 if id not exists /api/tasks", async () => {
    const response = await app.inject({
      method: "PUT",
      url: `/api/tasks/019a4c98-ecc3-70ed-9012-db664a95341d`,
      body: {
        title: "Updated Task"
      }
    });

    expect(response.statusCode).toBe(404);
    expect(JSON.parse(response.payload)).toStrictEqual({
      message: "Task not found"
    })
  });

  it("[PUT] test returning 200 with sucess /api/tasks", async () => {
    const createTask = await app.inject({
      method: "POST",
      url: "/api/tasks",
      body: {
        title: "Task to be updated",
      }
    });

    const createTaskPayload = JSON.parse(createTask.payload) as { id: string };

    const response = await app.inject({
      method: "PUT",
      url: `/api/tasks/${createTaskPayload.id}`,
      body: {
        title: "Updated Task Successfully"
      }
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.payload)).toStrictEqual({
      id: createTaskPayload.id
    })
  });

  it("[PATCH] test returning 200 with sucess /api/tasks/status", async () => {
    const createTask = await app.inject({
      method: "POST",
      url: "/api/tasks",
      body: {
        title: "Task to update status",
      }
    });

    const createTaskPayload = JSON.parse(createTask.payload) as { id: string };

    const response = await app.inject({
      method: "PATCH",
      url: `/api/tasks/status/${createTaskPayload.id}`,
      body: {
        isCompleted: true
      }
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.payload)).toStrictEqual({
      id: createTaskPayload.id,
      isCompleted: true
    })
  });

  it("[PATCH] test returning 404 id not exists /api/tasks/status", async () => {
    const response = await app.inject({
      method: "PATCH",
      url: `/api/tasks/status/019a4c98-ecc3-70ed-9012-db664a95341d`,
      body: {
        isCompleted: true
      }
    });

    expect(response.statusCode).toBe(404);
    expect(JSON.parse(response.payload)).toStrictEqual({
      message: "Task not found"
    })
  });

  it("[POST] test returning 404 not exists taskPriorityId /api/tasks", async () => {
    const createTaskCategory = await app.inject({
      method: "POST",
      url: "/api/tasks",
      body: {
        title: "Task with category and priority",
        taskCategoryId: "019a4c98-ecc3-70ed-9012-db664a95341d",
      }
    });

    expect(createTaskCategory.statusCode).toBe(404);
    expect(JSON.parse(createTaskCategory.payload)).toStrictEqual({
      message: "Task Category not found"
    })
  });

  it("[POST] test returning 404 not exists taskPriorityId /api/tasks", async () => {
    const createTaskPriority = await app.inject({
      method: "POST",
      url: "/api/tasks",
      body: {
        title: "Task with category and priority",
        taskPriorityId: "019a4c98-ecc3-70ed-9012-db664a95341d",
      }
    });

    expect(createTaskPriority.statusCode).toBe(404);
    expect(JSON.parse(createTaskPriority.payload)).toStrictEqual({
      message: "Task Priority not found"
    })
  })
})

afterAll(async () => {
  await app.close();
})
