const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/env");
const { HTTP_STATUS } = require("../constants");

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;
  const token = req.cookies?.token || bearerToken;

  if (!token) {
    return res.status(HTTP_STATUS.UNAUTHORIZED || 401).json({
      success: false,
      message: "Authentication required",
    });
  }

  try {
    req.user = jwt.verify(token, jwtSecret);
    return next();
  } catch (_error) {
    return res.status(HTTP_STATUS.UNAUTHORIZED || 401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
}

function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(HTTP_STATUS.FORBIDDEN || 403).json({
        success: false,
        message: "Access denied",
      });
    }

    return next();
  };
}

module.exports = {
  authenticate,
  authorize,
};
