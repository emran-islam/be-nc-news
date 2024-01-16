const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data");
const request = require("supertest");
const app = require("../app.js");
const incompleteEndpoints = require("../endpoints.json");

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

        if (res.body.length === 3) {
          const topic = res.body[0];
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
        }
      });
  });
});

describe("/api", () => {
  test("GET - should provide description about all other endpoints available", () => {
    return request(app)
      .get("/api")
      .then((res) => {
        expect(res.status).toBe(200);

        const actualEndpoints = res.body;

        Object.keys(incompleteEndpoints).forEach((endpoint) => {
          expect(actualEndpoints).toHaveProperty(endpoint);
          expect(actualEndpoints[endpoint]).toEqual(
            incompleteEndpoints[endpoint]
          );
        });
      });
  });

  test("GET - should handle invalid endpoint", () => {
    return request(app)
      .get("/api/invalid-endpoint")
      .then((res) => {
        expect(res.status).toBe(404);
      });
  });
});
