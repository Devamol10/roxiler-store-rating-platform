const { HTTP_STATUS } = require("../constants");
const storeService = require("../services/store.service");

async function getStores(req, res, next) {
  try {
    const data = await storeService.getStoresForUser(req.user.id);

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data,
    });
  } catch (error) {
    return next(error);
  }
}

async function searchStores(req, res, next) {
  try {
    const data = await storeService.getStoresForUser(req.user.id, req.query);

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getStores,
  searchStores,
};
