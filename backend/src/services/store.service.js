const prisma = require("../config/db");

/**
 * store.service.js
 * Business logic for the Normal User's store browsing experience.
 * Fetches stores from DB and computes overall ratings and the user's own rating.
 */

// Get all stores with search (name/address) and sorting support
// Also calculates the overall rating and the current user's submitted rating
async function getStoresForUser(userId, filters = {}) {
  const { name, address, sortBy = "name", sortOrder = "asc" } = filters;
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

    select: {
      id: true,
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

  // Transform the raw DB data: compute average rating and find the user's own rating
  const mappedStores = stores.map((store) => {
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
      id: store.id,
      name: store.name,
      address: store.address,
      overallRating,
      userRating: userRatingRecord ? userRatingRecord.rating : null,
    };
  });

  // Sort the final array in memory since ratings are computed fields (not in DB directly)
  mappedStores.sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];

    if (valA === valB) return 0;

    if (valA === null) valA = -1;
    if (valB === null) valB = -1;

    // Convert strings to lowercase for case-insensitive sorting
    if (typeof valA === "string") valA = valA.toLowerCase();
    if (typeof valB === "string") valB = valB.toLowerCase();

    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  return mappedStores;
}

module.exports = {
  getStoresForUser,
};
