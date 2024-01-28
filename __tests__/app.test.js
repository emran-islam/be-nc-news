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

describe("GET/api/topics", () => {
  test("should get all topics", () => {
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

describe("GET/api", () => {
  test("should provide description about all other endpoints available", () => {
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

  test("should handle invalid endpoint", () => {
    return request(app).get("/api/invalid-endpoint").expect(404);
  });
});

describe("GET/api/articles/:article_id", () => {
  test("should get an article by its ID", () => {
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

  test("should handle request for a non-existent article", () => {
    return request(app)
      .get("/api/articles/999999")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Article not found");
      });
  });
});

describe("GET/api/articles", () => {
  test("should get all articles by date in descending order and body property removed", () => {
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

describe("GET/api/articles/:article_id/comments", () => {
  test("should get all comments for an article with most recent comments first", () => {
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

describe("POST/api/articles/:article_id/comments", () => {
  test("should add a comment for an article", () => {
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

  test("status should be 400 when username does not exist", () => {
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

  test("status should be 400 when invalid article ID", () => {
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

  test("status should be 400 when there is no information on request body", () => {
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

describe("PATCH/api/articles/:article_id", () => {
  test("updates article by id, incrementing by no of votes and responds with the updated article", () => {
    const newVote = { inc_votes: 50 };

    return request(app)
      .patch("/api/articles/1")
      .send(newVote)
      .expect(200)
      .then((response) => {
        expect(typeof response.body.article).toBe("object");
        expect(response.body.article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 150,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });

  test("updates article by id, decrementing by no of votes and responds with the updated article", () => {
    const newVote = { inc_votes: -50 };

    return request(app)
      .patch("/api/articles/1")
      .send(newVote)
      .expect(200)
      .then((response) => {
        expect(typeof response.body.article).toBe("object");
        expect(response.body.article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 50,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });

  test("returns invalid input when vote is not a number", () => {
    const newVote = { inc_votes: "emran" };
    return request(app)
      .patch("/api/articles/1")
      .send(newVote)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid input");
      });
  });

  test("returns path not found if article id does not exist", () => {
    const newVote = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/999999")
      .send(newVote)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Path not found");
      });
  });
});

describe("DELETE/api/comments/:comment_id", () => {
  test("should delete the given comment by id", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });

  test("status should be 404 when comment id does not exist and returns error message", () => {
    return request(app)
      .delete("/api/comments/999999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Comments not found");
      });
  });
});
