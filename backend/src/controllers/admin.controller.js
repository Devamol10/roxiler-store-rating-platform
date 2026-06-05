const adminService = require("../services/admin.service");
const { HTTP_STATUS, ROLES } = require("../constants");

async function getDashboardStats(_req, res, next) {
  try {
    const data = await adminService.getDashboardStats();
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data,
    });
  } catch (error) {
    return next(error);
  }
}

async function getUsers(req, res, next) {
  try {
    const data = await adminService.getUsers(req.query);
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data,
    });
  } catch (error) {
    return next(error);
  }
}

async function getUserById(req, res, next) {
  try {
    const user = await adminService.getUserById(req.params.id);
    const data =
      user.role === ROLES.STORE_OWNER
        ? {
            id: user.id,
            name: user.name,
            email: user.email,
            address: user.address,
            role: user.role,
            rating: user.ownedStores.length
              ? Number(
                  (
                    user.ownedStores.reduce((sum, store) => {
                      const totalRatings = store.ratings.length;
                      const storeAverage = totalRatings
                        ? store.ratings.reduce(
                            (ratingSum, item) => ratingSum + item.rating,
                            0
                          ) / totalRatings
                        : 0;

                      return sum + storeAverage;
                    }, 0) / user.ownedStores.length
                  ).toFixed(1)
                )
              : 0,
            stores: user.ownedStores.map((store) => ({
              id: store.id,
              name: store.name,
              rating: store.ratings.length
                ? Number(
                    (
                      store.ratings.reduce((sum, item) => sum + item.rating, 0) /
                      store.ratings.length
                    ).toFixed(1)
                  )
                : 0,
            })),
          }
        : {
            id: user.id,
            name: user.name,
            email: user.email,
            address: user.address,
            role: user.role,
          };

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data,
    });
  } catch (error) {
    return next(error);
  }
}

async function getStores(req, res, next) {
  try {
    const stores = await adminService.getStores(req.query);
    const data = stores.map((store) => {
      const totalRatings = store.ratings.length;
      const rating = totalRatings
        ? Number(
            (
              store.ratings.reduce((sum, item) => sum + item.rating, 0) /
              totalRatings
            ).toFixed(1)
          )
        : 0;

      return {
        name: store.name,
        email: store.email,
        address: store.address,
        rating,
      };
    });

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data,
    });
  } catch (error) {
    return next(error);
  }
}

async function createUser(req, res, next) {
  try {
    const data = await adminService.createUser(req.body);
    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data,
    });
  } catch (error) {
    return next(error);
  }
}

async function createStore(req, res, next) {
  try {
    const data = await adminService.createStore(req.body);
    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getDashboardStats,
  getUsers,
  getUserById,
  getStores,
  createUser,
  createStore,
};
