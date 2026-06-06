const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../config/db");
const { jwtSecret } = require("../config/env");
const { ROLES } = require("../constants");

/**
 * auth.service.js
 * Handles all authentication-related business logic.
 * This includes signing up new users, logging in, changing passwords, and updating profiles.
 */

// Register a new user on the platform
// New users are always assigned the 'USER' role by default for security
async function signup(payload) {
  const { name, email, address, password } = payload;

  // Check if someone already has this email before creating a new account
  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingUser) {
    const error = new Error("Email already in use");
    error.statusCode = 400;
    throw error;
  }

  // Hash the password with bcrypt (saltRounds = 10) before saving to DB
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      address,
      password: hashedPassword,
      role: ROLES.USER, // Public signup always creates a normal user
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

  return user;
}

// Authenticate a user and return a signed JWT token
async function login(email, password) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  // Using a generic message so attackers can't tell if email or password was wrong
  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  // Sign the JWT with user id, email and role â€” role is needed for frontend route guards
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    jwtSecret,
    { expiresIn: "1d" } // Token expires in 1 day
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
      role: user.role,
    },
  };
}

// Allows a logged-in user to change their own password
async function changePassword(userId, currentPassword, newPassword) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  // Must verify the current password before allowing the change
  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordValid) {
    const error = new Error("Incorrect current password");
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: userId },
    data: {
      password: hashedPassword,
    },
  });
}

// Update profile details (name and address) for the logged-in user
// Email is intentionally excluded â€” it acts as the unique login ID
async function updateProfile(userId, payload) {
  const { name, address } = payload;
  
  const user = await prisma.user.update({
    where: { id: userId },
    data: { name, address },
    select: {
      id: true,
      name: true,
      email: true,
      address: true,
      role: true,
    }
  });

  return user;
}

module.exports = {
  signup,
  login,
  changePassword,
  updateProfile,
};
