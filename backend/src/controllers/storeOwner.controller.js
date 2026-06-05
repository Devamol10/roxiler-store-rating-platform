const { HTTP_STATUS } = require("../constants");
const storeOwnerService = require("../services/storeOwner.service");

async function getDashboard(req, res, next) {
  try {
    const data = await storeOwnerService.getDashboard(req.user.id);

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data,
    });
  } catch (error) {
    return next(error);
  }
}

async function getRatings(req, res, next) {
  try {
    const { sortBy, sortOrder } = req.query;
    const data = await storeOwnerService.getRatings(req.user.id, {
      sortBy,
      sortOrder,
    });

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getDashboard,
  getRatings,
};

