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

// TEMPORARY DEBUG ENDPOINT - REMOVE AFTER FIXING
const prisma = require("../config/db");
const bcrypt = require("bcryptjs");
router.post("/debug-login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.json({ found: false });
    const match = await bcrypt.compare(password, user.password);
    return res.json({ 
      found: true, 
      hashLen: user.password?.length,
      hashPrefix: user.password?.substring(0, 25),
      match,
      role: user.role 
    });
  } catch (e) {
    return res.json({ error: e.message });
  }
});

module.exports = router;
