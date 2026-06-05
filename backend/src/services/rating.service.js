const prisma = require("../config/db");

async function createRating(userId, payload) {
  const { storeId, rating } = payload;

  const [user, store, existingRating] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    }),
    prisma.store.findUnique({
      where: { id: storeId },
      select: { id: true },
    }),
    prisma.rating.findUnique({
      where: {
        userId_storeId: {
          userId,
          storeId,
        },
      },
      select: { id: true },
    }),
  ]);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 400;
    throw error;
  }

  if (!store) {
    const error = new Error("Store not found");
    error.statusCode = 400;
    throw error;
  }

  if (existingRating) {
    const error = new Error("You have already rated this store");
    error.statusCode = 400;
    throw error;
  }

  await prisma.rating.create({
    data: {
      userId,
      storeId,
      rating,
    },
  });
}

async function updateRating(userId, storeId, payload) {
  const { rating } = payload;

  const [store, existingRating] = await Promise.all([
    prisma.store.findUnique({
      where: { id: storeId },
      select: { id: true },
    }),
    prisma.rating.findUnique({
      where: {
        userId_storeId: {
          userId,
          storeId,
        },
      },
      select: { id: true },
    }),
  ]);

  if (!store) {
    const error = new Error("Store not found");
    error.statusCode = 400;
    throw error;
  }

  if (!existingRating) {
    const error = new Error("Rating not found for this store");
    error.statusCode = 400;
    throw error;
  }

  await prisma.rating.update({
    where: {
      userId_storeId: {
        userId,
        storeId,
      },
    },
    data: {
      rating,
    },
  });
}

module.exports = {
  createRating,
  updateRating,
};
