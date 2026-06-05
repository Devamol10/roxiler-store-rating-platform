const { HTTP_STATUS } = require("../constants");

function errorHandler(error, _req, res, _next) {
  const statusCode = error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;

  return res.status(statusCode).json({
    success: false,
    message: error.message || "Something went wrong",
  });
}

module.exports = { errorHandler };
