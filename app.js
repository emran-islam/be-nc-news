const express = require("express");
const {
  incorrectEndpointHandler,
  customErrorHandler,
  psqlErrorHandler,
  internalServerError,
} = require("./controllers/errors.controllers");

const app = express();

const {
  getTopics,
  getDescOnOtherEndpoints,
  getArticleByID,
  getArticles,
  getCommentsByArticleID,
  postCommentsByArticleID,
} = require("./controllers/nc-news.controllers");

app.use(express.json());

// GET requests
app.get("/api/topics", getTopics);
app.get("/api", getDescOnOtherEndpoints);
app.get("/api/articles/:article_id", getArticleByID);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getCommentsByArticleID);

//POST requests
app.post("/api/articles/:article_id/comments", postCommentsByArticleID);

//Errors
app.use("*", incorrectEndpointHandler);
app.use(customErrorHandler);
app.use(psqlErrorHandler);
app.use(internalServerError);

module.exports = app;
