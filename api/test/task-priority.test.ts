import { db } from "@/db";
import { taskPriority } from "@/db/schema";
import app from "@/server";
import { beforeAll, describe, expect, it } from "vitest";

beforeAll(async () => {
  await db.delete(taskPriority);
  await app.ready();
});

describe("Task Priority Routes", async () => {
  it("[GET] returning /api/task-priority", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/api/task-priority"
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.payload)).toStrictEqual({
      taskPriorities: []
    });
  });

  it("[POST] returning on create /api/task-priority", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/task-priority",
      body: {
        name: "Priority Test 1",
        order: 1
      }
    });

    expect(response.statusCode).toBe(201);
  })

  it("[DELETE] returning 200 on delete /api/task-priority", async () => {
    const createTaskPriority = await app.inject({
      method: "POST",
      url: "/api/task-priority",
      body: {
        name: "Priority Test 1",
        order: 1
      }
    });

    const { id } = JSON.parse(createTaskPriority.payload);

    const deleteResponse = await app.inject({
      method: "DELETE",
      url: `/api/task-priority/${id}`
    });

    expect(deleteResponse.statusCode).toBe(200);
  })

  it("[DELETE] returning 404 on delete /api/task-priority", async () => {
    const response = await app.inject({
      method: "DELETE",
      url: `/api/task-priority/019a4c98-ecc3-70ed-9012-db664a95341f`
    });

    expect(response.statusCode).toBe(404);
    expect(JSON.parse(response.payload)).toStrictEqual({
      message: "Task Priority not found"
    })
  });

  it("[PUT] returning 200 on update /api/task-priority", async () => {
    const createTaskPriority = await app.inject({
      method: "POST",
      url: "/api/task-priority",
      body: {
        name: "Priority Test 1",
        order: 1
      }
    });

    const { id } = JSON.parse(createTaskPriority.payload);

    const updateResponse = await app.inject({
      method: "PUT",
      url: `/api/task-priority/${id}`,
      body: {
        name: "Updated Priority Test 1",
        order: 2
      }
    });

    expect(updateResponse.statusCode).toBe(200);
    expect(JSON.parse(updateResponse.payload)).toStrictEqual({
      id: id
    });
  });

  it("[PUT] returning 200 on update /api/task-priority", async () => {
    const response = await app.inject({
      method: "PUT",
      url: `/api/task-priority/019a4c98-ecc3-70ed-9012-db664a95341f`,
      body: {
        name: "Updated Priority Test 1",
        order: 2
      }
    });

    expect(response.statusCode).toBe(404);
    expect(JSON.parse(response.payload)).toStrictEqual({
      message: "Task Priority not found"
    })
  })

});
