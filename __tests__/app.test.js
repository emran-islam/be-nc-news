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
        expect(Array.isArray(res.body.topics)).toBe(true);

        if (res.body.topics.length === 3) {
          const topic = res.body.topics[0];
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
      .get("/api/articles/1")
      .then((res) => {
        expect(res.status).toBe(200);
        const { article } = res.body;

        expect(article).toHaveProperty("author");
        expect(article).toHaveProperty("title");
        expect(article).toHaveProperty("article_id");
        expect(article).toHaveProperty("body");
        expect(article).toHaveProperty("topic");
        expect(article).toHaveProperty("created_at");
        expect(article).toHaveProperty("votes");
        expect(article).toHaveProperty("article_img_url");
      });
  });

  test("GET - should handle request for a non-existent article", () => {
    return request(app)
      .get("/api/articles/999999")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Article not found");
      });
  });
});

describe("/api/articles", () => {
  test("GET - should get all articles by date in descending order and body property removed", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        const { articles } = res.body;
        expect(Array.isArray(articles)).toBe(true);

        expect(articles).toBeSorted({ key: "created_at", descending: true });

        expect(articles.length > 0).toBe(true);

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
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("GET - should get all comments for an article with most recent comments first", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((res) => {
        const { comments } = res.body;
        expect(Array.isArray(comments)).toBe(true);

        expect(comments.length > 0).toBe(true);

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

describe("/api/articles/:article_id/comments", () => {
  test("POST - should add a comment for an article", () => {
    const newComment = {
      username: "icellusedkars",
      body: "this is a test comment",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then((response) => {
        expect(response.body.comment).toBeInstanceOf(Object);
        expect(response.body.comment).toEqual({
          article_id: 1,
          comment_id: 19,
          votes: 0,
          created_at: expect.any(String),
          author: "icellusedkars",
          body: "this is a test comment",
        });
      });
  });

  test("POST - status should be 400 when username does not exist", () => {
    const newComment = {
      username: "emran",
      body: "this is a test comment",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid input");
      });
  });

  test("POST - status should be 400 when invalid article ID", () => {
    const newComment = {
      username: "butter_bridge",
      body: "this is a test comment",
    };
    return request(app)
      .post("/api/articles/999999/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toEqual("Invalid input");
      });
  });

  test("POST - status should be 400 when there is no information on request body", () => {
    const newComment = {};
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid input");
      });
  });
});
