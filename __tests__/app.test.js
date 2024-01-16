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
    return request(app).get("/api/invalid-endpoint").expect(404);
  });
});

describe("/api/articles/:article_id", () => {
  test("GET - should get an article by its ID", () => {
    const articleId = 1;

    return request(app)
      .get(`/api/articles/${articleId}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("author");
        expect(res.body).toHaveProperty("title");
        expect(res.body).toHaveProperty("article_id");
        expect(res.body).toHaveProperty("body");
        expect(res.body).toHaveProperty("topic");
        expect(res.body).toHaveProperty("created_at");
        expect(res.body).toHaveProperty("votes");
        expect(res.body).toHaveProperty("article_img_url");
      });
  });

  test("GET - should handle request for a non-existent article", () => {
    const nonExistentArticleId = 999999;

    return request(app)
      .get(`/api/articles/${nonExistentArticleId}`)
      .expect(404);
  });
});
