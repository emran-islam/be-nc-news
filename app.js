const express = require("express");
const app = express();

const {
  getTopics,
  getDescOnOtherEndpoints,
} = require("./controllers/nc-news.controllers");

app.get("/api/topics", getTopics);
app.get("/api", getDescOnOtherEndpoints);

module.exports = app;
