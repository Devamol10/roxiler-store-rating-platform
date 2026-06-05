const { HTTP_STATUS } = require("../constants");
const authService = require("../services/auth.service");

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

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const { token, user } = await authService.login(email, password);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
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

async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    await authService.changePassword(req.user.id, currentPassword, newPassword);

    return res.status(HTTP_STATUS.OK || 200).json({
      success: true,
      message: "Password changed successfully",
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
};
