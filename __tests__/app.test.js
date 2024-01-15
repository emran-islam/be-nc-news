const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data");
const request = require("supertest");
const app = require("../app.js");

beforeEach(() => seed(testData));

afterAll(() => {
  return db.end();
});

describe("/api/topics", () => {
  test("GET - should get all topics", () => {
    return request(app)
      .get("/api/topics")
      .then((res) => {
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);

        if (res.body.length > 0) {
          const topic = res.body[0];
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
        }
      });
  });

  test("GET - should handle invalid endpoint", () => {
    return request(app).get("/api/invalid-endpoint").expect(404);
  });
});
