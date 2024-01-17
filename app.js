const express = require("express");
const app = express();

const {
  getTopics,
  getDescOnOtherEndpoints,
  getArticleByID,
  getArticles,
  getCommentsByArticleID,
} = require("./controllers/nc-news.controllers");

app.get("/api/topics", getTopics);
app.get("/api", getDescOnOtherEndpoints);
app.get("/api/articles/:article_id", getArticleByID);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getCommentsByArticleID);

module.exports = app;
