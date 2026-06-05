const express = require("express");
const { ROLES } = require("../constants");
const storeOwnerController = require("../controllers/storeOwner.controller");
const { authenticate, authorize } = require("../middleware/auth.middleware");

const router = express.Router();

router.get(
  "/dashboard",
  authenticate,
  authorize(ROLES.STORE_OWNER),
  storeOwnerController.getDashboard
);

router.get(
  "/ratings",
  authenticate,
  authorize(ROLES.STORE_OWNER),
  storeOwnerController.getRatings
);

module.exports = router;
