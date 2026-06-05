const prisma = require("../config/db");

async function getDashboard(userId) {
  const store = await prisma.store.findFirst({
    where: {
      ownerId: userId,
    },
    select: {
      name: true,
      ratings: {
        select: {
          rating: true,
        },
      },
    },
  });

  if (!store) {
    const error = new Error("Store not found");
    error.statusCode = 404;
    throw error;
  }

  const totalRatings = store.ratings.length;
  const averageRating = totalRatings
    ? Number(
        (
          store.ratings.reduce((sum, item) => sum + item.rating, 0) /
          totalRatings
        ).toFixed(1)
      )
    : 0;

  return {
    storeName: store.name,
    averageRating,
    totalRatings,
  };
}

async function getRatings(userId, { sortBy = "name", sortOrder = "asc" } = {}) {
  const store = await prisma.store.findFirst({
    where: {
      ownerId: userId,
    },
    select: {
      id: true,
    },
  });

  if (!store) {
    const error = new Error("Store not found");
    error.statusCode = 404;
    throw error;
  }

  const allowedSortFields = ["name", "email", "rating"];
  const allowedSortOrders = ["asc", "desc"];

  if (!allowedSortFields.includes(sortBy)) {
    const error = new Error(
      `sortBy must be one of: ${allowedSortFields.join(", ")}`
    );
    error.statusCode = 400;
    throw error;
  }

  if (!allowedSortOrders.includes(sortOrder)) {
    const error = new Error("sortOrder must be one of: asc, desc");
    error.statusCode = 400;
    throw error;
  }

  let orderBy = {};
  if (sortBy === "rating") {
    orderBy = { rating: sortOrder };
  } else {
    orderBy = { user: { [sortBy]: sortOrder } };
  }

  const ratings = await prisma.rating.findMany({
    where: {
      storeId: store.id,
    },
    orderBy,
    select: {
      rating: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  return ratings.map((r) => ({
    name: r.user.name,
    email: r.user.email,
    rating: r.rating,
  }));
}

module.exports = {
  getDashboard,
  getRatings,
};

