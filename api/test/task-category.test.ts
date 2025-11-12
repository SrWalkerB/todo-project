import { db } from "@/db";
import { taskCategory, tasks } from "@/db/schema";
import app from "@/server";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

beforeAll(async() => {
  await db.delete(tasks);
  await db.delete(taskCategory);
  await app.ready();
})

describe("Task Category Routes", async() => {
  it("[GET] returning 200 /api/task-category", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/api/task-category"
    });

    expect(response.statusCode).toBe(200);

    expect(JSON.parse(response.payload)).toStrictEqual({
      taskCategories: []
    });
  });

  it("[POST] returning 201 /api/task-category", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/task-category",
      body: {
        name: "Category Test 1"
      }
    });

    expect(response.statusCode).toBe(201);
  });

  it("[DELETE] returning 200 /api/task-category", async() => {
    const createResponse = await app.inject({
      method: "POST",
      url: "/api/task-category",
      body: {
        name: "Category Test 1"
      }
    });

    const { id } = JSON.parse(createResponse.payload);

    const deleteResponse = await app.inject({
      method: "DELETE",
      url: `/api/task-category/${id}`
    });

    expect(deleteResponse.statusCode).toBe(200);
  })

  it("[DELETE] retuning 404 /api/task-category", async () => {
    const response = await app.inject({
      method: "DELETE",
      url: `/api/task-category/019a4c98-ecc3-70ed-9012-db664a95341d`
    });

    expect(response.statusCode).toBe(404);
  })
})

afterAll(async() => {
  await app.close();
})
