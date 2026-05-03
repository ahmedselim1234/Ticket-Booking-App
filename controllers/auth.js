const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const sendEmail = require("../util/sendEmail");
const AppError = require("../util/AppError");
const { successResponse, failResponse } = require("../util/response");
const logger = require("../util/logger");

exports.signup = async (req, res, next) => {
  try {
    const { first_name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return next(new AppError("Email already in use", 409));

    const hashedPass = await bcrypt.hash(password, 12);
    const user = await User.create({ first_name, email, password: hashedPass });

    const accessToken = _signAccess(user);
    const refreshToken = _signRefresh(user);

    _setRefreshCookie(res, refreshToken);

    logger.info("New user registered", { userId: user._id });
    return successResponse(res, 201, "Account created successfully", {
      accessToken,
      user: { id: user._id, name: user.first_name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) return next(new AppError("Invalid email or password", 401));

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return next(new AppError("Invalid email or password", 401));

    const accessToken = _signAccess(user);
    const refreshToken = _signRefresh(user);

    _setRefreshCookie(res, refreshToken);

    logger.info("User logged in", { userId: user._id });
    return successResponse(res, 200, "Logged in successfully", {
      accessToken,
      user: { id: user._id, name: user.first_name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};

exports.refresh = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) return next(new AppError("Not authenticated", 401));

  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
    if (err) return next(new AppError("Invalid or expired refresh token", 403));

    try {
      const user = await User.findById(decoded.userInfo.id);
      if (!user) return next(new AppError("User no longer exists", 401));

      const accessToken = _signAccess(user);
      return successResponse(res, 200, "Token refreshed", { accessToken });
    } catch (dbErr) {
      next(dbErr);
    }
  });
};

exports.logout = (req, res) => {
  res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "strict" });
  return successResponse(res, 200, "Logged out successfully");
};

exports.forgetPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(new AppError("No account found with that email", 404));

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedCode = crypto.createHash("sha256").update(resetCode).digest("hex");

    user.passwordResetCode = hashedCode;
    user.expireResetCode = Date.now() + 10 * 60 * 1000;
    user.verifyResetCode = false;
    await user.save({ validateBeforeSave: false });

    try {
      await sendEmail({
        email: user.email,
        subject: "Your password reset code (valid for 10 minutes)",
        message: `Hi ${user.first_name},\n\nYour password reset code is: ${resetCode}\n\nIf you did not request this, please ignore this email.`,
      });
    } catch (emailErr) {
      user.passwordResetCode = undefined;
      user.expireResetCode = undefined;
      user.verifyResetCode = undefined;
      await user.save({ validateBeforeSave: false });
      return next(new AppError("Failed to send reset email. Please try again.", 500));
    }

    logger.info("Password reset code sent", { userId: user._id });
    return successResponse(res, 200, "Reset code sent to your email");
  } catch (err) {
    next(err);
  }
};

exports.verifyResetCode = async (req, res, next) => {
  try {
    const { enteredCode } = req.body;
    const hashedCode = crypto.createHash("sha256").update(enteredCode).digest("hex");

    const user = await User.findOne({
      passwordResetCode: hashedCode,
      expireResetCode: { $gt: Date.now() },
    }).select("+passwordResetCode +expireResetCode +verifyResetCode");

    if (!user) return next(new AppError("Reset code is invalid or has expired", 400));

    user.verifyResetCode = true;
    await user.save({ validateBeforeSave: false });

    return successResponse(res, 200, "Code verified successfully");
  } catch (err) {
    next(err);
  }
};

exports.addNewPassword = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+verifyResetCode +passwordResetCode +expireResetCode");
    if (!user) return next(new AppError("No account found with that email", 404));
    if (!user.verifyResetCode) return next(new AppError("Please verify your reset code first", 400));

    user.password = await bcrypt.hash(password, 12);
    user.passwordResetCode = undefined;
    user.expireResetCode = undefined;
    user.verifyResetCode = undefined;
    await user.save({ validateBeforeSave: false });

    logger.info("Password changed", { userId: user._id });
    return successResponse(res, 200, "Password changed successfully");
  } catch (err) {
    next(err);
  }
};

// ── helpers ──────────────────────────────────────────────────────────────────

function _signAccess(user) {
  return jwt.sign(
    { userInfo: { id: user._id, role: user.role } },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
}

function _signRefresh(user) {
  return jwt.sign(
    { userInfo: { id: user._id, role: user.role } },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
}

function _setRefreshCookie(res, token) {
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}
