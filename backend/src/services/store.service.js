const prisma = require("../config/db");

async function getStoresForUser(userId, filters = {}) {
  const { name, address } = filters;
  const where = {
    ...(name
      ? {
          name: {
            contains: name,
            mode: "insensitive",
          },
        }
      : {}),
    ...(address
      ? {
          address: {
            contains: address,
            mode: "insensitive",
          },
        }
      : {}),
  };

  const stores = await prisma.store.findMany({
    where,
    orderBy: { name: "asc" },
    select: {
      name: true,
      address: true,
      ratings: {
        select: {
          userId: true,
          rating: true,
        },
      },
    },
  });

  return stores.map((store) => {
    const totalRatings = store.ratings.length;
    const overallRating = totalRatings
      ? Number(
          (
            store.ratings.reduce((sum, item) => sum + item.rating, 0) /
            totalRatings
          ).toFixed(1)
        )
      : null;
    const userRatingRecord = store.ratings.find((rating) => rating.userId === userId);

    return {
      name: store.name,
      address: store.address,
      overallRating,
      userRating: userRatingRecord ? userRatingRecord.rating : null,
    };
  });
}

module.exports = {
  getStoresForUser,
};
