const express = require("express");
const { ROLES } = require("../constants");
const ratingController = require("../controllers/rating.controller");
const { authenticate, authorize } = require("../middleware/auth.middleware");
const {
  createRatingValidator,
  updateRatingValidator,
  validate,
} = require("../validators/rating.validator");

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize(ROLES.USER),
  createRatingValidator,
  validate,
  ratingController.createRating
);

router.patch(
  "/:storeId",
  authenticate,
  authorize(ROLES.USER),
  updateRatingValidator,
  validate,
  ratingController.updateRating
);

module.exports = router;
