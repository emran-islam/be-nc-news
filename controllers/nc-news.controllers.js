const { fetchTopics, fetchArticleByID } = require("../models/nc-news.models");
const incompleteEndpoints = require("../endpoints.json");

exports.getTopics = (req, res) => {
  fetchTopics()
    .then((topics) => {
      if (topics.length === 0) {
        return res.status(404).send({ error: "No topics found" });
      }

      res.status(200).send(topics);
    })
    .catch((err) => {
      res.status(500).send({ error: "Internal Server Error" });
    });
};

exports.getDescOnOtherEndpoints = (req, res) => {
  res.status(200).send(incompleteEndpoints);
};

exports.getArticleByID = (req, res) => {
  const articleID = req.params.article_id;

  fetchArticleByID(articleID)
    .then((article) => {
      if (!article) {
        res.status(404).send({ error: "Article not found" });
      } else {
        res.status(200).send(article);
      }
    })
    .catch((err) => {
      res.status(500).send({ error: "Internal Server Error" });
    });
};
