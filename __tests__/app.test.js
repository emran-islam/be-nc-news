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
    return request(app)
      .get(`/api/articles/1`)
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
    return request(app).get(`/api/articles/999999`).expect(404);
  });
});

describe("/api/articles", () => {
  test("GET - should get all articles by date in descending order and body property removed", () => {
    return request(app)
      .get("/api/articles")
      .then((res) => {
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);

        const articles = res.body;

        if (articles.length > 1) {
          for (let i = 0; i < articles.length - 1; i++) {
            const currentArticleDate = articles[i].created_at;
            const nextArticleDate = articles[i + 1].created_at;
            expect(currentArticleDate >= nextArticleDate).toBe(true);
          }

          articles.forEach((article) => {
            expect(article).toHaveProperty("author");
            expect(article).toHaveProperty("title");
            expect(article).toHaveProperty("article_id");
            expect(article).toHaveProperty("topic");
            expect(article).toHaveProperty("created_at");
            expect(article).toHaveProperty("votes");
            expect(article).toHaveProperty("article_img_url");
            expect(article).toHaveProperty("comment_count");
            expect(article).not.toHaveProperty("body");
          });
        }
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("GET - should get all comments for an article with most recent comments first", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((res) => {
        expect(Array.isArray(res.body)).toBe(true);

        const comments = res.body;

        expect(comments).toBeSorted({ descending: true, key: "created_at" });

        comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("body");
          expect(comment).toHaveProperty("article_id");
        });
      });
  });
});
