const { HTTP_STATUS } = require("../constants");

/**
 * error.middleware.js
 * Global error handler for Express.
 * Any error thrown in a route controller and passed to next(error) lands here.
 * It reads the statusCode attached to the error object, or defaults to 500.
 */
function errorHandler(error, _req, res, _next) {
  const statusCode = error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;

  return res.status(statusCode).json({
    success: false,
    message: error.message || "Something went wrong",
  });
}

module.exports = { errorHandler };
