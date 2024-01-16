const db = require("../db/connection");

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics").then((result) => result.rows);
};

exports.fetchArticleByID = (articleID) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [articleID])
    .then((result) => result.rows[0]);
};
