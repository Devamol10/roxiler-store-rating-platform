const express = require("express");
const adminController = require("../controllers/admin.controller");
const { ROLES } = require("../constants");
const { authenticate, authorize } = require("../middleware/auth.middleware");
const {
  createUserValidator,
  createStoreValidator,
  userIdParamValidator,
  validate,
} = require("../validators/admin.validator");

const router = express.Router();

router.use(authenticate, authorize(ROLES.ADMIN));

router.get("/dashboard", adminController.getDashboardStats);
router.get("/users", adminController.getUsers);
router.get("/users/:id", userIdParamValidator, validate, adminController.getUserById);
router.get("/stores", adminController.getStores);
router.post("/users", createUserValidator, validate, adminController.createUser);
router.post("/stores", createStoreValidator, validate, adminController.createStore);

module.exports = router;
