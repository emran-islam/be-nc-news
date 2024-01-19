const db = require("../db/connection");

exports.fetchTopics = () => {
  return db.query(`SELECT * FROM topics;`).then((results) => {
    return results.rows;
  });
};

exports.fetchArticleByID = (articleID) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [articleID])
    .then((result) => result.rows[0]);
};

exports.fetchArticles = () => {
  return db
    .query(
      `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count
      FROM articles
      LEFT JOIN comments
      ON articles.article_id = comments.article_id
      GROUP BY articles.article_id
      ORDER BY created_at DESC;`
    )
    .then((result) => {
      if (result.rows.length) {
        return result.rows;
      } else {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
    });
};
exports.fetchCommentsByArticleID = (article_id) => {
  return db
    .query(
      `
    SELECT * FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC;`,
      [article_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No comments found`,
        });
      }
      return result.rows;
    });
};
exports.addComment = (article_id, username, body) => {
  return db
    .query(
      `
    INSERT INTO comments
  (article_id, author, body)
  VALUES ($1, $2, $3)
  RETURNING *;`,
      [article_id, username, body]
    )
    .then((result) => {
      result;
      return result.rows[0];
    });
};
