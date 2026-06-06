const express = require("express");
const authController = require("../controllers/auth.controller");
const { authenticate } = require("../middleware/auth.middleware");
const {
  signupValidator,
  loginValidator,
  changePasswordValidator,
  updateProfileValidator,
  validate,
} = require("../validators/auth.validator");

const router = express.Router();

router.post("/signup", signupValidator, validate, authController.signup);
router.post("/login", loginValidator, validate, authController.login);
router.post("/logout", authController.logout);
router.patch(
  "/change-password",
  authenticate,
  changePasswordValidator,
  validate,
  authController.changePassword
);
router.patch(
  "/profile",
  authenticate,
  updateProfileValidator,
  validate,
  authController.updateProfile
);

module.exports = router;
