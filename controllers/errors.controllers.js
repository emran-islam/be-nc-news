exports.incorrectEndpointHandler = (req, res) => {
  res.status(404).send({ msg: "Path not found" });
};

exports.customErrorHandler = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else if (err.status === 404) {
    res.status(404).send({ msg: "Article not found" });
  } else {
    next(err);
  }
};

exports.psqlErrorHandler = (err, req, res, next) => {
  if (err.code === "23503") {
    res.status(400).send({ msg: "Invalid input" });
  } else {
    next(err);
  }
};

exports.internalServerError = (err, req, res, next) => {
  res.status(500).send({ msg: "internal server error" });
};
