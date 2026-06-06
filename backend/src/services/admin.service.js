const bcrypt = require("bcryptjs");
const prisma = require("../config/db");
const { ROLES } = require("../constants");

/**
 * admin.service.js
 * Business logic for all System Administrator operations.
 * Covers dashboard stats, user/store management, and data retrieval.
 */

// Fetch total counts for the admin dashboard overview panel
async function getDashboardStats() {
  const [totalUsers, totalStores, totalRatings] = await Promise.all([
    prisma.user.count(),
    prisma.store.count(),
    prisma.rating.count(),
  ]);

  return {
    totalUsers,
    totalStores,
    totalRatings,
  };
}

// Fetch all users with optional filters (name, email, address, role) and sorting
async function getUsers(filters = {}) {
  const { name, email, address, role, sortBy = "name", sortOrder = "asc" } =
    filters;
  const allowedSortFields = ["name", "email", "role"];
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

  const where = {
    ...(name
      ? {
          name: {
            contains: name,
            mode: "insensitive",
          },
        }
      : {}),
    ...(email
      ? {
          email: {
            contains: email,
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
    ...(role ? { role } : {}),
  };

  return prisma.user.findMany({
    where,
    orderBy: { [sortBy]: sortOrder },
    select: {
      id: true,
      name: true,
      email: true,
      address: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

// Fetch a single user's full detail - if they are a Store Owner, include their store ratings
async function getUserById(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      address: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      ownedStores: {
        select: {
          id: true,
          name: true,
          ratings: {
            select: {
              rating: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
}

// Fetch all stores with optional filters and sorting. Includes rating data via relation.
async function getStores(filters = {}) {
  const { name, email, address, sortBy = "name", sortOrder = "asc" } = filters;
  const allowedSortFields = ["name", "email"];
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

  const where = {
    ...(name
      ? {
          name: {
            contains: name,
            mode: "insensitive",
          },
        }
      : {}),
    ...(email
      ? {
          email: {
            contains: email,
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

  return prisma.store.findMany({
    where,
    orderBy: { [sortBy]: sortOrder },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      ratings: {
        select: {
          rating: true,
        },
      },
    },
  });
}

// Admin creates a new user (can assign any role: USER, STORE_OWNER, or ADMIN)
async function createUser(payload) {
  const { name, email, password, address, role } = payload;

  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingUser) {
    const error = new Error("Email already exists");
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    return await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        address,
        role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
      },
    });
  } catch (error) {
    if (error.code === "P2002" && error.meta?.target?.includes("email")) {
      const conflictError = new Error("Email already exists");
      conflictError.statusCode = 409;
      throw conflictError;
    }
    throw error;
  }
}

// Admin creates a new store and links it to an existing STORE_OWNER user
async function createStore(payload) {
  const { name, email, address, ownerId } = payload;

  // Validate that the provided ownerId actually belongs to a STORE_OWNER role user
  const owner = await prisma.user.findFirst({
    where: {
      id: ownerId,
      role: ROLES.STORE_OWNER,
    },
    select: { id: true },
  });

  if (!owner) {
    const error = new Error("A valid store owner is required");
    error.statusCode = 400;
    throw error;
  }

  return prisma.store.create({
    data: {
      name,
      email,
      address,
      ownerId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      address: true,
      ownerId: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

module.exports = {
  getDashboardStats,
  getUsers,
  getUserById,
  getStores,
  createUser,
  createStore,
};
