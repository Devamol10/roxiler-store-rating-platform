const { HTTP_STATUS } = require("../constants");
const authService = require("../services/auth.service");

/**
 * auth.controller.js
 * Handles HTTP requests and responses for authentication routes.
 * Each function calls the auth service and sends back the formatted response.
 */

// POST /api/auth/signup - Public route, creates a new normal user account
async function signup(req, res, next) {
  try {
    const data = await authService.signup(req.body);

    return res.status(HTTP_STATUS.CREATED || 201).json({
      success: true,
      data,
    });
  } catch (error) {
    return next(error);
  }
}

// POST /api/auth/login - Validates credentials and sets an httpOnly JWT cookie
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const { token, user } = await authService.login(email, password);

    // Store the JWT in a cookie instead of localStorage for better security
    res.cookie("token", token, {
      httpOnly: true, // Prevents JavaScript from reading the cookie (XSS protection)
      secure: process.env.NODE_ENV === "production", // Only send over HTTPS in prod
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      sameSite: "lax",
    });

    return res.status(HTTP_STATUS.OK || 200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return next(error);
  }
}

// POST /api/auth/logout - Clears the JWT cookie to end the session
async function logout(req, res, next) {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res.status(HTTP_STATUS.OK || 200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return next(error);
  }
}

// PATCH /api/auth/change-password - Protected route, user must be logged in
async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    // req.user is set by the authenticate middleware after verifying the JWT
    await authService.changePassword(req.user.id, currentPassword, newPassword);

    return res.status(HTTP_STATUS.OK || 200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    return next(error);
  }
}

// PATCH /api/auth/profile - Protected route, updates name and address only
async function updateProfile(req, res, next) {
  try {
    const { name, address } = req.body;
    const updatedUser = await authService.updateProfile(req.user.id, { name, address });

    return res.status(HTTP_STATUS.OK || 200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  signup,
  login,
  logout,
  changePassword,
  updateProfile,
};
