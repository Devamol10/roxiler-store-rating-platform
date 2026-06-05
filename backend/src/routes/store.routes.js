const express = require("express");
const { ROLES } = require("../constants");
const storeController = require("../controllers/store.controller");
const { authenticate, authorize } = require("../middleware/auth.middleware");

const router = express.Router();

router.get(
  "/search",
  authenticate,
  authorize(ROLES.USER),
  storeController.searchStores
);
router.get("/", authenticate, authorize(ROLES.USER), storeController.getStores);

module.exports = router;
