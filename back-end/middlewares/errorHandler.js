exports.errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  // Duplication
  if (err.code === 11000) {
    err.statusCode = 400;
    for (let p in err.keyValue) {
      err.message = `The ${p} has been used already`;
    }
  }

  // Validation Error
  if (err.errors) {
    err.statusCode = 400;
    err.message = [];
    for (let p in err.errors) {
      err.message.push(err.errors[p].properties.message);
    }
  }

  // ObjectId: not found
  if (err.kind === "ObjectId") {
    err.statusCode = 404;
    err.message = `The ${req.originalUrl} is not found because of wrong ID`;
  }

  res.status(err.statusCode).json({
    status: "fail",
    message: err.message,
  });
};
