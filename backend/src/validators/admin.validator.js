const { body, param, validationResult } = require("express-validator");
const { ROLES } = require("../constants");

const PASSWORD_UPPERCASE = /[A-Z]/;
const PASSWORD_SPECIAL = /[!@#$%^&*(),.?":{}|<>_\-+=[\]\\/'`~]/;

const assignableRoles = [ROLES.USER, ROLES.STORE_OWNER, ROLES.ADMIN];

const createUserValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 20, max: 60 })
    .withMessage("Name must be between 20 and 60 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be a valid email address")
    .normalizeEmail(),
  body("address")
    .optional()
    .trim()
    .isLength({ max: 400 })
    .withMessage("Address must be at most 400 characters"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8, max: 16 })
    .withMessage("Password must be between 8 and 16 characters")
    .matches(PASSWORD_UPPERCASE)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(PASSWORD_SPECIAL)
    .withMessage("Password must contain at least one special character"),
  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn(assignableRoles)
    .withMessage(`Role must be one of: ${assignableRoles.join(", ")}`),
];

const createStoreValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Store name is required")
    .isLength({ min: 3, max: 120 })
    .withMessage("Store name must be between 3 and 120 characters"),
  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Email must be a valid email address")
    .normalizeEmail(),
  body("address")
    .optional()
    .trim()
    .isLength({ max: 400 })
    .withMessage("Address must be at most 400 characters"),
  body("ownerId")
    .trim()
    .notEmpty()
    .withMessage("Owner ID is required"),
];

const userIdParamValidator = [
  param("id").trim().notEmpty().withMessage("User ID is required"),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
      })),
    });
  }

  return next();
};

module.exports = {
  createUserValidator,
  createStoreValidator,
  userIdParamValidator,
  validate,
};
