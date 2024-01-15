const { fetchTopics } = require("../models/nc-news.models");

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
