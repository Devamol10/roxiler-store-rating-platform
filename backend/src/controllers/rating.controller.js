const { HTTP_STATUS } = require("../constants");
const ratingService = require("../services/rating.service");

async function createRating(req, res, next) {
  try {
    await ratingService.createRating(req.user.id, req.body);

    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: "Rating submitted successfully",
    });
  } catch (error) {
    return next(error);
  }
}

async function updateRating(req, res, next) {
  try {
    await ratingService.updateRating(req.user.id, req.params.storeId, req.body);

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Rating updated successfully",
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createRating,
  updateRating,
};
