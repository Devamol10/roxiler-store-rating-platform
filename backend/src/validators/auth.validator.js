const { body, validationResult } = require("express-validator");

// PDF: at least one uppercase + at least one special character
const PASSWORD_UPPERCASE = /[A-Z]/;
const PASSWORD_SPECIAL = /[!@#$%^&*(),.?":{}|<>_\-+=[\]\\/'`~]/;

const nameRules = (field = "name") =>
  body(field)
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 20, max: 60 })
    .withMessage("Name must be between 20 and 60 characters");

const emailRules = (field = "email") =>
  body(field)
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be a valid email address")
    .normalizeEmail({ gmail_remove_dots: false });

const passwordRules = (field = "password") =>
  body(field)
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8, max: 16 })
    .withMessage("Password must be between 8 and 16 characters")
    .matches(PASSWORD_UPPERCASE)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(PASSWORD_SPECIAL)
    .withMessage("Password must contain at least one special character");

const signupValidator = [
  nameRules("name"),
  emailRules("email"),
  body("address")
    .trim()
    .notEmpty()
    .withMessage("Address is required")
    .isLength({ max: 400 })
    .withMessage("Address must be at most 400 characters"),
  passwordRules("password"),
];

const loginValidator = [
  emailRules("email"),
  body("password").notEmpty().withMessage("Password is required"),
];

const changePasswordValidator = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  passwordRules("newPassword"),
  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password is required")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Confirm password must match new password");
      }
      return true;
    }),
];

const updateProfileValidator = [
  nameRules("name"),
  body("address")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Address cannot be empty if provided")
    .isLength({ max: 400 })
    .withMessage("Address must be at most 400 characters"),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

module.exports = {
  signupValidator,
  loginValidator,
  changePasswordValidator,
  updateProfileValidator,
  validate,
};
