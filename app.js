const express = require("express");
const app = express();

const {
  getTopics,
  getDescOnOtherEndpoints,
  getArticleByID,
} = require("./controllers/nc-news.controllers");

app.get("/api/topics", getTopics);
app.get("/api", getDescOnOtherEndpoints);
app.get("/api/articles/:article_id", getArticleByID);

module.exports = app;
