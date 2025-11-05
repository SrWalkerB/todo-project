import { db } from "@/db"
import app from "../src/server"
import supertest from "supertest"
import { expect, test, describe, beforeAll } from "vitest"
import { todos } from "@/db/schema"

beforeAll(async() => {
  await db.delete(todos)
})

describe("Test TODO Routes", async () => {
  await app.ready();

  test("test returns 200 /api/todos", async() => {
    const response = await app.inject({
      method: "GET",
      url: "/api/todos"
    })

    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.payload)).toStrictEqual({
      todos: []
    })
  })

  test("test return 201 with 1 data /api/todos", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/todo",
      body: {
        "title": "task test 1"
      }
    })

    expect(response.statusCode).toBe(201)
  })

  test("test return 400 with error validatiom /api/todos", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/todo",
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
        "url": "/api/todo"
      }
    })
  })

  test("test return 200 remove todo /api/todos", async () => {
    const createTodo = await app.inject({
      method: "POST",
      url: "/api/todo",
      body: {
        title: "task delete"
      }
    })

    const payload = JSON.parse(createTodo.payload) as { id: string };

    const deleteTodo = await app.inject({
      method: "DELETE",
      url: `/api/todos/${payload.id}`
    });

    expect(deleteTodo.statusCode).toBe(200)
  })

  test("test return 404 remove todo /api/todos", async () => {
    const deleteTodo = await app.inject({
      method: "DELETE",
      url: `/api/todos/019a4c98-ecc3-70ed-9012-db664a95341d`
    });

    console.log(deleteTodo.body)

    expect(deleteTodo.statusCode).toBe(404)
  })

})
