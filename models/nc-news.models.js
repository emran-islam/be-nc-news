const db = require("../db/connection");

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics").then((result) => result.rows);
};

exports.fetchArticleByID = (articleID) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [articleID])
    .then((result) => result.rows[0]);
};

exports.fetchArticles = () => {
  const query = `
    SELECT 
      articles.*,
      COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY created_at DESC;
  `;

  return db.query(query).then((result) => {
    return result.rows;
  });
};
