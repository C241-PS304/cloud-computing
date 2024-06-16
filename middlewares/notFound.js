const notFound = (req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  error.message = "Endpoint tidak ditemukan";

  next(error);
};

module.exports = notFound;
